import Trip from '../src/pages/Trip';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getFormattedDate } from '../src/utils/utils';

// mock useAuth
const mockUser = { user_id: 1 };
jest.mock('../src/hooks/useAuth', () => ({
	useAuth: () => ({
		user: mockUser,
	}),
}));

// mock child components
jest.mock('../src/components/Comment.jsx', () => {
	return ({ data }) => <div>{data}</div>;
});
jest.mock('../src/components/RSVPs.jsx', () => {
	return ({ responses }) => {
		return (
			<div>
				{responses.map((resp, index) => (
					<div key={index}>
						{resp.user_id}, {resp.status}
					</div>
				))}
			</div>
		);
	};
});
jest.mock('../src/components/Spinner.jsx', () => {
	return () => <div>Loading</div>;
});
jest.mock('../src/components/InviteFriends.jsx', () => {
	return () => <div></div>;
});
jest.mock('../src/components/PostComment.jsx', () => {
	return () => <div></div>;
});

describe('Trip', () => {
	const mockData = {
		location: 'location',
		start_date: '2025-04-15',
		end_date: '2025-04-16',
		comments: ['comment1', 'comment2'],
		rsvps: [
			{
				user_id: 1,
				status: 'Going',
			},
			{
				user_id: 2,
				status: 'Tentative',
			},
		],
	};

	beforeEach(async () => {
		// mock api response
		global.fetch = jest.fn().mockResolvedValue({
			ok: true,
			json: () => mockData,
		});

		await act(async () => {
			render(<Trip />);
		});
	});

	// test.only('displays loading before data is fetched', async () => {
	// 	render(<Trip />);
	// 	expect(screen.getByText('Loading')).toBeInTheDocument();
	// });

	test('renders location', async () => {
		expect(await screen.findByText('location')).toBeInTheDocument();
	});

	test('renders start and end dates', async () => {
		const start = mockData.start_date;
		const end = mockData.end_date;
		const dates = `${getFormattedDate(start)} - ${getFormattedDate(end)}`;
		expect(await screen.findByText(dates)).toBeInTheDocument();
	});

	test('renders rsvps and comments', async () => {
		// rsvps
		expect(await screen.findByText('1, Going')).toBeInTheDocument();
		expect(await screen.findByText('2, Tentative')).toBeInTheDocument();

    // comments
		expect(await screen.findByText(mockData.comments[0])).toBeInTheDocument();
		expect(await screen.findByText(mockData.comments[1])).toBeInTheDocument();
	});
});
