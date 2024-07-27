import React from 'react'
import Avatar from './Avatar';
import { faCheck, faX, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const RSVPCount = ({ responses }) => {
	let result = {
		Going: 0,
		Tentative: 0,
		Declined: 0,
	};

	for (const user of responses) {
		switch (user.status) {
			case 'Going':
				result['Going']++;
				break;
			case 'Declined':
				result['Declined']++;
				break;
			default:
				result['Tentative']++;
		}
	}

	return (
		<div>
			<span className='font-bold'>{result['Going']}</span> accepted,
			<span className='font-bold'> {result['Tentative']}</span> maybe,
			<span className='font-bold'> {result['Declined']}</span> declined
		</div>
	);
};

const User = ({ user }) => {
	let className =
		'absolute right-0 bottom-0 w-5 h-5  rounded-full flex items-center justify-center';
	let bgColor = '';
	let icon = '';

	switch (user.status) {
		case 'Going':
			bgColor = 'var(--bg-going)';
			icon = faCheck;
			break;
		case 'Declined':
			bgColor = 'var(--bg-declined)';
			icon = faX;
			break;
		default:
			bgColor = 'var(--bg-tentative)';
			icon = faQuestion;
	}

	return (
		<div className='flex items-center gap-4'>
			<div className='relative w-fit h-fit'>
				<Avatar avatar_url={user.avatar_url}></Avatar>
				<div className={className} style={{ backgroundColor: bgColor }}>
					<FontAwesomeIcon size='sm' icon={icon} fill='white' inverse />
				</div>
			</div>

			<div>
				{user.first_name} {user.last_name}
			</div>
		</div>
	);
};

const RSVPs = ({ responses }) => {
  // handle the case if there are no RSVPs
  if (!responses || responses.length == 0) {
		return <div>There are no RSVPs!</div>;
	}

  return (
		<div className='section rsvps'>
			<h3 className='text-center md:text-left'>Who's Coming</h3>
			<RSVPCount responses={responses} />
			{responses.map((user, index) => (
				<User key={index} user={user} />
			))}
		</div>
	);
}

export default RSVPs