import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
	const location = useLocation();
	const isLanding = location.pathname === '/';

	return (
		<div className='flex flex-col items-center w-screen h-screen'>
			<div className='w-full max-w-screen-xl px-5'>
				<Navbar />
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
