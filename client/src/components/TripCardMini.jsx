import React from 'react';
import { getFormattedDate } from '../utils/utils';
import { Link } from 'react-router-dom';
const version = import.meta.env.VITE_API_VERSION;
import Icon from '../../public/mountain.svg';

const TripCardMini = ({ data }) => {
	let { location, start_date, end_date, trip_id } = data;

	start_date = getFormattedDate(start_date);
	end_date = getFormattedDate(end_date);

	return (
		<div className='w-60 p-2 flex h-12'>
			<Link className='size-16' to={`/${version}/trips/${trip_id}`}>
				<img src={Icon} />
			</Link>

			<div className='flex flex-col'>
				<Link className='font-bold' to={`/${version}/trips/${trip_id}`}>
					{location}
				</Link>

				<div className='text-sm text-slate-700'>
					{start_date} - {end_date}
				</div>
			</div>
		</div>
	);
};

export default TripCardMini;
