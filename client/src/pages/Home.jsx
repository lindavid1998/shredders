import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLoad } from '../hooks/useLoad';
import Spinner from '../components/Spinner';
const version = import.meta.env.VITE_API_VERSION;
import { Link } from 'react-router-dom';

const Home = () => {
	const { user } = useAuth();

	const fetchData = () => {
		// dummy API call
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve();
			}, 1000);
		});
	};

	const isLoading = useLoad(fetchData);

	if (isLoading) {
		return <Spinner />;
	}

	return (
		<>
			<div>Welcome {user.first_name}</div>
			<Link className='text-blue-600' to={`/`}>
				Back to landing page
			</Link>
		</>
	);
};

export default Home;
