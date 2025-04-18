// deconstruct import.meta.env into constants

const { VITE_API_VERSION: API_VERSION, VITE_BACKEND_BASE_URL: BACKEND_BASE_URL } =
	import.meta.env;

export { API_VERSION, BACKEND_BASE_URL };
