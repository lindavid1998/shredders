import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { Link } from 'react-router-dom';
const version = import.meta.env.VITE_API_VERSION;
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'react-router-dom';
import Button from '../components/Button';
import Avatar from './Avatar';
import { faBars } from '@fortawesome/free-solid-svg-icons';
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
})

const Navbar = () => {
	const { user, logout } = useAuth();
	const { pathname } = useLocation();
	const [showDropdown, setShowDropdown] = useState(false)
	const dropdownRef = useRef(null)

	if (pathname.includes('/auth')) return null;

	const handleOutsideClick = (event) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setShowDropdown(false)
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleOutsideClick);
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, []);

	return (
		<div className='flex items-center max-w-screen-xl w-full py-3'>
			<Link to={user ? `/${version}` : '/'}>
				<h1 style={{ fontWeight: 'bold' }}>Shredders</h1>
			</Link>

			<div className='md:hidden ml-auto cursor-pointer relative'>
				<FontAwesomeIcon size='lg' icon={faBars} onClick={() => setShowDropdown(true)} />
				{showDropdown && <Dropdown className='absolute right-0' ref={dropdownRef} />}
			</div>

			<ul className='hidden md:flex ml-auto gap-10 items-center'>
				<h6 className='navbar-item'>About</h6>

				<h6 className='navbar-item'>Pricing</h6>

				{user ? (
					<>
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
		</div>
	);
};

export default Navbar;
