import React from 'react';
import { getFormattedDate } from '../utils/utils';
import { Link } from 'react-router-dom';
import InvitedUsersStack from './InvitedUsersStack';
const version = import.meta.env.VITE_API_VERSION;

const TripCard = ({ data }) => {
	let { id, name, start_date, end_date, image_small_url, rsvps } = data;

	start_date = getFormattedDate(start_date);
	end_date = getFormattedDate(end_date);

	return (
		<Link to={`/${version}/trips/${id}`}>
			<div className='trip-card shadow'>
				<div className='trip-image-container'>
					<img src={image_small_url} />
				</div>

				<div className='trip-card-info'>
					<div className='font-bold'>{name}</div>

					<div className='text-sm text-slate-700'>
						{start_date} - {end_date}
					</div>

					<div className='mt-auto'>
						<InvitedUsersStack rsvps={rsvps} />
					</div>
				</div>
			</div>
		</Link>
	);
};

export default TripCard;
