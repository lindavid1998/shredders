import React from 'react';

const Avatar = ({ avatar_url, size = 'md', allowEdit = false }) => {
	let className = `rounded-full overflow-hidden`;

	className += size === 'sm' ? ' size-10' : ' size-14';

	if (allowEdit) className += ' relative cursor-pointer'

	return (
		<div className={className}>
			{allowEdit && <div className='avatar-edit-overlay'>
				<div className='text-white'>Edit</div>
			</div>}
			<img src={avatar_url}></img>
		</div>
	);
};

export default Avatar;
