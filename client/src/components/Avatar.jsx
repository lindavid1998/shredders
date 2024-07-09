import React from 'react';

const Avatar = ({ avatar_url, size = 'md' }) => {
	return (
		<div
			className={`rounded-full ${
				size === 'sm' ? 'size-10' : 'size-14'
			} overflow-hidden`}
		>
			<img src={avatar_url}></img>
		</div>
	);
};

export default Avatar;
