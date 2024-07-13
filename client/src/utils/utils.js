import { StrictMode } from 'react';

export const getFormattedDate = (date) => {
	if (typeof date == 'string') {
		date = new Date(date);
	}

	let year = date.getFullYear();
	let month = (1 + date.getMonth()).toString();
	let day = date.getDate().toString();

	return month + '/' + day + '/' + year;
}

export const getDaysSince = (timestamp) => {
	const givenDate = new Date(timestamp);
	const currentDate = new Date();

	const timeDifference = currentDate - givenDate;
	const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
	
	return daysDifference;
}