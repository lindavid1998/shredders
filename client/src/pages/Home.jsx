import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/Spinner';
const version = import.meta.env.VITE_API_VERSION;
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import TripCard from '../components/TripCard';
import Sidebar from '../components/Sidebar';
import Avatar from '../components/Avatar';
import TextInput from '../components/TextInput';

const User = ({ id, name, avatarUrl, status, fetchUsers }) => {
	let buttonText;
	let buttonColor = 'disabled';
	switch (status) {
		case 0:
			buttonText = 'Add';
			buttonColor = 'tertiary';
			break;
		case 1:
			buttonText = 'Pending';
			break;
		default:
			buttonText = 'Added';
	}

	const handleAdd = async () => {
		// make POST request to send friend request
		try {
			const response = await fetch(
				`${BACKEND_BASE_URL}/${version}/friends/add/${id}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				}
			);

			if (!response.ok) {
				const data = await response.json();
				const error = data.errors[0].msg;
				console.log(error);
				return;
			}

			// call fetchUsers to update state
			fetchUsers();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='flex items-center gap-2 py-2'>
			<Avatar avatar_url={avatarUrl} />
			{name}
			<div className='ml-auto'>
				<Button
					text={buttonText}
					size='xs'
					onClick={handleAdd}
					color={buttonColor}
					className='w-24'
				/>
			</div>
		</div>
	);
};

const AddFriends = () => {
	const [users, setUsers] = useState(null);
	const [query, setQuery] = useState('');

	const fetchUsers = async () => {
		try {
			const response = await fetch(`${BACKEND_BASE_URL}/${version}/users`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});

			const users = await response.json();

			if (!response.ok) {
				const error = users.errors[0].msg;
				console.log(error);
				return;
			}

			const result = users.filter((user) =>
				user.full_name.toLowerCase().includes(query)
			);

			setUsers(result);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, [query]);

	if (users == null) {
		return <div>Loading...</div>;
	}

	return (
		<div className='flex flex-col'>
			<TextInput
				placeholder='Enter a name'
				value={query}
				onChange={(e) => setQuery(e.target.value.toLowerCase())}
			/>

			{users?.length == 0 ? (
				<div className='mt-4'>No results!</div>
			) : (
				<div className='flex flex-col mt-4 gap-2'>
					{users.map((user, index) => (
						<User
							id={user.user_id}
							name={user.full_name}
							avatarUrl={user.avatar_url}
							status={user.status}
							key={index}
							fetchUsers={fetchUsers}
						/>
					))}
				</div>
			)}
		</div>
	);
};

const Home = () => {
	const { user } = useAuth();
	const [trips, setTrips] = useState(null);
	const [pastTrips, setPastTrips] = useState(null);
	const [upcomingTrips, setUpcomingTrips] = useState(null);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const navigate = useNavigate();

	const splitTrips = (trips) => {
		const currentDate = new Date();

		// Arrays to store upcoming and past dates
		let upcoming = [];
		let past = [];

		// Iterate through the dates array
		trips.forEach((trip) => {
			const tripDate = new Date(trip.start_date);
			if (tripDate.getTime() > currentDate.getTime()) {
				upcoming.push(trip);
			} else {
				past.push(trip);
			}
		});

		return { upcoming, past };
	};

	useEffect(() => {
		// fetch data
		const fetchData = async () => {
			const response = await fetch(
				`${BACKEND_BASE_URL}/${version}/trips/overview`,
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
				console.log(error);
				return;
			}

			const data = await response.json();
			setTrips(data);

			if (data.length == 0) return;

			// split data into upcoming and past trips
			const { upcoming, past } = splitTrips(data);
			setUpcomingTrips(upcoming);
			setPastTrips(past);
		};

		fetchData();
	}, []);

	if (!trips) {
		return <Spinner />;
	}

	if (trips.length == 0) {
		return (
			<div className='flex flex-col items-center gap-4'>
				<h3 className='text-center'>You have no trips</h3>
				<Button
					text='Create a trip'
					onClick={() => navigate(`/${version}/trips/plan`)}
				/>
			</div>
		);
	}

	return (
		<div className='home flex flex-col gap-10 w-full items-center md:items-start'>
			<div className='section'>
				<h2>Welcome, {user.first_name}</h2>

				<div className='flex flex-col md:flex-row gap-2'>
					<Button
						text='Create a trip'
						onClick={() => navigate(`/${version}/trips/plan`)}
						color='tertiary'
					/>

					<Button text='Add friends' onClick={() => setIsSidebarOpen(true)} />
				</div>
			</div>

			<div className='section'>
				<h2>Upcoming trips</h2>

				<div className='trips'>
					{upcomingTrips.length == 0 ? (
						<div>You don't have any upcoming trips yet</div>
					) : (
						upcomingTrips.map((trip, index) => (
							<TripCard key={index} data={trip} />
						))
					)}
				</div>
			</div>

			<div className='section'>
				<h2>Past trips</h2>

				<div className='trips'>
					{pastTrips.length == 0 ? (
						<div>You don't have any past trips yet</div>
					) : (
						pastTrips.map((trip, index) => <TripCard key={index} data={trip} />)
					)}
				</div>
			</div>

			<Sidebar
				header='Add friends'
				isOpen={isSidebarOpen}
				handleClose={() => setIsSidebarOpen(false)}
			>
				<AddFriends></AddFriends>
			</Sidebar>
		</div>
	);
};

export default Home;
