export const getFormattedDate = (date) => {
	// Input format: YYYY-MM-DD
	if (typeof date != 'string') {
		return 'Error, date must be type string';
	}

	const [year, month, day] = date.split('-');
	return `${month}/${day}/${year}`;
};

export const getDaysBetween = (date1, date2) => {
	const timeDifference = date2 - date1;
	const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
	return daysDifference;
};
