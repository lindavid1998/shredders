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

	return (
		<div className='w-full max-w-screen-lg min-h-16 h-16 flex items-center grow-0'>
			<div className='flex items-center w-full'>
				<Link to={user ? `/${version}` : '/'}>
					<h1>Shredders</h1>
				</Link>

				<ul className='flex ml-auto gap-4'>
					{user ? (
						<>
							<Button text='Sign out' color='tertiary' onClick={logout} />
							<Avatar />
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
		</div>
	);
};

export default Navbar;
