import React from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import LoginImg from '../../public/snowboard-login-hero.jpg';
import SignupImg from '../../public/snowboard-signup-hero.jpg';

const Auth = ({ type }) => {
  const HeroImg = type == 'Login' ? LoginImg : SignupImg

  const Form = type == 'Login' ? LoginForm : SignupForm

	return (
		<div className='flex h-screen flex-col justify-center items-center md:gap-8 md:flex-row'>
			<div className='h-full w-1/2 grow flex justify-center items-center'>
				<Form className='grow' />
			</div>

			<div className='h-full w-1/2 grow overflow-hidden md:p-4 flex justify-center items-center pb-8'>
				<img className='h-full object-cover rounded-3xl grow' src={HeroImg} />
			</div>
		</div>
	);
};

export default Auth;
