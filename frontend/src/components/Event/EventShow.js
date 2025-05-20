import { useEffect, useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    getEvent,
    fetchEvent,
    createJoinRequest,
    deleteJoinRequest,
    deleteEvent,
} from '../../store/events';
import './EventShow.css';
import { removeEventJoin } from '../../store/users';
import { getCurrentUser } from '../../store/session';
import { openModal, updateEvent } from '../../store/modal';
import { getAttendees } from '../../store/users';
import { getHost } from '../../store/users';
import { Icon } from '@iconify/react';
import EventShowMapWrapper from '../EventMap/EventShowMap';

const EventShow = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { eventId } = useParams();

    const event = useSelector(getEvent(eventId));

    // grabs current user
    const user = useSelector((state) => state.session.user);

    // grabs the host (user) of the event
    const host = useSelector(getHost(event));

    // grabs the array of attendees for this event
    const attendees = useSelector(getAttendees(event));

    // subscribed = sent a join request
    const [subscribed, setSubscribed] = useState(false);
    // joined = actually joined event, host has accepted it
    const [joined, setJoined] = useState(false);
    // isHost = true if current user is the host of the event
    const [isHost, setIsHost] = useState(false);

    const [mapOptions, setMapOptions] = useState({});

    useEffect(() => {
        dispatch(getCurrentUser());
        dispatch(fetchEvent(eventId));
    }, [eventId, dispatch]);

    useEffect(() => {
        if (event?.attendees.includes(user?._id)) {
            // set current user's status to "requested to join"
            setJoined(true);
        }

        if (event?.pendingAttendees.includes(user?._id)) {
            // set current user's status to "joined"
            setSubscribed(true);
        }

        if (user && host && host?._id === user?._id) {
            // sets isHost to true if current user is the host, can edit or delete event
            setIsHost(true);
        }
    }, [user, event, host, dispatch]);

    const handleJoin = async (e) => {
        e.preventDefault();
        setSubscribed(true);
        await dispatch(createJoinRequest(eventId, user._id));
    };

    const handleUnjoin = async (e) => {
        e.preventDefault();
        if (user._id !== host._id) {
            if (subscribed) {
                // delete join request
                await dispatch(deleteJoinRequest(eventId, user._id));
            } else {
                // delete event attendance
                await dispatch(removeEventJoin(user._id, eventId));
            }
            setSubscribed(false);
            setJoined(false);
        }
    };

    const handleModal = (e) => {
        dispatch(updateEvent('updateEvent', eventId));
    };

    const handleDeleteEvent = () => {
        dispatch(deleteEvent(eventId));
        history.push('/events');
    };

    const getAddressCoordinates = async (address) => {
        try {
            const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                address
            )}&key=${process.env.REACT_APP_MAPS_API_KEY}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.results.length > 0) {
                const location = data.results[0].geometry.location;
                const latitude = location.lat;
                const longitude = location.lng;
                return new window.google.maps.LatLng(latitude, longitude);
            } 
            throw new Error('No results found for the provided address.');
        } catch (error) {
            console.error('Error:', error);
            throw error; // Re-throw the error to handle it in the calling code
        }
    };

    useEffect(() => {
        const fetchMapData = async () => {
            try {
                const formattedAddress = `${event?.address}, ${event?.city}, ${event?.state} ${event?.zipcode}`;
                const coordinates = await getAddressCoordinates(
                    formattedAddress
                );
                const centered = {
                    zoom: 11, // Set the initial zoom level as needed
                    center: { lat: coordinates.lat(), lng: coordinates.lng() },
                };
                setMapOptions(centered);
                // dispatch(setCenter(centered))
            } catch (error) {
                console.error('Error fetching map data:', error);
                // Handle error as needed
            }
        };

        fetchMapData();
    }, [event]);

    function formatDate(originalDate) {
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return new Date(originalDate).toLocaleDateString(undefined, options);
    }

    const handleLoggedOutProfileClick = () => dispatch(openModal('signup'));

    return (
        <>
            <div className='event-show-index'>
                <div className='map-container'>
                    {event && (
                        <EventShowMapWrapper
                            events={[event]}
                            mapOptions={mapOptions}
                        />
                    )}
                </div>

                <div className='display-one-event'>
                    {user && joined ? (
                        ''
                    ) : (
                        <div className='event-request'>
                            Sign up or request to join for more details!
                        </div>
                    )}
                    <ul className='event-info-list'>
                        <div className='event-languages'>
                            {event?.languages.map((lang) => {
                                return (
                                    <div key={lang} className='event-lang'>
                                        {lang}
                                    </div>
                                );
                            })}
                        </div>
                        <div className='event-title'>
                            {event?.title}
                            <div className='event-date-time'>
                                <div className='event-date'>
                                    🗓️ {formatDate(event?.date)}
                                </div>
                                <div className='event-time'>
                                    ⏰ {event?.time}
                                </div>
                                {user && joined ? (
                                    <div className='event-address'>
                                        📍 {event?.address}
                                    </div>
                                ) : (
                                    <div className='event-address'>
                                        📍 <em>hidden</em>
                                    </div>
                                )}
                            </div>
                            <div className='event-title-host'>
                                {/* <Icon icon="fluent-mdl2:party-leader" className="event-icon"/> */}
                                {user ? (
                                    <Link to={`/profile/${host?._id}`}>
                                        <img
                                            className='attendee-pfp'
                                            src={host?.pfp}
                                            alt={host?.username}
                                        />
                                    </Link>
                                ) : (
                                    <img
                                        className='attendee-pfp'
                                        src={host?.pfp}
                                        alt={host?.username}
                                        onClick={handleLoggedOutProfileClick}
                                    />
                                )}

                                {user ? (
                                    <Link
                                        id='host-name'
                                        to={`/profile/${host?._id}`}
                                    >
                                        {host?.firstName}
                                    </Link>
                                ) : (
                                    <span
                                        id='host-name'
                                        onClick={handleLoggedOutProfileClick}
                                    >
                                        {host?.firstName}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className='event-details'>
                            {/* <span className="event-language">{event?.languages.map((lang) => {return <li>{lang}</li>})}</span> */}

                            {/* <div id="event-item-title" className="event-show">About</div> */}
                            <div className='event-description-div'>
                                <div className='event-description'>
                                    {event?.description}
                                </div>
                            </div>

                            <div className='event-attendees'>
                                {user && joined && (
                                    <>
                                        <div className='event-show'>
                                            Polyglots Attending
                                        </div>
                                        <div className='attendees'>
                                            {attendees?.map((attendee) => (
                                                <div
                                                    className='attendee-details'
                                                    key={attendee._id}
                                                >
                                                    <Link
                                                        id='no-underline'
                                                        to={`/profile/${attendee._id}`}
                                                    >
                                                        <img
                                                            className='attendee-pfp'
                                                            src={attendee.pfp}
                                                            alt={
                                                                attendee.username
                                                            }
                                                        />
                                                        <span id='attendee-username'>
                                                            {attendee.firstName}
                                                        </span>
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className='event-buttons'>
                                {isHost && (
                                    <button
                                        className='edit-event'
                                        onClick={handleModal}
                                    >
                                        <Icon
                                            className='event-icon'
                                            icon='tdesign:edit'
                                        />{' '}
                                        Edit
                                    </button>
                                )}

                                {isHost && (
                                    <button
                                        className='delete-event'
                                        onClick={handleDeleteEvent}
                                    >
                                        <Icon
                                            className='event-icon'
                                            icon='material-symbols:delete'
                                        />
                                        Delete
                                    </button>
                                )}

                                {!isHost && user && (joined || subscribed) && (
                                    <button
                                        className='unjoin-event'
                                        onClick={handleUnjoin}
                                    >
                                        {joined
                                            ? 'Joined'
                                            : subscribed
                                            ? 'Request Sent!'
                                            : ''}
                                    </button>
                                )}

                                {/* create a request to join button if a user is logged in and current status is neither subscribed or joined */}
                                {user && !subscribed && !joined && (
                                    <button
                                        className='join-event'
                                        onClick={handleJoin}
                                    >
                                        <Icon
                                            icon='gg:add'
                                            className='event-icon'
                                        />{' '}
                                        Request to Join
                                    </button>
                                )}
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default EventShow;
