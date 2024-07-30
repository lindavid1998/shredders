import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { Link } from 'react-router-dom';
const version = import.meta.env.VITE_API_VERSION;
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'react-router-dom';
import Button from '../components/Button';
import Avatar from './Avatar';
import {
	faBars,
	faUserGroup,
	faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Dropdown = forwardRef(({ className }, ref) => {
	const { user, logout } = useAuth();

	return (
		<div className={`${className} w-24 drop-shadow-lg z-50`} ref={ref}>
			<ul className='flex flex-col items-start'>
				<h6 className='nav-dropdown-item'>About</h6>
				<h6 className='nav-dropdown-item'>Pricing</h6>

				{user && (
					<h6 className='nav-dropdown-item' onClick={logout}>
						Logout
					</h6>
				)}

				{user && <h6 className='nav-dropdown-item'>Friend Requests</h6>}

				{!user && (
					<h6 className='nav-dropdown-item'>
						<Link to={`/${version}/auth/login`}>Login</Link>
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
});

const FriendRequest = ({ name, avatar_url }) => {
	return (
		<div className='flex gap-2 items-center'>
			<Avatar avatar_url={avatar_url} />

			<div className='flex flex-col fit-content'>
				<div>{name}</div>
				<div className='flex gap-2'>
					<Button size='sm' text='Confirm' color='tertiary' />
					<Button size='sm' text='Delete' />
				</div>
			</div>
		</div>
	);
};

const Sidebar = ({ friendRequests, isOpen, handleClose }) => {
	return (
		<div className={`sidebar-container ${isOpen ? 'open' : 'closed'}`}>
			<div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
				<div className='flex items-center'>
					<h4>Friend Requests</h4>

					<FontAwesomeIcon
						className='ml-auto cursor-pointer'
						icon={faArrowRight}
						onClick={handleClose}
					/>
				</div>

				{friendRequests.length > 0 ? friendRequests.map((request, index) => (
					<FriendRequest
						name={`${request.first_name} ${request.last_name}`}
						avatar_url={request.avatar_url}
						key={index}
					/>
				)) : (<div>No incoming friend requests</div>)}
			</div>
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
	const dropdownRef = useRef(null);

	const handleOutsideClick = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setShowDropdown(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleOutsideClick);
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, []);

	useEffect(() => {
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
			} catch (error) {
				console.log(error);
			}
		};
		fetchFriendRequests();
		setIsLoading(false);
	}, []);

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
					<Dropdown className='absolute right-0' ref={dropdownRef} />
				)}
			</div>

			<ul className='hidden md:flex ml-auto gap-10 items-center'>
				<h6 className='navbar-item'>About</h6>

				<h6 className='navbar-item'>Pricing</h6>

				{user ? (
					<>
						<FontAwesomeIcon
							size='lg'
							icon={faUserGroup}
							className='cursor-pointer'
							onClick={() => setIsSidebarOpen(true)}
						/>
						<Button text='Sign out' color='tertiary' onClick={logout} />
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
				friendRequests={friendRequests}
				isOpen={isSidebarOpen}
				handleClose={() => setIsSidebarOpen(false)}
			/>
		</div>
	);
};

export default Navbar;
