import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLoad } from '../hooks/useLoad';
import Spinner from '../components/Spinner';
const version = import.meta.env.VITE_API_VERSION;
import { Link } from 'react-router-dom';

const Home = () => {
	const { user } = useAuth();
	const [trips, setTrips] = useState(null);

	// const isLoading = useLoad(fetchData);
	// email: 'test@email.com';
	// exp: 1714752337;
	// first_name: 'Foo';
	// iat: 1714748737;
	// last_name: 'Bar';
	// user_id: 29;

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
			console.log(data);
			setTrips(data);
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
		<>
			<div>Welcome {user.first_name}</div>

			{trips.map((trip, index) => (
				<div key={index}>
					{/* <Card key={index} data={item} /> */}
					<div>{trip.location}</div>
					<div>{trip.status}</div>
				</div>
			))}

			<Link className='text-blue-600' to={`/`}>
				Back to landing page
			</Link>
		</>
	);
};

export default Home;
