import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../hooks/useAuth';

const Layout = () => {
	const location = useLocation();
	const { user } = useAuth();
	const isLanding = location.pathname === '/';

	const isDemo = user && user.email == 'demo@email.com';

	return (
		<div className='flex flex-col items-center w-screen h-screen'>
			<div className='w-full max-w-screen-xl px-5'>
				<Navbar />
				{isDemo && (
					<div className='bg-yellow-50 p-3 rounded-lg mb-4'>
						You are signed into the demo account (read-only)
					</div>
				)}
			</div>
			<div
				className={`grow w-full flex justify-center ${
					isLanding ? '' : 'max-w-screen-xl px-5'
				}`}
			>
				<Outlet />
			</div>
			<Footer />
		</div>
	);
};

export default Layout;
