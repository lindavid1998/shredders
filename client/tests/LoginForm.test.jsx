import LoginForm from '../src/components/LoginForm.jsx';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

const mockSetUser = jest.fn();
const mockSetIsLoading = jest.fn();
const mockLogout = jest.fn();
const mockUser = null;
const mockIsLoading = false;
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockNavigate,
}));

jest.mock('../src/hooks/useAuth', () => ({
	useAuth: () => ({
		user: mockUser,
		setUser: mockSetUser,
		logout: mockLogout,
		isLoading: mockIsLoading,
		setIsLoading: mockSetIsLoading,
	}),
}));

describe('LoginForm', () => {
	let email, password;

	beforeEach(() => {
		jest.clearAllMocks();
		render(
			<MemoryRouter>
				<LoginForm />
			</MemoryRouter>
		);
		email = screen.getByPlaceholderText('Email');
		password = screen.getByPlaceholderText('Password');
	});

	test('renders email and password fields', () => {
		expect(email).toBeInTheDocument();
		expect(password).toBeInTheDocument();
	});

	// mock return value of fetch for successful login
	const mockData = { id: 1, email: 'test@email.com' };
	global.fetch = jest.fn().mockResolvedValue({
		ok: true,
		json: () => Promise.resolve(mockData),
	});

	test('navigates to home after login', async () => {
		await act(async () => {
			/* fire events that update state */
			// fill form
			fireEvent.change(email, { target: { value: 'test@email.com' } });
			fireEvent.change(password, { target: { value: 'password' } });

			// click login
			fireEvent.click(screen.getByText('Login'));
		});
		/* assert on the output */
		expect(mockNavigate).toHaveBeenCalled();
	});

	test('sets the user after login', async () => {
		await act(async () => {
			/* fire events that update state */
			fireEvent.change(email, { target: { value: 'test@email.com' } });
			fireEvent.change(password, { target: { value: 'password' } });
			fireEvent.click(screen.getByText('Login'));
		});
		expect(mockSetUser).toHaveBeenCalledWith(mockData); // the mocked return value from handleSubmit
	});

	test('displays error if incorrect password', async () => {
		// mock return value of fetch
		const mockData = { errors: [{ msg: 'Invalid password' }] };
		global.fetch = jest.fn().mockResolvedValue({
			ok: false,
			json: () => Promise.resolve(mockData),
		});

		// enter credentials
		await act(() => {
			fireEvent.change(email, { target: { value: 'test@email.com' } });
			fireEvent.change(password, { target: { value: 'password' } });
			fireEvent.click(screen.getByText('Login'));
		});
		// verify that error displays
		expect(screen.getByText('Invalid password')).toBeInTheDocument();
	});
});
