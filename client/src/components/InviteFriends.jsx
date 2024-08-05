import React, { useState, useEffect } from 'react';
const version = import.meta.env.VITE_API_VERSION;
import TextInput from './TextInput';
import Avatar from './Avatar';
import Button from './Button';

const User = ({
	id,
	name,
	avatarUrl,
	isInvited,
	handleInvite,
	fetchStatuses,
}) => {
	let buttonText;
	let buttonColor;

	if (isInvited) {
		buttonText = 'Invited';
		buttonColor = 'disabled';
	} else {
		buttonText = 'Invite';
		buttonColor = 'tertiary';
	}

	const handleClick = async () => {
		await handleInvite(id);
		fetchStatuses();
	};

	return (
		<div className='flex items-center gap-2 py-2'>
			<Avatar avatar_url={avatarUrl} />

			{name}

			<div className='ml-auto'>
				<Button
					text={buttonText}
					color={buttonColor}
					size='xs'
					onClick={handleClick}
					className='w-24'
				/>
			</div>
		</div>
	);
};

const InviteFriends = ({ tripId, handleInvite }) => {
	const [users, setUsers] = useState(null);
	const [query, setQuery] = useState('');

	const fetchFriendsStatuses = async () => {
		try {
			const response = await fetch(
				`http://localhost:3000/${version}/trips/${tripId}/invite/status`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				}
			);

			const data = await response.json();

			if (!response.ok) {
				const error = data.errors[0].msg;
				console.log(error);
				return;
			}

			const result = data.filter((user) =>
				user.full_name.toLowerCase().includes(query)
			);

			setUsers(result);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchFriendsStatuses();
	}, [query]);

	if (users == null) {
		return <div>Loading...</div>;
	}

	return (
		<div className='flex flex-col'>
			<TextInput
				placeholder='Enter a name'
				value={query}
				onChange={(e) => setQuery(e.target.value.toLowerCase())}
			/>

			{users?.length == 0 ? (
				<div className='mt-4'>No results!</div>
			) : (
				<div className='flex flex-col mt-4 gap-2'>
					{users.map((user, index) => (
						<User
							id={user.user_id}
							name={user.full_name}
							avatarUrl={user.avatar_url}
							isInvited={user.is_invited}
							key={index}
							fetchStatuses={fetchFriendsStatuses}
							handleInvite={handleInvite}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default InviteFriends;
