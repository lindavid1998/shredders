import Layout from '../src/components/Layout';
import { render, screen } from '@testing-library/react';
import { useLocation, BrowserRouter } from 'react-router-dom';
import { useAuth } from '../src/hooks/useAuth';
import '@testing-library/jest-dom';

// Mock react-router-dom's useLocation
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useLocation: jest.fn(),
}));

// Mock useAuth hook
jest.mock('../src/hooks/useAuth', () => ({
	useAuth: jest.fn(),
}));

describe('Demo account', () => {
	// mock useAuth hook
	const mockUser = { email: 'user@email.com.com' };
	const mockDemoUser = { email: 'demo@email.com' };

	const demoMsg = 'You are signed into the demo account (read-only)';

	beforeEach(() => {
		// Mock useLocation to return a non-landing page path
		useLocation.mockReturnValue({ pathname: '/home' });
	});

	test('Message indicates if user is signed into demo account', () => {
		// Set up useAuth mock for demo user
		useAuth.mockReturnValue({
			user: mockDemoUser,
		});

		render(
			<BrowserRouter>
				<Layout />
			</BrowserRouter>
		);

		expect(screen.getByText(demoMsg)).toBeInTheDocument();
	});

	test('Message does not show if user is signed into other account', () => {
		// Set up useAuth mock for regular user
		useAuth.mockReturnValue({
			user: mockUser,
		});

		render(
			<BrowserRouter>
				<Layout />
			</BrowserRouter>
		);

		expect(screen.queryByText(demoMsg)).not.toBeInTheDocument();
	});
});
