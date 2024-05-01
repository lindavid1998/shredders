import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
const version = import.meta.env.VITE_API_VERSION;

const PrivateRoute = () => {
	const { user } = useAuth();

	// if (isLoading) {
	// 	return <Loading />;
	// }

	if (!user) {
		return <Navigate to={`/${version}/auth/login`} />;
	}

	return <Outlet />;
};

export default PrivateRoute;
