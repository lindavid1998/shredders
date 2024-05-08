import React, { useState } from 'react';

const Chevron = ({ expand }) => {
	return (
		<svg
			className={`${
				expand && 'transform rotate-180'
			} -mr-1 h-5 w-5 text-gray-400`}
			viewBox='0 0 20 20'
			fill='currentColor'
			aria-hidden='true'
		>
			<path
				fillRule='evenodd'
				d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'
				clipRule='evenodd'
			/>
		</svg>
	);
};

const Button = ({ text, expand, onClick }) => {
	return (
		<button
			type='button'
			className='inline-flex min-w-52 justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
			onClick={onClick}
		>
			<div className='text-nowrap'>{text || 'Select an option'}</div>
			<Chevron expand={expand} />
		</button>
	);
};

const Dropdown = ({ options, selected, onSelect }) => {
	const [expand, setExpand] = useState(false);

	const handleClick = (option) => {
		onSelect(option);
		setExpand(false);
	};

	return (
		<div className='w-40 flex flex-col gap-10 p-2'>
			<div className='relative inline-block text-left'>
				<Button
					text={selected}
					expand={expand}
					onClick={() => setExpand((prevState) => !prevState)}
				/>
				<div
					className={`${
						expand ? 'absolute' : 'hidden'
					} left-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
					tabIndex='-1'
				>
					<div className='py-1' role='none'>
						{options.map((option, index) => (
							<a
								href='#'
								className='text-gray-700 block px-4 py-2 w-full text-sm hover:bg-gray-50'
								tabIndex='-1'
								id='menu-item-0'
								key={index}
								onClick={() => handleClick(option)}
							>
								{option}
							</a>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dropdown;
