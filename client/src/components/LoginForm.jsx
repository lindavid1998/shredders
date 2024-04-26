import { useState } from 'react';
import Button from './Button';
import TextInput from './TextInput';

const LoginForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch('http://localhost:3000/v1/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				const error = data.errors[0].msg;
				console.log(`error: ${error}`);
				setError(error);
				return;
			}

			console.log(`token: ${data.token}`);
			setError('');
		} catch (error) {
			setError(error);
		}
	};

	return (
		<div className='max-w-lg p-4 flex flex-col gap-4'>
			<h2 className='tracking-tight text-2xl font-bold'>Welcome back!</h2>

			<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
				<TextInput
					label='Email'
					placeholder='Email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>

				<TextInput
					type='password'
					label='Password'
					placeholder='Password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>

				{error && <p className='text-red-500 text-center'>{error}</p>}

				<Button type='submit' text='Login' />
			</form>

			<p className='text-center'>
				Don&apos;t have an account? <a href='/' className='text-blue-600'>Sign up now</a>
			</p>
		</div>
	);
};

export default LoginForm;
