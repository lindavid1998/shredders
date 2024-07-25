import React, { useState, useRef, useEffect, forwardRef } from 'react';
import Avatar from './Avatar';
import { getDaysSince } from '../utils/utils';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../hooks/useAuth';

const Dropdown = forwardRef(({ className }, ref) => {
	// should i consolidate this with the dropdown from Navbar?
	return (
		<div className={`${className} w-24 drop-shadow-lg z-50 cursor-pointer`} ref={ref}>
			<ul className='flex flex-col items-start'>
				<h6 className='nav-dropdown-item'>Edit</h6>
				<h6 className='nav-dropdown-item'>Delete</h6>
			</ul>
		</div>
	);
});

const Comment = ({ data }) => {
	const { user } = useAuth();
	const { body, user_id, created_at, first_name, last_name, avatar_url } = data;
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef(null);

	const handleOutsideClick = (event) => {
		// if dropdown exists and dropdown does not contain the clicked target
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setShowDropdown(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleOutsideClick);
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, []);

	return (
		<div className='flex flex-col gap-2.5 p-4 shadow rounded-2xl w-[340px]'>
			<div className='flex items-center gap-2.5'>
				<Avatar avatar_url={avatar_url} size='sm' />

				<p className='font-bold'>
					{first_name} {last_name}
				</p>

				<p style={{ color: 'var(--caption-color)' }}>
					{getDaysSince(created_at)}d ago
				</p>

				{user.user_id == user_id && (
					<div
						className='ml-auto cursor-pointer relative'
						onClick={() => setShowDropdown(true)}
					>
						<FontAwesomeIcon icon={faEllipsisVertical} />

						{showDropdown && (
							<Dropdown className='absolute right-0' ref={dropdownRef} />
						)}
					</div>
				)}
			</div>

			<div>{body}</div>
		</div>
	);
};

export default Comment;
