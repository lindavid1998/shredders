import React from 'react';

const Button = ({ type = 'button', text, onClick, color = 'primary', size }) => {
	let className = 'btn';

	switch (color) {
		case 'primary':
			className += ' btn-primary';
			break;
		case 'secondary':
			className += ' btn-secondary';
			break;
		case 'tertiary':
			className += ' btn-tertiary';
			break;
	}

	switch (size) {
		case 'sm':
			className += ' btn-small'
		case 'xs':
			className += ' btn-xsmall'
	}

	return (
		<button type={type} onClick={onClick} className={className}>
			{text}
		</button>
	);
};

export default Button;
