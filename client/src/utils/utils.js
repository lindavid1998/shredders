export const getFormattedDate = (date) => {
	if (typeof date != 'string') {
		return 'Error, date must be type string'
	}
	
	// String format: YYYY-MM-DD
	const [year, month, day] = date.split('-');
	return `${month}/${day}/${year}`;
}

export const getDaysSince = (timestamp) => {
	const givenDate = new Date(timestamp);
	const currentDate = new Date();

	const timeDifference = currentDate - givenDate;
	const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
	
	return daysDifference;
}