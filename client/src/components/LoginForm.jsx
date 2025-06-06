import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import TextInput from './TextInput';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const version = import.meta.env.VITE_API_VERSION;

const LoginForm = ({ className }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const { setIsLoading, setUser } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setIsLoading(true);
			const response = await fetch(
				`${BACKEND_BASE_URL}/${version}/auth/login`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
					body: JSON.stringify({ email, password }),
				}
			);

			const data = await response.json();

			if (!response.ok) {
				const error = data.errors[0].msg;
				setError(error);
				return;
			}

			setError('');
			setUser(data);
			navigate(`/${version}`);
		} catch (error) {
			setError(error);
		}
		setIsLoading(false);
	};

	return (
		<div className={`max-w-lg p-4 flex flex-col gap-4 ${className}`}>
			<h2>Welcome back!</h2>

			<div className='bg-gray-100 p-4 rounded-lg'>
				<div className='font-bold'>Demo mode (read-only)</div>
				<div>Email: demo@email.com</div>
				<div>Password: demo123</div>
			</div>

			<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
				<TextInput
					type='email'
					label='Email'
					placeholder='Email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required={true}
				/>

				<TextInput
					type='password'
					label='Password'
					placeholder='Password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required={true}
				/>

				{error && <p className='error'>{error}</p>}

				<Button type='submit' text='Login' color='tertiary' />
			</form>

			<p className='text-center'>
				Don&apos;t have an account?{' '}
				<Link className='text-blue-600' to={`/${version}/auth/signup`}>
					Sign up now
				</Link>
			</p>
		</div>
	);
};

export default LoginForm;
