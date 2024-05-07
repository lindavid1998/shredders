import React from 'react';
import Icon from '../../public/avatar.svg';
import { useAuth } from '../hooks/useAuth';

const Avatar = () => {
	const { user } = useAuth();
	// get avatar image from user object

	return (
		<div className='rounded-full size-10 border-2 border-black'>
			<img src={Icon}></img>
		</div>
	);
};

export default Avatar;
