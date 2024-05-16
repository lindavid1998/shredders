import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
	return (
		<div className='flex flex-col items-center w-screen max-w-screen-lg px-10 mx-auto'>
			<Navbar />
			<Outlet />
		</div>
	);
};

export default Layout;
