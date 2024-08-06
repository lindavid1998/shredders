import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
const version = import.meta.env.VITE_API_VERSION;
import { getFormattedDate } from '../utils/utils';
import Button from '../components/Button';
import Comment from '../components/Comment';
import PostComment from '../components/PostComment';
import { useAuth } from '../hooks/useAuth';
import RSVPs from '../components/RSVPs';
import Sidebar from '../components/Sidebar';
import InviteFriends from '../components/InviteFriends';

const Trip = () => {
	const { user } = useAuth();
	const { id } = useParams();
	const [error, setError] = useState('');
	const [location, setLocation] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [imageLargeUrl, setImageLargeUrl] = useState('');
	const [comments, setComments] = useState([]);
	const [rsvps, setRsvps] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [overlapFriends, setOverlapFriends] = useState(null);

	const sortRsvps = (rsvps) => {
		let result = [];
		for (const status of ['Going', 'Tentative', 'Declined']) {
			result = result.concat(rsvps.filter((rsvp) => rsvp.status == status));
		}
		return result;
	};

	const removeComment = async (commentId) => {
		try {
			// remove comment from database
			const response = await fetch(
				`http://localhost:3000/${version}/trips/${id}/comments/${commentId}`,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				}
			);

			const data = await response.json();

			if (!response.ok) {
				const error = data.errors[0].msg;
				console.log(error);
				return;
			}

			// remove comment from state to re-render comments
			const result = comments.filter((comment) => comment.id != commentId);
			setComments(result);
		} catch (error) {
			console.log(error);
		}
	};

	const handleAddComment = (comment) => {
		// concatenate user info to comment before appending to comments array
		setComments([...comments, { ...comment, ...user }]);
	};

	const handleCloseSidebar = () => {
		setIsSidebarOpen(false); // why doesn't handleInviteUser update state and trigger re-render?
		window.location.reload();
	};

	const handleInviteUser = async (userId) => {
		// returns true if the api call is successful
		try {
			const response = await fetch(
				`http://localhost:3000/${version}/trips/${id}/invite/${userId}`,
				{
					method: 'POST',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			const data = await response.json();

			if (!response.ok) {
				const error = data.errors[0].msg;
				setError(error);
				console.log(error);
				return false;
			}

			setRsvps(data);
			return true
		} catch (error) {
			console.log(error);
			return false
		}
	};

	// make API call to fetch trip details
	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(
				`http://localhost:3000/${version}/trips/${id}`,
				{
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			if (!response.ok) {
				const error = data.errors[0].msg;
				setError(error);
				console.log(error);
				return;
			}

			const data = await response.json();

			const {
				location,
				start_date,
				end_date,
				image_large_url,
				comments,
				rsvps,
				friends_on_overlapping_trips,
			} = data;

			setLocation(location);
			setStartDate(start_date);
			setEndDate(end_date);
			setImageLargeUrl(image_large_url);
			setComments(comments);
			setRsvps(sortRsvps(rsvps));
			setOverlapFriends(friends_on_overlapping_trips);
			setIsLoading(false);
		};

		fetchData();
	}, [id]);

	if (isLoading && !error) {
		return <Spinner />;
	}

	return (
		<div className='trip flex flex-col items-center md:items-start gap-10 w-full md:relative'>
			<Sidebar
				isOpen={isSidebarOpen}
				handleClose={handleCloseSidebar}
				header='Invite friends'
			>
				<InviteFriends tripId={id} handleInvite={handleInviteUser} />
			</Sidebar>

			<div className='trip-hero-img'>
				<img src={imageLargeUrl}></img>
			</div>

			<div className='section header relative md:w-full'>
				<h3 className='text-center md:text-left'>
					Trip to <span className='font-bold'>{location}</span>
				</h3>

				<div className='dates text-center md:text-left'>
					{`${getFormattedDate(startDate)} - ${getFormattedDate(endDate)}`}
				</div>

				<div className='flex flex-col gap-5 md:absolute md:flex-row md:right-0 md:top-0'>
					<Button text='Edit trip' color='primary' />
					<Button
						text='Invite friends'
						color='secondary'
						onClick={() => setIsSidebarOpen(true)}
					/>
				</div>
			</div>

			<RSVPs responses={rsvps} overlapFriends={overlapFriends} />

			<div className='section comments'>
				<h3 className='text-center md:text-left'>Comments</h3>

				{comments.length > 0 ? (
					<div className='flex flex-col gap-5'>
						{comments.map((comment, index) => (
							<Comment
								key={index}
								data={comment}
								tripId={id}
								removeComment={removeComment}
							/>
						))}
					</div>
				) : (
					<div
						className='italic text-center md:text-left'
						style={{ color: 'var(--caption-color)' }}
					>
						Be the first one to comment!
					</div>
				)}

				<PostComment tripId={id} handleAddComment={handleAddComment} />
			</div>
		</div>
	);
};

export default Trip;
