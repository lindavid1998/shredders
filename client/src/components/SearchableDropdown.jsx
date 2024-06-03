import React, { useState, useRef } from 'react';

const SearchableDropdown = ({ options, handleAdd, addedFriends }) => {
	const [query, setQuery] = useState('');
	const [isExpanded, setIsExpanded] = useState(false);
	const [filteredOptions, setFilteredOptions] = useState(options);
	const dropdownRef = useRef(null);

	const handleSearch = (e) => {
		const input = e.target.value.toLowerCase();
		setQuery(input);

		if (input === '') {
			setFilteredOptions(options);
		} else {
			const filtered = options.filter(
				(item) =>
					item.first_name.toLowerCase().includes(input) ||
					item.last_name.toLowerCase().includes(input)
			);
			setFilteredOptions(filtered);
		}
	};

	const handleBlur = (e) => {
		// if dropdown does not contain focused element or focused element is null
		if (!e.relatedTarget || !dropdownRef.current.contains(e.relatedTarget)) {
			setIsExpanded(false);
		}
	};

	const handleClick = (friend) => {
		handleAdd(friend);
		setQuery('');
		setFilteredOptions(options);
	};

	return (
		<div className='relative w-full max-w-64'>
			<input
				type='text'
				placeholder='Enter name'
				className='input-field'
				onFocus={() => setIsExpanded(true)}
				onChange={handleSearch}
				onBlur={handleBlur}
				value={query}
			/>

			<div
				ref={dropdownRef}
				className={`absolute left-0 flex flex-col top-10 w-full shadow-lg ${
					isExpanded ? '' : 'hidden'
				}`}
			>
				{/* can do friends.slice(0, n) to only show the first n friends */}
				{filteredOptions.map((item) => {
					const isAdded = addedFriends.some(
						(friend) => friend.user_id === item.user_id
					);
					return (
						<div
							key={item.user_id}
							id={item.user_id}
							tabIndex='0'
							className={`w-full px-3 py-2 ${
								isAdded
									? 'bg-gray-200 italic text-gray-500'
									: 'cursor-pointer bg-gray-50 hover:bg-gray-100'
							}`}
							onBlur={handleBlur}
							onClick={() => !isAdded && handleClick(item)}
						>
							{item.first_name} {item.last_name}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default SearchableDropdown;
