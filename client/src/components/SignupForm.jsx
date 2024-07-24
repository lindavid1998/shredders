import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import TextInput from './TextInput';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const version = import.meta.env.VITE_API_VERSION;

const SignupForm = ({ className }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [first_name, setFirstname] = useState('');
	const [last_name, setLastname] = useState('');
	const navigate = useNavigate();
	const { setIsLoading, setUser } = useAuth();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await fetch(
				`http://localhost:3000/${version}/auth/signup`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
					body: JSON.stringify({ email, password, first_name, last_name }),
				}
			);

			const data = await response.json();

			if (!response.ok) {
				const error = data.errors[0].msg;
				setError(error);
				return;
			}

			setError('');
			setUser(data.user);
			navigate(`/${version}`);
		} catch (error) {
			setError(error);
		}
		setIsLoading(false);
	};

	return (
		<div className={`max-w-lg p-4 flex flex-col gap-4 ${className}`}>
			<h2>Create an account</h2>

			<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
				<TextInput
					label='First name'
					placeholder='First name'
					value={first_name}
					onChange={(e) => setFirstname(e.target.value)}
					required={true}
				/>

				<TextInput
					label='Last name'
					placeholder='Last name'
					value={last_name}
					onChange={(e) => setLastname(e.target.value)}
					required={true}
				/>

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

				<Button type='submit' text='Sign up' color='tertiary'/>
			</form>

			<p className='text-center'>
				Already have an account?{' '}
				<Link className='text-blue-600' to={`/${version}/auth/login`}>
					Log in
				</Link>
			</p>
		</div>
	);
};

export default SignupForm;
