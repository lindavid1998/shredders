import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
const version = import.meta.env.VITE_API_VERSION;

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
				// setError(error);
				console.log(error);
				return;
			}

			const data = await response.json();
			console.log(data);
			setData(data);
		};

		fetchData();
	}, [id]);

	if (!data) {
		return <Spinner />;
	}

	const {
		location,
		start_date,
		end_date,
		creator_first_name,
		creator_last_name,
	} = data;

	return (
		<div>
			<div>Destination: {location}</div>
			<div>Start: {start_date}</div>
			<div>End: {end_date}</div>
			<div>
				Created by: {creator_first_name} {creator_last_name}
			</div>
		</div>
	);
};

export default Trip;
