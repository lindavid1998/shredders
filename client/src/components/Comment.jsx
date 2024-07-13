import React from 'react';
import Avatar from './Avatar';
import { getDaysSince } from '../utils/utils';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '../hooks/useAuth';

const Comment = ({ data }) => {
  const { user } = useAuth();
  const { body, user_id, created_at, first_name, last_name, avatar_url } = data;
  
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
					<div className='ml-auto'>
						<FontAwesomeIcon icon={faEllipsisVertical} />
					</div>
				)}
			</div>

			<div>{body}</div>
		</div>
	);
};

export default Comment;

//  "comments": [
//         {
//             "id": 3,
//             "body": "this is a test comment too",
//             "user_id": 6,
//             "created_at": "2024-06-24T01:19:14.756Z",
//             "first_name": "Eric",
//             "last_name": "Liu",
//             "avatar_url": "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100259.jpg?t=st%3D1720497064~exp%3D1720500664~hmac%3D7b9e19f219df2e53ad93003d6111238a1e75a7e71bd30be860413f49fede102a&w=826"
//         }
//     ]
