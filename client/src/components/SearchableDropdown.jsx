import React, { useState, useRef } from 'react';

const SearchableDropdown = ({ friends, handleAdd, addedFriends }) => {
	const [query, setQuery] = useState('');
	const [isExpanded, setIsExpanded] = useState(false);
	const [filteredFriends, setFilteredFriends] = useState(friends);
	const dropdownRef = useRef(null);

	const handleSearch = (e) => {
		const input = e.target.value.toLowerCase();
		setQuery(input);

		if (input === '') {
			setFilteredFriends(friends);
		} else {
			const filtered = friends.filter((friend) =>
				friend.full_name.toLowerCase().includes(input)
			);
			setFilteredFriends(filtered);
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

		// reset search
		setQuery('');
		setFilteredFriends(friends);
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
				{filteredFriends.map((item) => {
					const isAdded = addedFriends.includes(item)
					
					return (
						<div
							key={item.id}
							id={item.id}
							tabIndex='0'
							className={`w-full px-3 py-2 ${
								isAdded
									? 'bg-gray-200 italic text-gray-500'
									: 'cursor-pointer bg-gray-50 hover:bg-gray-100'
							}`}
							onBlur={handleBlur}
							onClick={() => !isAdded && handleClick(item)}
						>
							{item.full_name}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default SearchableDropdown;
