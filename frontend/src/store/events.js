import jwtFetch from "./jwt";
import { RECEIVE_EVENT_JOIN } from "./users";

export const RECEIVE_EVENTS = "events/RECEIVE_EVENTS";
export const RECEIVE_EVENT = "events/RECEIVE_EVENT";
export const REMOVE_EVENT = "events/REMOVE_EVENT";

export const SET_CENTER = "events/SET_CENTER";

export const RECEIVE_EVENT_ERRORS = "events/RECEIVE_EVENT_ERRORS";
export const RECEIVE_NEW_EVENT = "events/RECEIVE_NEW_EVENT";
export const CLEAR_EVENT_ERRORS = "events/CLEAR_EVENT_ERRORS";

export const RECEIVE_JOIN_REQUEST = "users/RECEIVE_JOIN_REQUEST";

export const recieveEvents = (events) => ({
  type: RECEIVE_EVENTS,
  events,
});

export const recieveEvent = (event) => ({
  type: RECEIVE_EVENT,
  event,
});

export const removeEvent = (eventId) => ({
  type: REMOVE_EVENT,
  eventId,
});

const receiveErrors = (errors) => ({
  type: RECEIVE_EVENT_ERRORS,
  errors,
});

const receiveNewEvent = (errors) => ({
  type: RECEIVE_NEW_EVENT,
  errors,
});

const receiveJoinRequest = (joinRequest) => ({
  type: RECEIVE_JOIN_REQUEST,
  joinRequest
})

export const clearEventErrors = (errors) => ({
  type: CLEAR_EVENT_ERRORS,
  errors,
});

export const setCenter = (center) => ({
  type: SET_CENTER, 
  center
})

export const getEvent = (eventId) => (state) =>
  state.events ? state.events[eventId] : null;
export const getEvents = (state) =>
  state.events ? state.events : [];

export const getRelevantEvents = (userId) => (state) => {
  const holder = [];
  if (userId) {
    Object.values(state.events).filter((event) => {
      if (event.attendees.includes(userId)) {
        holder.push(event)
      }
    }) 
    return holder
  }
}

export const getHostedEvents = (userId) => (state) => {
  const holder = [];
  if (userId) {
    Object.values(state.events).filter((event) => {
      if (event.host === userId) {
        holder.push(event)
      }
    }) 
  }
  return holder
}

export const fetchEvents = (filters = {}) => async (dispatch) => {
  try {
    // Convert filters object to query string
    const queryString = new URLSearchParams(filters).toString();

    // Append the query string to the request URL
    const url = `/api/events${queryString ? `?${queryString}` : ''}`;

    // Make the GET request
    const res = await jwtFetch(url);

    if (res.ok) {
      const events = await res.json();
      dispatch(recieveEvents(events));
    } else {
      // Handle non-ok response
      console.error('Error fetching events:', res.statusText);
    }
  } catch (error) {
    // Handle errors
    console.error('Error fetching events:', error);
  }
};

export const fetchEvent = (eventId) => async (dispatch) => {
  const res = await fetch(`/api/events/${eventId}`);

  if (res.ok) {
    const event = await res.json();
    dispatch(recieveEvent(event));
  }
};

export const createEvent = (data) => async (dispatch) => {
  try {
    const res = await jwtFetch(`/api/events/`, {
      method: "POST",
      body: JSON.stringify(data)
    });
    const event = await res.json();
    dispatch(receiveNewEvent(event));
    return event;
  } catch (err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      return dispatch(receiveErrors(resBody.errors));
    }
  }
};

export const updateEvent = (data) => async (dispatch) => {
  try {
    const res = await jwtFetch(`/api/events/${data._id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    const event = await res.json();
    dispatch(recieveEvent(event));
    return res;
  } catch (err) {
    const resBody = await err.json();
    if (resBody.statusCode === 400) {
      return dispatch(receiveErrors(resBody.errors));
    }
  }
};

export const deleteEvent = (eventId) => async (dispatch) => {
  const res = await jwtFetch(`/api/events/${eventId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    dispatch(removeEvent(eventId));
  }
};

export const createJoinRequest = (eventId, userId) => async (dispatch) => {
  const res = await jwtFetch(`/api/events/${eventId}/users/${userId}`, {method: "POST"});
  if (res.ok) {
    let data = await res.json();
    dispatch(receiveJoinRequest(data));
    return res;
  }
}

export const deleteJoinRequest = (eventId, userId) => async (dispatch) => {
  const res = await jwtFetch(`/api/events/${eventId}/users/${userId}`, {method: "DELETE"});
  if (res.ok) {
    let data = await res.json();
    dispatch(receiveJoinRequest(data));
    return res;
  } else {
    return res.json();
  }
}

const nullErrors = null;

export const eventErrorsReducer = (state = nullErrors, action) => {
  switch (action.type) {
    case RECEIVE_EVENT_ERRORS:
      return action.errors;
    case RECEIVE_NEW_EVENT:
      return { ...state, new: action.event };
    case CLEAR_EVENT_ERRORS:
      return nullErrors;
    default:
      return state;
  }
};

const eventsReducer = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_EVENTS:
      return { ...action.events };
    case RECEIVE_EVENT:
      return { ...state, [action.event.event._id]: action.event.event };
    case REMOVE_EVENT:
      const newState = { ...state };
      delete newState[action.eventId];
      return newState;
    case RECEIVE_EVENT_JOIN:
      return {...state, [action.eventJoin.event._id]: action.eventJoin.event}
    case RECEIVE_JOIN_REQUEST:
      return {...state, [action.joinRequest.event._id]: action.joinRequest.event}
    case SET_CENTER: 
      return {...state, center: action.center}  
    default:
      return state;
  }
};

export default eventsReducer;
