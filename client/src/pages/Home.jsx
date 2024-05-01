import React from 'react';
import { useAuth } from '../hooks/useAuth';

const version = import.meta.env.VITE_API_VERSION;

const Home = () => {
	const { user } = useAuth();
	return <div>Home {user.first_name}</div>;
};

export default Home;
