import React from 'react';

const Button = ({ type = 'button', text, onClick, className = '', color = 'primary' }) => {
	const colorToClass = {
		primary: 'bg-blue-500 hover:bg-blue-700 text-white',
		secondary: `
			outline outline-2 outline-blue-500 text-blue-500
			hover:text-blue-900 hover:bg-blue-100
		`,
		tertiary: `
			outline outline-2 outline-gray-500 text-gray-800
			hover:bg-gray-100
		`,
	};

	const defaultStyle = 'py-2 px-4 rounded-lg';

	const classes = `${colorToClass[color]} ${defaultStyle} ${className}`;

	return (
		<button type={type} onClick={onClick} className={classes}>
			{text}
		</button>
	);
};

export default Button;
