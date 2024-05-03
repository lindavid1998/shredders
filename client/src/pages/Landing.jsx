import React from 'react';
import { Link } from 'react-router-dom';
const version = import.meta.env.VITE_API_VERSION;
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

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

			{user && (
				<Button
					type='button'
					text='Plan a trip'
					onClick={() => navigate(`/${version}/trips/plan`)}
				/>
			)}

			{user && <Button type='button' text='Log out' onClick={logout} />}
		</div>
	);
};

export default Landing;
