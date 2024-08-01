import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/Spinner';
const version = import.meta.env.VITE_API_VERSION;
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import TripCard from '../components/TripCard';
import Sidebar from '../components/Sidebar';
import Avatar from '../components/Avatar';
import TextInput from '../components/TextInput';

const User = ({ id, name, avatarUrl }) => {
	return (
		<div className='flex items-center gap-2'>
			<Avatar avatar_url={avatarUrl} />
			{name}
			<div className='ml-auto'>
				<Button text='Add' />
			</div>
		</div>
	);
};

const AddFriends = () => {
	const [users, setUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [query, setQuery] = useState('');

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await fetch(
					`http://localhost:3000/${version}/friends`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
						},
						credentials: 'include',
					}
				);

				const data = await response.json()

				if (!response.ok) {
					const error = data.errors[0].msg;
					console.log(error);
					return;
				}

				setUsers(data)
				setFilteredUsers(data)
			} catch (error) {
				console.log(error)
			}
		}
		
		fetchUsers()
	}, [])
	
	useEffect(() => {
		const result = users.filter((user) => user.full_name.toLowerCase().includes(query));
		setFilteredUsers(result);
	}, [query])

	return (
		<div className='flex flex-col'>
			<TextInput
				placeholder='Enter a name'
				value={query}
				onChange={(e) => setQuery(e.target.value.toLowerCase())}
			/>

			<div>
				{filteredUsers.map((user, index) => (
					<User
						id={user.id}
						name={`${user.first_name} ${user.last_name}`}
						key={index}
					></User>
				))}
			</div>
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
				`http://localhost:3000/${version}/trips/overview`,
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
			// console.log(upcoming)
			// console.log(past)
		};

		fetchData();
	}, []);

	if (!trips) {
		return <Spinner />;
	}

	if (trips.length == 0) {
		return (
			<div>
				<div>You have no trips</div>
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
					{upcomingTrips.map((trip, index) => (
						<TripCard key={index} data={trip} />
					))}
				</div>
			</div>

			<div className='section'>
				<h2>Past trips</h2>

				<div className='trips'>
					{pastTrips.map((trip, index) => (
						<TripCard key={index} data={trip} />
					))}
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
