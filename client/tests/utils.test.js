// const getFormattedDate = require('../src/utils/utils');
import { getFormattedDate, getDaysBetween } from '../src/utils/utils';

test('formats YYYY-MM-DD into MM/DD/YYYY format', () => {
	let expected = '04/15/2025';
	let res = getFormattedDate('2025-04-15');
	expect(res).toBe(expected);
});

test('throws error if input date is not string', () => {
	let expected = 'Error, date must be type string';
	let res = getFormattedDate(1);
	expect(res).toBe(expected);
});

test('calculates days between two dates', () => {
	let date1 = new Date(2025, 9, 17);
	let date2 = new Date(2025, 9, 18);
	expect(getDaysBetween(date1, date2)).toBe(1);

	expect(getDaysBetween(date1, date1)).toBe(0);
});
