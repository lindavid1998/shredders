import Auth from './pages/Auth';
import Home from './pages/Home';
import Landing from './pages/Landing';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
const version = import.meta.env.VITE_API_VERSION;

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<Landing />} />
					<Route element={<PrivateRoute />}>
						<Route path={`/${version}`} element={<Home />} />
					</Route>
					<Route path={`/${version}/auth/`}>
						<Route path={`signup`} element={<Auth type='Signup' />} />
						<Route path={`login`} element={<Auth type='Login' />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
