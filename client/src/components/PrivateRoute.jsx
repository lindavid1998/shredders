import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/Spinner';
const version = import.meta.env.VITE_API_VERSION;

const PrivateRoute = () => {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return <Spinner />;
	}

	if (!user) {
		return <Navigate to={`/${version}/auth/login`} />;
	}

	return <Outlet />;
};

export default PrivateRoute;
