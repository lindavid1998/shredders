import React, { useState } from 'react';
import { API_VERSION as version, BACKEND_BASE_URL } from '../constants';
import Button from './Button';

const UploadAvatarForm = ({ handleClose, handleSubmit, handleSelectFile }) => {
	return (
		<div className='w-screen h-screen fixed top-0 right-0 flex items-start justify-center bg-black/40 shadow z-50'>
			<form
				onSubmit={handleSubmit}
				className='flex flex-col w-1/3 bg-white p-8 rounded gap-2 mt-24'
				data-testid='avatar-upload-form'
			>
				<h3>Edit avatar</h3>

				<input
					type='file'
					id='avatar'
					name='avatar'
					accept='image/png, image/jpeg'
					data-testid='avatar-input'
					onChange={handleSelectFile}
					required={true}
				/>

				<div className='flex gap-2 self-end mt-2'>
					<Button
						text='Submit'
						type='submit'
						size='sm'
						className='w-24'
						color='tertiary'
					/>
					<Button
						text='Cancel'
						onClick={handleClose}
						size='sm'
						className='w-24'
					/>
				</div>
			</form>
		</div>
	);
};

const Avatar = ({ avatar_url, size = 'md', allowEdit = false }) => {
	const [showForm, setShowForm] = useState(false);
	const [file, setFile] = useState();

	const handleSelectFile = (e) => {
		setFile(e.target.files[0]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// create formData object with file
		const formData = new FormData();
		formData.append('avatar', file);

		try {
			const response = await fetch(
				`${BACKEND_BASE_URL}/${version}/avatar/upload`,
				{
					method: 'POST',
					body: formData,
					credentials: 'include',
				}
			);

			if (!response.ok) {
				const data = await response.json();
				console.log(data.errors[0].msg);
				console.log('File upload error');
			}

			location.reload();
		} catch (error) {
			console.log(error);
		}
	};

	const handleCloseForm = () => {
		setShowForm(false);
	};

	let className = `rounded-full overflow-hidden`;

	className += size === 'sm' ? ' size-10' : ' size-14';

	if (allowEdit) className += ' relative cursor-pointer';

	return (
		<div className={className}>
			{allowEdit && (
				<div className='avatar-edit-overlay' onClick={() => setShowForm(true)}>
					<div className='text-white'>Edit</div>
				</div>
			)}

			<img src={avatar_url} />

			{showForm && (
				<UploadAvatarForm
					handleClose={handleCloseForm}
					handleSubmit={handleSubmit}
					handleSelectFile={handleSelectFile}
				/>
			)}
		</div>
	);
};

export default Avatar;
