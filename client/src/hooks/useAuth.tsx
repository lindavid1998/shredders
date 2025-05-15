import React, { useState, createContext, useContext, useEffect } from 'react';
const version = import.meta.env.VITE_API_VERSION;
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext);

interface User {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	avatarUrl: string;
}

export interface AuthContextType {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	logout: () => void;
	isLoading: boolean;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const logout = async () => {
		try {
			// clear cookie from backend
			await fetch(`${BACKEND_BASE_URL}/${version}/auth/logout`, {
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
					`${BACKEND_BASE_URL}/${version}/auth/user`,
					{
						method: 'GET',
						credentials: 'include',
						headers: {
							'Content-Type': 'application/json',
						},
					}
				);

				if (response.ok) {
					const data: User = await response.json();
					setUser(data);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		};

		checkAuth();
	}, []);

	const value: AuthContextType = {
		user,
		setUser,
		logout,
		isLoading,
		setIsLoading,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
