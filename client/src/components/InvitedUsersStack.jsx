import React from 'react';
import Avatar from '../components/Avatar';

const AdditionalUsersCount = ({ count }) => {
	return (
		<div
			className='flex justify-center items-center rounded-full size-10 text-lg'
			style={{
				backgroundColor: 'var(--light-color)',
			}}
		>
			<span>+{count}</span>
		</div>
	);
};
const InvitedUsersStack = ({ rsvps }) => {
	const MAX_VISIBLE_USERS = 3;
	const additionalUsersCount = rsvps.length - MAX_VISIBLE_USERS;
	const showAdditionalUsers = additionalUsersCount > 0

	return (
		<div className='flex invited-users-container'>
			{rsvps.slice(0, MAX_VISIBLE_USERS).map((user, index) => (
				<Avatar key={index} size='sm' avatar_url={user.avatar_url} />
			))}
			{showAdditionalUsers && (
				<AdditionalUsersCount count={additionalUsersCount} />
			)}
		</div>
	);
};

export default InvitedUsersStack;
