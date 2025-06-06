// jest.config.js

export default {
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
		'\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			'<rootDir>/__mocks__/fileMock.js',
	},
	testEnvironment: 'jest-environment-jsdom',
	transform: {
		'^.+\\.[t|j]sx?$': 'babel-jest',
	},
	setupFiles: ['./jest.setup.js']
};
