import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
const version = import.meta.env.VITE_API_VERSION;
import { getFormattedDate } from '../utils/utils';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import { faCheck, faX, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Comment from '../components/Comment';

const sortRsvps = (rsvps) => {
	let result = [];
	for (const status of ['Going', 'Tentative', 'Declined']) {
		result = result.concat(rsvps.filter((rsvp) => rsvp.status == status));
	}
	return result;
};

const RSVPCount = ({ rsvps }) => {
	let result = {
		Going: 0,
		Tentative: 0,
		Declined: 0,
	};

	for (const user of rsvps) {
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

const Trip = () => {
	const { id } = useParams();
	const [data, setData] = useState(null);
	const [error, setError] = useState('');

	// make API call to fetch trip details
	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(
				`http://localhost:3000/${version}/trips/${id}`,
				{
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			if (!response.ok) {
				const error = data.errors[0].msg;
				setError(error);
				console.log(error);
				return;
			}

			const data = await response.json();
			setData(data);
		};

		fetchData();
	}, [id]);

	if (!data && !error) {
		return <Spinner />;
	}

	const { location, start_date, end_date, image_large_url, comments } = data;

	let rsvps = sortRsvps(data.rsvps);

	// {
	// 		"start_date": "2025-01-03T08:00:00.000Z",
	// 		"end_date": "2025-01-05T08:00:00.000Z",
	// 		"location": "Brighton",
	// 		"creator_id": 5,
	// 		"creator_first_name": "foo",
	// 		"creator_last_name": "bar",
	// 		"image_large_url": "https://i.imgur.com/hPrgv2A.jpeg",
	// 		"image_small_url": "https://i.imgur.com/hPrgv2A.jpeg",
	// 		"rsvps": [
	// 				{
	// 						"id": 19,
	// 						"user_id": 5,
	// 						"status": "Tentative",
	// 						"first_name": "foo",
	// 						"last_name": "bar",
	// 						"avatar_url": "https://i.imgur.com/OhjeZxR.jpg"
	// 				}
	// 		],
	// 		"comments": []
	// }

	return (
		<div className='trip flex flex-col items-center gap-10'>
			{/* <div className='hero-img'>
				<img src={image_large_url}></img>
			</div> */}

			<div className='section header'>
				<h3 className='text-center'>
					Trip to <span className='font-bold'>{location}</span>
				</h3>

				<div className='dates text-center'>
					{`${getFormattedDate(start_date)} - ${getFormattedDate(end_date)}`}
				</div>
			</div>

			<div className='section buttons flex gap-5'>
				<Button text='Edit trip' color='primary'></Button>
				<Button text='Invite friends' color='secondary'></Button>
			</div>

			<div className='section rsvps'>
				<h3 className='text-center'>Who's Coming</h3>
				<RSVPCount rsvps={rsvps}></RSVPCount>
				{rsvps.map((user, index) => (
					<User key={index} user={user} />
				))}
			</div>

			<div className='section comments'>
				<h3>Comments</h3>

				{comments.length > 0 ? (
					<div className='flex flex-col gap-5'>
						{comments.map((comment, index) => (
							<Comment key={index} data={comment} />
						))}
					</div>
				) : (
					<div className='italic' style={{ color: 'var(--caption-color)' }}>
						Be the first one to comment!
					</div>
				)}
			</div>
		</div>
	);
};

export default Trip;
