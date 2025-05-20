import jwtFetch from './jwt';
import { RECEIVE_JOIN_REQUEST } from './events';
import { RECEIVE_EVENT } from './events';
import { receiveCurrentUser } from './session';
import { closeModal } from './modal';

export const RECEIVE_USER = 'users/RECEIVE_USER';
export const RECEIVE_USERS = 'users/RECEIVE_USERS';
export const RECEIVE_EVENT_JOIN = 'users/RECEIVE_EVENT_JOIN';
export const RECEIVE_UPDATE_ERRORS = 'users/RECEIVE_UPDATE_ERRORS';
export const CLEAR_UPDATE_ERRORS = 'users/CLEAR_UPDATE_ERRORS';

export const receiveUser = (user) => ({
    type: RECEIVE_USER,
    user,
});

export const receiveUsers = (users) => ({
    type: RECEIVE_USERS,
    users,
});

export const receiveEventJoin = (eventJoin) => ({
    type: RECEIVE_EVENT_JOIN,
    eventJoin,
});

export const receiveUpdatedUser = (eventJoin) => ({
    type: RECEIVE_EVENT_JOIN,
    eventJoin,
});

// Dispatch receiveUpdateErros to show validation errors on the frontend.
export const receiveUpdateUserErrors = (errors) => ({
    type: RECEIVE_UPDATE_ERRORS,
    errors,
});

export const clearUpdateUserErrors = () => ({
    type: CLEAR_UPDATE_ERRORS,
});

export const updateUser = (user) => async (dispatch) => {
    try {
        const res = await jwtFetch(`/api/users/${user._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });
        const updatedUser = await res.json();
        dispatch(receiveUser(updatedUser));
        dispatch(receiveCurrentUser(updatedUser));
        dispatch(closeModal());
    } catch (err) {
        const resBody = await err.json();
        if (resBody.statusCode === 400) {
            dispatch(receiveUpdateUserErrors(resBody.errors));
        }
        return resBody;
    }
};

export const getAttendees = (event) => (state) => {
    const holder = [];
    if (event) {
        Object.values(state.users).forEach((user) => {
            if (event.attendees.includes(user._id)) {
                holder.push(user);
            }
        });
        return holder;
    }
};

export const getPendingAttendees = (event) => (state) => {
    const holder = [];
    if (event) {
        Object.values(state.users).forEach((user) => {
            if (event.pendingAttendees.includes(user._id)) {
                holder.push(user);
            }
        });
        return holder;
    }
};

export const getConnections = (events) => (state) => {
    const holder = [];
    const idHolder = [];
    if (events) {
        events.forEach((event) => {
            Object.values(state.users).forEach((user) => {
                if (
                    event.attendees.includes(user._id) &&
                    !idHolder.includes(user)
                ) {
                    holder.push(user);
                    idHolder.push(user._id);
                }
            });
        });
    }
    return holder;
};

export const getUser = (userId) => (state) => {
    if (state?.users) {
        return state.users[userId];
    }
};

export const getHost = (event) => (state) => {
    if (event?.host) {
        return state.users[event.host];
    }
};

export const addEventJoin = (userId, eventId) => async (dispatch) => {
    const res = await jwtFetch(`/api/users/${userId}/events/${eventId}`, {
        method: 'POST',
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(receiveEventJoin(data));
    }
};

export const removeEventJoin = (userId, eventId) => async (dispatch) => {
    const res = await jwtFetch(`/api/users/${userId}/events/${eventId}`, {
        method: 'DELETE',
    });
    if (res.ok) {
        const data = await res.json();
        dispatch(receiveEventJoin(data));
    }
};

export const fetchUser = (userId) => async (dispatch) => {
    const res = await fetch(`/api/users/${userId}`);
    if (res.ok) {
        const user = await res.json();
        dispatch(receiveUser(user));
    }
};

export const fetchUsers = () => async (dispatch) => {
    const res = await jwtFetch(`/api/users`);

    if (res.ok) {
        const users = await res.json();
        dispatch(receiveUsers(users));
    }
};

const nullErrors = null;

export const updateUserErrorsReducer = (state = nullErrors, action) => {
    switch (action.type) {
        case RECEIVE_UPDATE_ERRORS:
            return action.errors;
        case CLEAR_UPDATE_ERRORS:
            return nullErrors;
        default:
            return state;
    }
};

const usersReducer = (state = {}, action) => {
    const newState = {};
    switch (action.type) {
        case RECEIVE_USER:
            return { ...state, [action.user._id]: action.user };
        case RECEIVE_USERS:
            Object.values(action.users).forEach((user) => {
                newState[user._id] = user;
            });
            return { ...state, ...newState };
        case RECEIVE_EVENT_JOIN:
            return {
                ...state,
                [action.eventJoin.user._id]: action.eventJoin.user,
            };
        case RECEIVE_JOIN_REQUEST:
            return {
                ...state,
                [action.joinRequest.user._id]: action.joinRequest.user,
            };
        case RECEIVE_EVENT:
            if (action.event.attendees) {
                Object.values(action.event.attendees).forEach((user) => {
                    newState[user._id] = user;
                });
            }

            if (action.event.pendingAttendees) {
                Object.values(action.event.pendingAttendees).forEach((user) => {
                    newState[user._id] = user;
                });
            }

            return { ...state, ...newState };
        default:
            return state;
    }
};
export default usersReducer;
