import React, { useState, useRef, useEffect, forwardRef } from 'react';
import Avatar from './Avatar';
import { getDaysSince } from '../utils/utils';
import {
	faEllipsisVertical,
	faPenToSquare,
	faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../hooks/useAuth';

const Dropdown = forwardRef(({ className, handleDelete }, ref) => {
	// should i consolidate this with the dropdown from Navbar?
	return (
		<div
			className={`${className} w-24 drop-shadow-lg z-50 cursor-pointer`}
			ref={ref}
		>
			<ul className='flex flex-col items-start'>
				<h6 className='nav-dropdown-item'>Edit</h6>
				<h6 className='nav-dropdown-item' onClick={handleDelete}>
					Delete
				</h6>
			</ul>
		</div>
	);
});

const Comment = ({ data, removeComment }) => {
	const { user } = useAuth();
	const { id, body, user_id, created_at, first_name, last_name, avatar_url } =
		data;
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef(null);

	const handleOutsideClick = (event) => {
		// if dropdown exists and dropdown does not contain the clicked target
		if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
			setShowDropdown(false);
		}
	};

	const handleDelete = () => {
		setShowDropdown(false);
		removeComment(id);
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleOutsideClick);
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, []);

	return (
		<div className='flex flex-col gap-2.5 p-4 shadow rounded-2xl min-w-[340px] max-w-[650px] w-full'>
			<div className='flex items-center gap-2.5'>
				<Avatar avatar_url={avatar_url} size='sm' />

				<p className='font-bold'>
					{first_name} {last_name}
				</p>

				<p style={{ color: 'var(--caption-color)' }}>
					{getDaysSince(created_at)}d ago
				</p>

				{user.user_id == user_id && (
					<div className='hidden md:flex ml-auto items-center justify-center gap-5'>
						<div className='comment-edit-delete'>
							<FontAwesomeIcon icon={faPenToSquare} />
							<p>Edit</p>
						</div>
						<div className='comment-edit-delete' onClick={handleDelete}>
							<FontAwesomeIcon icon={faTrash} />
							<p>Delete</p>
						</div>
					</div>
				)}

				{user.user_id == user_id && (
					<div className='md:hidden ml-auto cursor-pointer relative'>
						<FontAwesomeIcon
							icon={faEllipsisVertical}
							onClick={() => setShowDropdown(true)}
						/>

						{showDropdown && (
							<Dropdown
								className='absolute right-0'
								ref={dropdownRef}
								handleDelete={handleDelete}
							/>
						)}
					</div>
				)}
			</div>

			<div>{body}</div>
		</div>
	);
};

export default Comment;
