import React from 'react';

const Button = ({ type = 'button', text, onClick, color = 'primary' }) => {
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

	return (
		<button type={type} onClick={onClick} className={className}>
			{text}
		</button>
	);
};

export default Button;
