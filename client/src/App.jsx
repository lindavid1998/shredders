import Auth from './pages/Auth';
import Home from './pages/Home';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const version = import.meta.env.VITE_API_VERSION;

const router = createBrowserRouter([
	{
		path: `/${version}`,
		element: <Home />,
	},
	{
		path: `/${version}/auth/`,
		children: [
			{
				path: 'signup',
				element: <Auth type='Signup' />,
			},
			{
				path: 'login',
				element: <Auth type='Login' />,
			},
		],
	},
]);

function App() {
	return (
		<>
			<RouterProvider router={router} />
		</>
	);
}

export default App;
