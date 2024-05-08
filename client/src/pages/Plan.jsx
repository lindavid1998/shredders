import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
const version = import.meta.env.VITE_API_VERSION;
import { useNavigate } from 'react-router-dom';
import Dropdown from '../components/Dropdown';

const Plan = () => {
	const [destinationToId, setDestinationToId] = useState({});
	const [destination, setDestination] = useState(null);
	const [start_date, setStartDate] = useState(null);
	const [end_date, setEndDate] = useState(null);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const { user } = useAuth();

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(
				`http://localhost:3000/${version}/trips/plan`,
				{
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			const data = await response.json();

			if (!response.ok) {
				const error = data.errors[0].msg;
				setError(error);
				return;
			}

			setError('');
			setDestinationToId(data);
		};

		fetchData();
	}, []);

	const options = Object.keys(destinationToId);

	const handleSelect = (destination) => {
		setDestination(destination);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const user_id = user.user_id;

			const response = await fetch(
				`http://localhost:3000/${version}/trips/plan`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
					body: JSON.stringify({
						destination_id: destinationToId[destination],
						start_date,
						end_date,
						user_id,
					}),
				}
			);

			const data = await response.json();
			console.log(data);

			if (!response.ok) {
				const error = data.errors[0].msg;
				setError(error);
				return;
			}

			setError('');
			navigate(`/${version}/trips/${data.trip_id}`);
		} catch (error) {
			setError(error);
		}
	};

	return (
		<form className='flex flex-col max-w-md gap-3' onSubmit={handleSubmit}>
			<h2>Plan a trip</h2>

			<label htmlFor=''>Destination</label>
			<Dropdown
				options={options}
				selected={destination}
				onSelect={handleSelect}
			/>

			<label htmlFor='start_date'>Start:</label>
			<input
				type='date'
				id='start_date'
				name='start_date'
				required
				onChange={(e) => setStartDate(e.target.value)}
			></input>

			{/* add client side validation that end date cannot be before start date? */}
			<label htmlFor='end_date'>End:</label>
			<input
				type='date'
				id='end_date'
				name='end_date'
				required
				onChange={(e) => setEndDate(e.target.value)}
			></input>

			<p className='text-red-500 text-center'>{error}</p>
			<Button type='submit' text='Create' />
		</form>
	);
};

export default Plan;
