import React from 'react';

const Button = ({ type, text, onClick, className }) => {
	const defaultClasses =
		'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline';

	return (
		<button
			type={type}
			onClick={onClick}
			className={className ? className + defaultClasses : defaultClasses}
		>
			{text}
		</button>
	);
};

export default Button;
