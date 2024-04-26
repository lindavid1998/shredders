import React from 'react';

const TextInput = ({ type, label, placeholder, value, onChange }) => {
	return (
		<div className='flex flex-col gap-1'>
			<label>{label}</label>
			<input
				type={type || 'text'}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				className='w-full p-2 bg-slate-200'
			/>
		</div>
	);
};

export default TextInput;
