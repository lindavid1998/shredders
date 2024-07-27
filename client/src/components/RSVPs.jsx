import React, { useState, useEffect } from 'react';
import Avatar from './Avatar';
import { faCheck, faX, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const RSVPCount = ({ numGoing, numTentative, numDeclined }) => {
	return (
		<div>
			<span className='font-bold'>{numGoing}</span> accepted,
			<span className='font-bold'> {numTentative}</span> maybe,
			<span className='font-bold'> {numDeclined}</span> declined
		</div>
	);
};

const User = ({ user }) => {
	let className =
		'absolute right-0 bottom-0 w-5 h-5  rounded-full flex items-center justify-center';
	let bgColor = '';
	let icon = '';

	switch (user.status) {
		case 'Going':
			bgColor = 'var(--bg-going)';
			icon = faCheck;
			break;
		case 'Declined':
			bgColor = 'var(--bg-declined)';
			icon = faX;
			break;
		default:
			bgColor = 'var(--bg-tentative)';
			icon = faQuestion;
	}

	return (
		<div className='flex items-center gap-4'>
			<div className='relative w-fit h-fit'>
				<Avatar avatar_url={user.avatar_url}></Avatar>
				<div className={className} style={{ backgroundColor: bgColor }}>
					<FontAwesomeIcon size='sm' icon={icon} fill='white' inverse />
				</div>
			</div>

			<div>
				{user.first_name} {user.last_name}
			</div>
		</div>
	);
};

const RSVPs = ({ responses }) => {
	const [isSmallScreen, setIsSmallScreen] = useState(false);
	const [splitResponses, setSplitResponses] = useState({});
	const [numGoing, setNumGoing] = useState(0);
	const [numTentative, setNumTentative] = useState(0);
	const [numDeclined, setNumDeclined] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const widthThreshold = 768; // md screen is 768 px
		const handleResize = () => {
			setIsSmallScreen(window.innerWidth < 768); // Adjust the breakpoint as needed
		};

		handleResize(); // Check on initial render

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		let splitResponses = {
			Going: [],
			Tentative: [],
			Declined: [],
		};

		responses.map((response) => {
			splitResponses[response.status].push(response);
		});

		setSplitResponses(splitResponses);
		setNumGoing(splitResponses['Going'].length);
		setNumTentative(splitResponses['Tentative'].length);
		setNumDeclined(splitResponses['Declined'].length);
		setIsLoading(false);
	}, []);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	// handle the case if there are no RSVPs
	if (!responses || responses.length == 0) {
		return <div>There are no RSVPs!</div>;
	}

	// on small screen
	if (isSmallScreen) {
		return (
			<div className='section rsvps'>
				<h3 className='text-center md:text-left'>Who's Coming</h3>

				<RSVPCount
					numGoing={numGoing}
					numTentative={numTentative}
					numDeclined={numDeclined}
				/>

				{responses.map((user, index) => (
					<User key={index} user={user} />
				))}
			</div>
		);
	}

	// on medium screen, render the split users arrays
	return (
		<div className='section rsvps'>
			<h3 className='text-center md:text-left'>Who's Coming</h3>

			<div className='rsvp-columns'>
				<div className='rsvp-column'>
					<div>
						<span className='font-bold'>{numGoing}</span> accepted
					</div>
					{splitResponses['Going'].map((user, index) => (
						<User key={index} user={user} />
					))}
				</div>
				<div className='rsvp-column'>
					<div>
						<span className='font-bold'>{numTentative}</span> tentative
					</div>
					{splitResponses['Tentative'].map((user, index) => (
						<User key={index} user={user} />
					))}
				</div>
				<div className='rsvp-column'>
					<div>
						<span className='font-bold'>{numDeclined}</span> declined
					</div>
					{splitResponses['Declined'].map((user, index) => (
						<User key={index} user={user} />
					))}
				</div>
			</div>
		</div>
	);
};

export default RSVPs;
