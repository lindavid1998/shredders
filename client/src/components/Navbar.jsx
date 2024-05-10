import React from 'react';
import { Link } from 'react-router-dom';
const version = import.meta.env.VITE_API_VERSION;
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'react-router-dom';
import Button from '../components/Button';
import Avatar from './Avatar';

const Navbar = () => {
	const { user, logout } = useAuth();
	const { pathname } = useLocation();

	if (pathname.includes('/auth')) return null;

	// route to home if logged in, otherwise route to landing
	const link = user ? `/${version}` : '/';

	return (
		<div className='w-full max-w-screen-lg h-16 flex items-center px-10'>
			<div className='flex items-center w-full'>
				<Link to={link}>
					<h1>Shredders</h1>
				</Link>

				<ul className='flex ml-auto gap-4'>
					{!user && (
						<Link to={`/${version}/auth/login`}>
							<Button text='Log in' color='secondary' />
						</Link>
					)}

					{user && <Button text='Sign out' color='tertiary' onClick={logout} />}

					{user && <Avatar />}
				</ul>
			</div>
		</div>
	);
};

export default Navbar;
