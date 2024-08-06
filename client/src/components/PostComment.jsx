import React, { useState } from 'react';
import Button from './Button';
import Avatar from './Avatar';
const version = import.meta.env.VITE_API_VERSION;
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
import { useAuth } from '../hooks/useAuth';

const PostComment = ({ tripId, handleAddComment }) => {
	const { user } = useAuth();
	const [error, setError] = useState('');
	const [body, setBody] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch(
				`${BACKEND_BASE_URL}/${version}/trips/${tripId}/comments`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
					body: JSON.stringify({ body }),
				}
			);

			const data = await response.json();

			if (!response.ok) {
				const error = data.errors[0].msg;
				setError(error);
				return;
			}

			handleAddComment(data);
			setError('');
			setBody('');
		} catch (error) {
			setError(error);
		}
	};

	return (
		<form onSubmit={handleSubmit} className='flex flex-col gap-2.5'>
			<div className='flex gap-2.5 min-h-11 relative'>
				<div className='hidden md:block'>
					<Avatar avatar_url={user.avatar_url} size='sm' />
				</div>

				<textarea
					placeholder='Add a comment...'
					required
					value={body}
					onChange={(e) => setBody(e.target.value)}
					className='grow h-11 comment-textbox md:h-20'
				/>

				<div className='ml-auto'>
					<Button type='submit' text='Post' color='tertiary' size='sm' />
				</div>
			</div>

			{error && <span className='error'>{error}</span>}
		</form>
	);
};

export default PostComment;
