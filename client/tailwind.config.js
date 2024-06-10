/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				light: 'var(--light-color)',
				dark: 'var(--dark-color)',
				accent: 'var(--accent-color)',
			},
		},
	},
	plugins: [],
};
