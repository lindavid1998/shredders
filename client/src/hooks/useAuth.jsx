import React, { useState, createContext, useContext, useEffect } from 'react';
import { useCookies } from 'react-cookie';
const version = import.meta.env.VITE_API_VERSION;

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [cookies, setCookies, removeCookie] = useCookies(['token']);

	const logout = () => {
		removeCookie('token');
		setUser(null);
	};

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await fetch(
					`http://localhost:3000/${version}/auth/verify`,
					{
						method: 'GET',
						credentials: 'include',
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);

				const { user } = await response.json();

				if (response.ok) setUser(user);
			} catch (error) {
				console.log(error);
			}
			setIsLoading(false);
		};

		checkAuth();
	}, []);

	const value = {
		user,
		setUser,
		logout,
		isLoading,
		setIsLoading,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
