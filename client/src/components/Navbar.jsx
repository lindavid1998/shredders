import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { Link } from 'react-router-dom';
const version = import.meta.env.VITE_API_VERSION;
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'react-router-dom';
import Button from '../components/Button';
import Avatar from './Avatar';
import Sidebar from './Sidebar';
import { faBars, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Dropdown = forwardRef(
	({ className, handleOpenRequests, friendRequestCount }, ref) => {
		const { user, logout } = useAuth();

		return (
			<div className={`${className} min-w-24 drop-shadow-lg z-50`} ref={ref}>
				<ul className='flex flex-col items-start'>
					<h6 className='nav-dropdown-item'>About</h6>
					<h6 className='nav-dropdown-item'>Pricing</h6>

					{user && (
						<h6 className='nav-dropdown-item' onClick={handleOpenRequests}>
							Friend requests ({friendRequestCount})
						</h6>
					)}

					{user && (
						<h6 className='nav-dropdown-item' onClick={logout}>
							Sign out
						</h6>
					)}

					{!user && (
						<h6 className='nav-dropdown-item'>
							<Link to={`/${version}/auth/login`}>Log in</Link>
						</h6>
					)}

					{!user && (
						<h6 className='nav-dropdown-item'>
							<Link to={`/${version}/auth/signup`}>Sign up</Link>
						</h6>
					)}
				</ul>
			</div>
		);
	}
);

const FriendRequest = ({ id, name, avatarUrl, handleClick }) => {
	return (
		<div className='flex gap-2 items-center' id={id}>
			<Avatar avatar_url={avatarUrl} />

			<div className='flex flex-col fit-content'>
				<div>{name}</div>
				<div className='flex gap-2'>
					<Button
						size='sm'
						text='Accept'
						color='tertiary'
						onClick={() => handleClick(id, 'accept')}
					/>
					<Button
						size='sm'
						text='Reject'
						onClick={() => handleClick(id, 'reject')}
					/>
				</div>
			</div>
		</div>
	);
};

const FriendRequests = ({ friendRequests, handleClickFriendRequest }) => {
	if (friendRequests.length == 0) return <div>No incoming friend requests</div>;

	return (
		<div className='flex flex-col gap-4'>
			{friendRequests.map((request, index) => (
				<FriendRequest
					name={`${request.first_name} ${request.last_name}`}
					avatarUrl={request.avatar_url}
					key={index}
					handleClick={handleClickFriendRequest}
					id={request.id}
				/>
			))}
		</div>
	);
};

const Navbar = () => {
	const { user, logout } = useAuth();
	const { pathname } = useLocation();
	const [showDropdown, setShowDropdown] = useState(false);
	const [friendRequests, setFriendRequests] = useState([]);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [friendRequestCount, setFriendRequestCount] = useState(0);
	const dropdownRef = useRef(null);

	const handleOutsideClick = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setShowDropdown(false);
		}
	};

	const fetchFriendRequests = async () => {
		try {
			const response = await fetch(
				`http://localhost:3000/${version}/friends/requests`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				}
			);

			const data = await response.json();

			if (!response.ok) {
				const error = data.errors[0].msg;
				console.log(error);
				return;
			}

			setFriendRequests(data);
			setFriendRequestCount(data.length);
		} catch (error) {
			console.log(error);
		}
	};

	const handleClickFriendRequest = async (requestId, action) => {
		// action can be reject or accept
		try {
			const response = await fetch(
				`http://localhost:3000/${version}/friends/${action}/${requestId}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				}
			);

			if (!response.ok) {
				const data = await response.json();
				const error = data.errors[0].msg;
				console.log(error);
				return;
			}

			fetchFriendRequests(); // update friend requests array state variable
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchFriendRequests();
		setIsLoading(false);
		document.addEventListener('mousedown', handleOutsideClick);
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [pathname]);

	if (pathname.includes('/auth')) return null;

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className='flex items-center max-w-screen-xl w-full py-3'>
			<Link to={user ? `/${version}` : '/'}>
				<h1 style={{ fontWeight: 'bold' }}>Shredders</h1>
			</Link>

			<div className='md:hidden ml-auto cursor-pointer relative'>
				<FontAwesomeIcon
					size='lg'
					icon={faBars}
					onClick={() => setShowDropdown(true)}
				/>
				{showDropdown && (
					<Dropdown
						className='absolute right-0'
						ref={dropdownRef}
						handleOpenRequests={() => setIsSidebarOpen(true)}
						friendRequestCount={friendRequestCount}
					/>
				)}
			</div>

			<ul className='hidden md:flex ml-auto gap-10 items-center'>
				<h6 className='navbar-item'>About</h6>

				<h6 className='navbar-item'>Pricing</h6>

				{user ? (
					<>
						<div className='relative' onClick={() => setIsSidebarOpen(true)}>
							<FontAwesomeIcon
								size='lg'
								icon={faUserGroup}
								className='cursor-pointer'
							/>
							{friendRequestCount > 0 && (
								<span className='absolute -right-2 -top-2 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center cursor-pointer'>
									{friendRequestCount}
								</span>
							)}
						</div>
						<Button
							text='Sign out'
							color='secondary'
							onClick={logout}
							size='sm'
						/>
						<Avatar avatar_url={user.avatar_url} />
					</>
				) : (
					<>
						<Link to={`/${version}/auth/login`}>
							<Button text='Log in' color='secondary' />
						</Link>

						<Link to={`/${version}/auth/signup`}>
							<Button text='Sign up' color='tertiary' />
						</Link>
					</>
				)}
			</ul>

			<Sidebar
				isOpen={isSidebarOpen}
				handleClose={() => setIsSidebarOpen(false)}
				header='Friend requests'
			>
				<FriendRequests
					handleClickFriendRequest={handleClickFriendRequest}
					friendRequests={friendRequests}
				/>
			</Sidebar>
		</div>
	);
};

export default Navbar;
