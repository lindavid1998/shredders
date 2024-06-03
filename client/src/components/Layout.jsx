import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
	return (
		<div className='flex flex-col items-center w-screen max-w-screen-lg h-screen px-10 mx-auto gap-4'>
			<Navbar />
			<Outlet />
		</div>
	);
};

export default Layout;
