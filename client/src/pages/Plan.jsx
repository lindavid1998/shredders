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
	const [friends, setFriends] = useState([]);
	const [showFriends, setShowFriends] = useState(false);
	const [addedFriends, setAddedFriends] = useState([]);
	const navigate = useNavigate();

	const { user } = useAuth();

	useEffect(() => {
		const fetchFriends = async () => {
			const response = await fetch(
				`http://localhost:3000/${version}/friends?user_id=${user.user_id}`,
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
			setFriends(data);
		};

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

		fetchFriends();
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
		<div className='w-full flex justify-center items-center'>
			<form
				className='flex flex-col w-full max-w-lg gap-3 p-4'
				onSubmit={handleSubmit}
			>
				<h2>Plan a trip</h2>

				<div className='input-container'>
					<label>Destination</label>
					<Dropdown
						options={options}
						selected={destination}
						onSelect={handleSelect}
					/>
				</div>

				<div className='input-container'>
					<label htmlFor='start_date'>Start</label>
					<input
						type='date'
						id='start_date'
						name='start_date'
						required
						onChange={(e) => setStartDate(e.target.value)}
						className='input-field'
					/>
				</div>

				<div className='input-container'>
					{/* add client side validation that end date cannot be before start date? */}
					<label htmlFor='end_date'>End</label>
					<input
						type='date'
						id='end_date'
						name='end_date'
						required
						onChange={(e) => setEndDate(e.target.value)}
						className='input-field'
					/>
				</div>

				<div className='input-container'>
					<label htmlFor='end_date'>Invite friends</label>

					<div className='relative w-full max-w-64'>
						<input
							type='text'
							placeholder='Enter name'
							className='input-field'
							onFocus={() => setShowFriends(true)}
							// onBlur={() => setShowFriends(false)}
						/>

						<div
							className={`absolute left-0 flex flex-col top-10 w-full shadow-lg ${
								showFriends ? '' : 'hidden'
							}`}
						>
							{friends.map((friend) => (
								<div
									key={friend.user_id}
									id={friend.user_id}
									className='bg-gray-50 w-full px-3 py-2 hover:bg-gray-100 cursor-pointer'
									onClick={() => {
										setAddedFriends((prevState) => [...prevState, friend]);
									}}
								>
									{friend.first_name} {friend.last_name}
								</div>
							))}
						</div>
					</div>
				</div>

				{addedFriends.length > 0 && (
					<div className='w-full border-t flex flex-col pt-2 gap-3 justify-start'>
						<div className='font-bold'>Invited people</div>
						{addedFriends.map((friend) => (
							<div key={friend.user_id} id={friend.user_id}>
								{friend.first_name} {friend.last_name}
							</div>
						))}
					</div>
				)}

				<p className='text-red-500 text-center'>{error}</p>

				<Button type='submit' text='Create' />
			</form>
		</div>
	);
};

export default Plan;
