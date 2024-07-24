import React, { useState } from 'react';
import Button from './Button';
const version = import.meta.env.VITE_API_VERSION;

const PostComment = ({ tripId, handleAddComment }) => {
	const [error, setError] = useState('');
	const [body, setBody] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch(
				`http://localhost:3000/${version}/trips/${tripId}/comments`,
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
			<div className='flex gap-2.5 h-11 relative'>
				<input
					type='textarea'
					placeholder='Add a comment...'
					className='comment-textbox'
					name='body'
					value={body}
					onChange={(e) => setBody(e.target.value)}
				/>
				<Button type='submit' text='Post' color='tertiary' size='sm' />
			</div>
			{error && <span className='error'>{error}</span>}
		</form>
	);
};

export default PostComment;
