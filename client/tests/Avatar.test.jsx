import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Avatar from '../src/components/Avatar';
import '@testing-library/jest-dom';

const API_VERSION = 'v1';
const BACKEND_BASE_URL = 'http://backend-url.com';
jest.mock('../src/constants', () => ({
	API_VERSION,
	BACKEND_BASE_URL,
}));

global.fetch = jest.fn();

describe('Avatar Component', () => {
	const mockAvatarUrl = 'http://example.com/avatar.jpg';

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders avatar image with default size', () => {
		render(<Avatar avatar_url={mockAvatarUrl} />);
		const img = screen.getByRole('img');
		expect(img).toBeInTheDocument();
		expect(img.src).toBe(mockAvatarUrl);
	});

	describe('Edit functionality', () => {
		it('shows edit overlay when allowEdit is true', () => {
			render(<Avatar avatar_url={mockAvatarUrl} allowEdit={true} />);
			expect(screen.getByText('Edit')).toBeInTheDocument();
		});

		it('does not show edit overlay when allowEdit is false', () => {
			render(<Avatar avatar_url={mockAvatarUrl} allowEdit={false} />);
			expect(screen.queryByText('Edit')).not.toBeInTheDocument();
		});

		it('opens upload form when edit is clicked', async () => {
			render(<Avatar avatar_url={mockAvatarUrl} allowEdit={true} />);

			fireEvent.click(screen.getByText('Edit'));

			expect(screen.getByText('Edit avatar')).toBeInTheDocument();
			expect(
				screen.getByRole('button', { name: 'Submit' })
			).toBeInTheDocument();
			expect(
				screen.getByRole('button', { name: 'Cancel' })
			).toBeInTheDocument();
		});

		it('closes form when cancel is clicked', () => {
			render(<Avatar avatar_url={mockAvatarUrl} allowEdit={true} />);

			fireEvent.click(screen.getByText('Edit'));
			fireEvent.click(screen.getByText('Cancel'));

			expect(screen.queryByText('Edit avatar')).not.toBeInTheDocument();
		});

		it('handles file upload successfully', async () => {
			const mockResponse = { ok: true };
			fetch.mockResolvedValueOnce(mockResponse);

			// Mock location.reload
			const mockReload = jest.fn();
			Object.defineProperty(window, 'location', {
				value: { reload: mockReload },
			});

			render(<Avatar avatar_url={mockAvatarUrl} allowEdit={true} />);

			// Open form
			fireEvent.click(screen.getByText('Edit'));

			// Upload file
			const file = new File(['test'], 'test.png', { type: 'image/png' });
			const input = screen.getByTestId('avatar-input');
			await userEvent.upload(input, file);

			// Submit form
			fireEvent.submit(screen.getByTestId('avatar-upload-form'));

			await waitFor(() => {
				expect(fetch).toHaveBeenCalledWith(
					`${BACKEND_BASE_URL}/${API_VERSION}/avatar/upload`,
					{
						method: 'POST',
						credentials: 'include',
						body: expect.any(FormData),
					}
				);
				expect(mockReload).toHaveBeenCalledTimes(1);
			});
		});
	});
});
