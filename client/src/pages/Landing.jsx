import React from 'react';
import { Link } from 'react-router-dom';
const version = import.meta.env.VITE_API_VERSION;
import { useAuth } from '../hooks/useAuth';

const Landing = () => {
	const { logout } = useAuth();

	return (
		<div className='flex flex-col'>
			<h1>Welcome to Shredders!</h1>
			<Link className='text-blue-600' to={`/${version}/auth/login`}>
				Log in
			</Link>

			<Link className='text-blue-600' to={`/${version}/auth/signup`}>
				Sign up
			</Link>

			<Link className='text-blue-600' to={`/${version}`}>
				Home
			</Link>

			<div onClick={logout}>Log out</div>
		</div>
	);
};

export default Landing;
