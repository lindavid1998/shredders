import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SearchableDropdown from '../src/components/SearchableDropdown';
import '@testing-library/jest-dom'; 

describe('SearchableDropdown', () => {
	const mockFriends = [
		{ id: 1, full_name: 'John Doe' },
		{ id: 2, full_name: 'Jane Smith' },
		{ id: 3, full_name: 'Bob Johnson' },
	];

	const mockHandleAdd = jest.fn();
	const mockAddedFriends = [];

	beforeEach(() => {
		mockHandleAdd.mockClear();
	});

	it('renders the search input', () => {
		render(
			<SearchableDropdown
				friends={mockFriends}
				handleAdd={mockHandleAdd}
				addedFriends={mockAddedFriends}
			/>
		);
		expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
	});

	it('shows dropdown when input is focused', () => {
		render(
			<SearchableDropdown
				friends={mockFriends}
				handleAdd={mockHandleAdd}
				addedFriends={mockAddedFriends}
			/>
		);

		const input = screen.getByPlaceholderText('Enter name');
		fireEvent.focus(input);

		expect(screen.getByText('John Doe')).toBeInTheDocument();
		expect(screen.getByText('Jane Smith')).toBeInTheDocument();
		expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
	});

	it('filters friends based on search input', () => {
		render(
			<SearchableDropdown
				friends={mockFriends}
				handleAdd={mockHandleAdd}
				addedFriends={mockAddedFriends}
			/>
		);

		const input = screen.getByPlaceholderText('Enter name');
		fireEvent.focus(input);
		fireEvent.change(input, { target: { value: 'John' } });

		expect(screen.getByText('John Doe')).toBeInTheDocument();
		expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
		expect(screen.queryByText('Bob Johnson')).toBeInTheDocument();
	});

	it('calls handleAdd when a friend is clicked', () => {
		render(
			<SearchableDropdown
				friends={mockFriends}
				handleAdd={mockHandleAdd}
				addedFriends={mockAddedFriends}
			/>
		);

		const input = screen.getByPlaceholderText('Enter name');
		fireEvent.focus(input);
		fireEvent.click(screen.getByText('John Doe'));

		expect(mockHandleAdd).toHaveBeenCalledWith(mockFriends[0]);
	});

	it('marks added friends as disabled', () => {
		const addedFriends = [mockFriends[0]];
		render(
			<SearchableDropdown
				friends={mockFriends}
				handleAdd={mockHandleAdd}
				addedFriends={addedFriends}
			/>
		);

		const input = screen.getByPlaceholderText('Enter name');
		fireEvent.focus(input);

		const addedFriendElement = screen.getByText('John Doe');
		expect(addedFriendElement).toHaveClass('bg-gray-200');
		expect(addedFriendElement).toHaveClass('italic');
		expect(addedFriendElement).toHaveClass('text-gray-500');
	});

	it('resets search when a friend is selected', () => {
		render(
			<SearchableDropdown
				friends={mockFriends}
				handleAdd={mockHandleAdd}
				addedFriends={mockAddedFriends}
			/>
		);

		const input = screen.getByPlaceholderText('Enter name');
		fireEvent.focus(input);
		fireEvent.change(input, { target: { value: 'John' } });
		fireEvent.click(screen.getByText('John Doe'));

		expect(input.value).toBe('');
		expect(screen.getByText('John Doe')).toBeInTheDocument();
		expect(screen.getByText('Jane Smith')).toBeInTheDocument();
		expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
	});
});
