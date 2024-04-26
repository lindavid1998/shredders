import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
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
				element: <SignupForm />,
			},
			{
				path: 'login',
				element: <LoginForm />,
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
