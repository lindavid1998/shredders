import React, { useEffect, useState, useRef, useCallback } from 'react';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { useLoad } from '../hooks/useLoad';
// const version = import.meta.env.VITE_API_VERSION;
// const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
import { API_VERSION as version, BACKEND_BASE_URL } from '../constants'
import { useNavigate } from 'react-router-dom';
import Dropdown from '../components/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import SearchableDropdown from '../components/SearchableDropdown';
import HeroImg from '/chairlift.jpg';

const Plan = () => {
	const [destinationToId, setDestinationToId] = useState({});
	const [destination, setDestination] = useState(null);
	const [start_date, setStartDate] = useState(null);
	const [end_date, setEndDate] = useState(null);
	const [error, setError] = useState('');
	const [friends, setFriends] = useState([]);
	const [addedFriends, setAddedFriends] = useState([]);
	const navigate = useNavigate();

	const { user } = useAuth();

	const fetchFriends = useCallback(async () => {
		try {
			const response = await fetch(`${BACKEND_BASE_URL}/${version}/friends`, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const data = await response.json();

			if (!response.ok) {
				const error = data.errors[0].msg;
				setError(error);
				return;
			}

			setError('');
			setFriends(data);
		} catch (error) {
			setError('Failed to fetch friends.');
			console.error(error);
		}
	}, [user.user_id, version]);

	const fetchDestinations = useCallback(async () => {
		try {
			const response = await fetch(
				`${BACKEND_BASE_URL}/${version}/trips/destinations`,
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
		} catch (error) {
			setError('Failed to fetch destinations.');
			console.error(error);
		}
	}, [version]);

	const fetchData = async () => {
		await fetchFriends();
		await fetchDestinations();
	};

	const isLoading = useLoad(fetchData);

	const options = Object.keys(destinationToId);

	const handleSelect = (destination) => {
		setDestination(destination);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const user_id = user.user_id;

			const response = await fetch(
				`${BACKEND_BASE_URL}/${version}/trips/create`,
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
						addedFriends,
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
			navigate(`/${version}/trips/${data.trip_id}`);
		} catch (error) {
			setError(error);
		}
	};

	const handleRemove = (friendToRemove) => {
		let result = addedFriends.filter((friend) => friend !== friendToRemove);
		setAddedFriends(result);
	};

	const handleAdd = (friend) => {
		setAddedFriends((prevState) => [...prevState, friend]);
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className='w-full md:h-3/4 flex flex-col md:flex-row md:justify-between md:items-start gap-6'>
			<div className='h-[300px] md:h-full w-full md:w-1/2 flex justify-center items-center'>
				<img
					className='h-full object-cover rounded-3xl grow object-left-top'
					src={HeroImg}
				/>
			</div>

			<form
				className='flex flex-col w-full md:max-w-lg gap-3 h-full'
				onSubmit={handleSubmit}
			>
				<h2>Plan a trip</h2>

				<div className='input-container'>
					<label htmlFor='destination'>Destination</label>
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
						required
						onChange={(e) => setStartDate(e.target.value)}
						className='input-field max-w-64'
					/>
				</div>

				<div className='input-container'>
					{/* add client side validation that end date cannot be before start date? */}
					<label htmlFor='end_date'>End</label>
					<input
						type='date'
						id='end_date'
						required
						onChange={(e) => setEndDate(e.target.value)}
						className='input-field max-w-64'
					/>
				</div>

				<div className='input-container'>
					<label>Invite friends</label>
					{friends.length > 0 ? (
						<SearchableDropdown
							friends={friends}
							handleAdd={handleAdd}
							addedFriends={addedFriends}
						/>
					) : (
						<p>You don't have any friends yet!</p>
					)}
				</div>

				{addedFriends.length > 0 && (
					<div className='w-full border-t flex flex-col pt-2 gap-3 justify-start'>
						<div className='font-bold'>Invited people</div>
						{addedFriends.map((friend) => (
							<div
								key={friend.id}
								id={friend.id}
								className='flex content-center justify-between'
							>
								<div>{friend.full_name}</div>
								<div>
									<FontAwesomeIcon
										icon={faMinus}
										onClick={() => handleRemove(friend)}
										className='cursor-pointer'
									/>
								</div>
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
