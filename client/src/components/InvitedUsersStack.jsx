import React from 'react'
import Avatar from '../components/Avatar'

const InvitedUsersStack = ({ rsvps }) => {
  // TODO: if rsvps is greater than 3 people, only show the first two
  // then indicate with a number
  return (
		<div className='flex invited-users-container'>
			{rsvps.map((user, index) => (
				<Avatar
					key={index}
					size='sm'
					avatar_url={user.avatar_url}
				/>
			))}
		</div>
	);
}

export default InvitedUsersStack