import React from 'react';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Sidebar = ({ isOpen, handleClose, header, children }) => {
	return (
		<div className={`sidebar-container ${isOpen ? 'open' : 'closed'}`}>
			<div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
				<div className='sidebar-header'>
					<h4>{header}</h4>

					<FontAwesomeIcon
						className='ml-auto cursor-pointer'
						icon={faArrowRight}
						onClick={handleClose}
					/>
				</div>

				<div className='sidebar-content'>{children}</div>
			</div>
		</div>
	);
};

export default Sidebar;
