import React from 'react';
const version = import.meta.env.VITE_API_VERSION;
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
	const navigate = useNavigate();

	return (
		<div className='landing w-screen'>
			<div className='hero-text'>
				<h2 style={{ fontWeight: 'bold' }}>Plan Your Perfect Snow Adventure</h2>

				<Button
					text='Sign up'
					onClick={() => navigate(`/${version}/auth/login`)}
					color='tertiary'
				/>
			</div>

			<div className='hero-img' />
		</div>
	);
};

export default Landing;
