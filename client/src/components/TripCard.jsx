import React from 'react';
import { getFormattedDate } from '../utils/utils';
import { Link } from 'react-router-dom';
const version = import.meta.env.VITE_API_VERSION;

const TripCard = ({ data }) => {
	let { location, start_date, end_date, trip_id } = data;

	start_date = getFormattedDate(start_date);
	end_date = getFormattedDate(end_date);

	return (
		<div className='border-solid border-2 max-w-lg p-2'>
			<Link className='font-bold' to={`/${version}/trips/${trip_id}`}>
				{location}
			</Link>

			<div className='text-sm text-slate-700'>
				{start_date} - {end_date}
			</div>
		</div>
	);
};

export default TripCard;
