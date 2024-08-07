import React from 'react';
const version = import.meta.env.VITE_API_VERSION;
import Button from '../components/Button';
import Testimonial from '../components/Testimonial';
import { useNavigate } from 'react-router-dom';
import HeroImg from '/landing.jpg';

const Hero = () => {
	const navigate = useNavigate();

	return (
		<div className='hero relative w-full flex flex-col justify-center items-center gap-10 md:gap-8'>
			{/* <div className='hero-img' /> */}
			<img className='hero-img' src={HeroImg}></img>

			<div className='flex flex-col hero-text justify-center items-center md:absolute top-14 w-full max-w-screen-xl px-5 mx-auto'>
				<div className='max-w-md'>
					<h2
						className='text-center md:text-white text-current'
						style={{ fontWeight: 'bold' }}
					>
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
};

const Reviews = () => {
	return (
		<div className='flex flex-col w-full gap-6 items-center'>
			<h3>Customer Reviews</h3>
			<div className='flex flex-col justify-center items-center flex-wrap md:flex-row gap-6 md:gap-16'>
				<Testimonial
					content={`
						"This app made planning my snowboard trip with friends so easy!
						We could all agree on dates, choose the best resort, and invite everyone directly through the app.
						The group chat feature was a game-changer. Highly recommended for hassle-free trip planning!"
					`}
					author='Shaun White'
				/>

				<Testimonial
					content={`
						"This app is a must-have for anyone planning a snowboard trip with friends.
						It took the stress out of organizing everything. We could easily see who was
						available and vote on where to go. The whole process was smooth and fun. Five stars!"
					`}
					author='Red Gerrard'
				/>

				<Testimonial
					content={`
						"I love how this app simplifies planning snowboard trips with friends.
						We set our dates, chose a resort, and sent invites without any hassle. 
						The group chat and voting features are brilliant. It made organizing everything
						so much more efficient and fun!"
					`}
					author='Zeb Powell'
				/>

			</div>

		</div>
	);
};

const Landing = () => {
	return (
		<div className='flex flex-col w-full gap-10'>
			<Hero></Hero>
			<Reviews></Reviews>
		</div>
	);
};

export default Landing;
