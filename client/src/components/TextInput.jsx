import React from 'react';

const TextInput = ({
	label,
	placeholder,
	value,
	onChange,
	type = 'text',
	required = false,
}) => {
	return (
		<div className='flex flex-col gap-1'>
			{label && <label>{label}</label>}
			<input
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				required={required}
				className='w-full p-2 bg-slate-200'
			/>
		</div>
	);
};

export default TextInput;
