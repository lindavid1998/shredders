// mock import.meta.env
jest.mock('./src/constants', () => ({
	API_VERSION: 'v1',
	BACKEND_BASE_URL: 'localhost',
}));
