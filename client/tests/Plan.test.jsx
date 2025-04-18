import Plan from '../src/pages/Plan';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// mock useAuth hook
const mockUser = { user_id: 1 };
jest.mock('../src/hooks/useAuth', () => ({
	useAuth: () => ({
		user: mockUser,
	}),
}));

// mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockNavigate,
}));

// mock useLoad
jest.mock('../src/hooks/useLoad', () => ({
	useLoad: () => false,
}));

// mock dropdown for destination
jest.mock('../src/components/Dropdown', () => () => (
	<input id='destination'></input>
));

describe('Plan', () => {
	let destination, startDate, endDate;

	beforeEach(async () => {
		render(<Plan />);
		destination = screen.getByLabelText('Destination');
		startDate = screen.getByLabelText('Start');
		endDate = screen.getByLabelText('End');

		// select destination and dates
		await act(async () => {
			fireEvent.change(destination, { target: { value: 'Palisades' } });
			fireEvent.change(startDate, { target: { value: '2024-01-01' } });
			fireEvent.change(endDate, { target: { value: '2024-01-03' } });
		});
	});

	test('redirects to created trip', async () => {
		// mock successful API response for creating trip
		const mockData = { trip_id: 1 };
		global.fetch = jest.fn().mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve(mockData),
		});

		// click create trip
		await act(async () => {
			fireEvent.click(screen.getByText('Create'));
		});

		// verify that trip is created (redirect called)
		expect(mockNavigate).toHaveBeenCalledWith(`/v1/trips/${mockData.trip_id}`);
	});

	test('displays error if trip not created', async () => {
		// mock unsuccessful API call
		const mockData = { errors: [{ msg: 'Error creating trip' }] };
		global.fetch = jest.fn().mockResolvedValueOnce({
			ok: false,
			json: () => Promise.resolve(mockData),
		});

		// click create trip
		await act(async () => {
			fireEvent.click(screen.getByText('Create'));
		});

		// verify that error message shows
		expect(screen.getByText('Error creating trip')).toBeInTheDocument();
	});
});
