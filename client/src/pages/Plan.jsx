import React, { useState } from 'react';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
const version = import.meta.env.VITE_API_VERSION;

// submit trip with hard-coded destinations
// then dynamically add destinations using api call
// update styling

const Plan = () => {
	const [destination_id, setDestinationId] = useState(1);
	const [start_date, setStartDate] = useState(null);
	const [end_date, setEndDate] = useState(null);
	const [error, setError] = useState('');

	const { user } = useAuth();

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
						destination_id,
						start_date,
						end_date,
						user_id,
					}),
				}
			);

			const data = await response.json();

			if (!response.ok) {
				const error = data.errors[0].msg;
				setError(error);
				return;
			}

			setError('');
		} catch (error) {
			setError(error);
		}
	};

	return (
		<form className='flex flex-col max-w-md gap-3' onSubmit={handleSubmit}>
			<h2>Plan a trip</h2>

			<label htmlFor='destination_id'>Destination:</label>
			<select
				id='destination_id'
				name='destination_id'
				onChange={(e) => setDestinationId(parseInt(e.target.value))}
				required
				defaultValue=''
			>
				<option disabled value=''>
					Select an option
				</option>
				<option value='1'>Mammoth</option>
				<option value='2'>Bear Mountain</option>
				<option value='3'>Brighton</option>
			</select>

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
