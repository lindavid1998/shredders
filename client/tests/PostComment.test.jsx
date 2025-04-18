import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PostComment from '../src/components/PostComment';
import { useAuth } from '../src/hooks/useAuth';
import '@testing-library/jest-dom';

// mock useAuth and fetch
jest.mock('../src/hooks/useAuth', () => ({
	useAuth: jest.fn(),
}));

global.fetch = jest.fn();

describe('PostComment', () => {
	const mockUser = {
		avatar_url: 'https://example.com/avatar.jpg',
	};

	const mockTripId = '123';
	const mockHandleAddComment = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		useAuth.mockReturnValue({ user: mockUser });
	});

	it('renders the comment form correctly', () => {
		render(
			<PostComment
				tripId={mockTripId}
				handleAddComment={mockHandleAddComment}
			/>
		);

		expect(screen.getByPlaceholderText('Add a comment...')).toBeInTheDocument();
		expect(screen.getByText('Post')).toBeInTheDocument();
		// expect(screen.getByAltText('User avatar')).toBeInTheDocument();
	});

	it('submits the form successfully', async () => {
		const mockResponse = { id: '1', body: 'Test comment' };
		fetch.mockResolvedValueOnce({
			ok: true,
			json: jest.fn().mockResolvedValueOnce(mockResponse),
		});

		render(
			<PostComment
				tripId={mockTripId}
				handleAddComment={mockHandleAddComment}
			/>
		);

		// Fill in the comment
		const textarea = screen.getByPlaceholderText('Add a comment...');
		fireEvent.change(textarea, { target: { value: 'Test comment' } });

		// Submit the form
		fireEvent.click(screen.getByText('Post'));

		// Wait for the fetch to be called
		await waitFor(() => {
			expect(fetch).toHaveBeenCalledWith(
				expect.stringContaining(`/trips/${mockTripId}/comments`),
				expect.objectContaining({
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
					body: JSON.stringify({ body: 'Test comment' }),
				})
			);
		});

		// Check if handleAddComment was called with the response
		expect(mockHandleAddComment).toHaveBeenCalledWith(mockResponse);

		// Wait for the textarea to be cleared
		await waitFor(() => {
			expect(textarea).toHaveValue('');
		});
	});

	it('handles API errors correctly', async () => {
		const mockError = { errors: [{ msg: 'Error posting comment' }] };
		fetch.mockResolvedValueOnce({
			ok: false,
			json: jest.fn().mockResolvedValueOnce(mockError),
		});

		render(
			<PostComment
				tripId={mockTripId}
				handleAddComment={mockHandleAddComment}
			/>
		);

		// Fill in the comment
		const textarea = screen.getByPlaceholderText('Add a comment...');
		fireEvent.change(textarea, { target: { value: 'Test comment' } });

		// Submit the form
		fireEvent.click(screen.getByText('Post'));

		// Wait for the error message to appear
		await waitFor(() => {
			expect(screen.getByText('Error posting comment')).toBeInTheDocument();
		});

		// Check if handleAddComment was not called
		expect(mockHandleAddComment).not.toHaveBeenCalled();
	});
});
