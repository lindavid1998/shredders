import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className='flex flex-col justify-center items-center'>
			<Navbar></Navbar>
			<div className='max-w-screen-lg px-10'>
				<Outlet></Outlet>
			</div>
		</div>
	);
};

export default Layout;
