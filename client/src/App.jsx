import Auth from './pages/Auth';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Plan from './pages/Plan';
import Trip from './pages/Trip';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
const version = import.meta.env.VITE_API_VERSION;

function App() {
	return (
		<>
			<BrowserRouter>
				<Navbar></Navbar>
				<Routes>
					<Route path='/' element={<Landing />} />
					<Route element={<PrivateRoute />}>
						<Route path={`/${version}`} element={<Home />} />
						<Route path={`/${version}/trips/plan`} element={<Plan />} />
						<Route path={`/${version}/trips/:id`} element={<Trip />} />
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
