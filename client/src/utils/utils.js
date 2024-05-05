export const getFormattedDate = (date) => {
	if (typeof date == 'string') {
		date = new Date(date);
	}

	let year = date.getFullYear();
	let month = (1 + date.getMonth()).toString();
	let day = date.getDate().toString();

	return month + '/' + day + '/' + year;
}
