import React from 'react';
const version = import.meta.env.VITE_API_VERSION;
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
	const navigate = useNavigate();

	return (
		<div className='hero relative w-full flex flex-col justify-center items-center md:gap-8'>
			<div className='hero-img' />

			<div className='hero-text md:absolute top-14 w-full max-w-screen-xl px-5 mx-auto'>
				<div className='max-w-md'>
					<h2 style={{ fontWeight: 'bold' }}>
						Plan Your Perfect Snow Adventure
					</h2>
				</div>

				<Button
					text='Sign up'
					onClick={() => navigate(`/${version}/auth/login`)}
					color='tertiary'
				/>
			</div>
		</div>
	);
}

const Landing = () => {
	return (
		<>
			<Hero></Hero>
		</>
	);
};

export default Landing;
