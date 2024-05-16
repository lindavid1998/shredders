import React from 'react';
const version = import.meta.env.VITE_API_VERSION;
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
	const navigate = useNavigate();

	return (
		<div className='landing w-screen'>
			<div className='hero-text'>
				<h1>Plan Your Perfect Snow Adventure with your Friends</h1>
				
				<Button
					text='Get started'
					onClick={() => navigate(`/${version}/auth/login`)}
				/>
			</div>

			<div className='hero-img' />
		</div>
	);
};

export default Landing;
