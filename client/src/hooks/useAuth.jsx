import React, { useState, createContext, useContext, useEffect } from 'react';
import { useCookies } from 'react-cookie';
const version = import.meta.env.VITE_API_VERSION;

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [cookies, setCookies, removeCookie] = useCookies(['token']);

	const logout = async () => {
		try {
			// clear cookie from backend
			await fetch(`http://localhost:3000/${version}/auth/logout`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			setUser(null);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await fetch(
					`http://localhost:3000/${version}/auth/user`,
					{
						method: 'GET',
						credentials: 'include',
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);
				if (response.ok) {
					const { user } = await response.json();
					setUser(user)
				}
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
