import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/Spinner';
const version = import.meta.env.VITE_API_VERSION;
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import TripCard from '../components/TripCard';
import TripCardMini from '../components/TripCardMini';

const Home = () => {
	const { user } = useAuth();
	const [trips, setTrips] = useState(null);
	const [pastTrips, setPastTrips] = useState(null);
	const [upcomingTrips, setUpcomingTrips] = useState(null);
	const navigate = useNavigate();

	// const isLoading = useLoad(fetchData);
	// email: 'test@email.com';
	// exp: 1714752337;
	// first_name: 'Foo';
	// iat: 1714748737;
	// last_name: 'Bar';
	// user_id: 29;

	// [
	// 	{
	// 		trip_id: 51,
	// 		status: 'Going',
	// 		start_date: '2024-05-01T07:00:00.000Z',
	// 		end_date: '2024-05-04T07:00:00.000Z',
	// 		location: 'Mammoth',
	// 	},
	// 	{
	// 		trip_id: 52,
	// 		status: 'Not going',
	// 		start_date: '2024-05-02T07:00:00.000Z',
	// 		end_date: '2024-05-03T07:00:00.000Z',
	// 		location: 'Bear Mountain',
	// 	},
	// ];

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
				`http://localhost:3000/${version}?userId=${user.user_id}`,
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
		return <div>You have no trips</div>;
	}

	return (
		<div className='flex flex-col gap-6'>
			<div>
				<h1>Welcome, {user.first_name}</h1>

				<Button
					text='Create a trip'
					onClick={() => navigate(`/${version}/trips/plan`)}
				/>
			</div>

			<div>
				<h2>Upcoming trips</h2>

				<div className='flex flex-col gap-2'>
					{upcomingTrips.map((trip, index) => (
						<TripCard key={index} data={trip} />
					))}
				</div>
			</div>

			<div>
				<h2>Past trips</h2>

				<div className='flex flex-wrap gap-2'>
					{pastTrips.map((trip, index) => (
						<TripCardMini key={index} data={trip} />
					))}
				</div>
			</div>

			<Link className='text-blue-600' to={`/`}>
				Back to landing page
			</Link>
		</div>
	);
};

export default Home;
