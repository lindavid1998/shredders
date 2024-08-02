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
				className='input-field'
			/>
		</div>
	);
};

export default TextInput;
