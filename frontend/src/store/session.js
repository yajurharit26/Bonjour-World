import jwtFetch from './jwt';
import { closeModal, openModal } from './modal';

const RECEIVE_CURRENT_USER = 'session/RECEIVE_CURRENT_USER';
const RECEIVE_SESSION_ERRORS = 'session/RECEIVE_SESSION_ERRORS';
const CLEAR_SESSION_ERRORS = 'session/CLEAR_SESSION_ERRORS';
export const RECEIVE_USER_LOGOUT = 'session/RECEIVE_USER_LOGOUT';
const REQUIRE_OTP_VERIFICATION = 'session/REQUIRE_OTP_VERIFICATION';
const CLEAR_OTP_VERIFICATION = 'session/CLEAR_OTP_VERIFICATION';

export const receiveCurrentUser = (currentUser) => ({
    type: RECEIVE_CURRENT_USER,
    currentUser,
});

const receiveErrors = (errors) => ({
    type: RECEIVE_SESSION_ERRORS,
    errors,
});

const logoutUser = () => ({
    type: RECEIVE_USER_LOGOUT,
});

export const clearSessionErrors = () => ({
    type: CLEAR_SESSION_ERRORS,
});

const requireOTPVerification = (email, password) => ({
    type: REQUIRE_OTP_VERIFICATION,
    email,
    password
});

export const clearOTPVerification = () => ({
    type: CLEAR_OTP_VERIFICATION
});

export const signup = (user, history) => async (dispatch) => {
    try {
        const res = await jwtFetch('api/users/register', {
            method: 'POST',
            body: JSON.stringify(user),
        });
        const data = await res.json();
        
        if (data.requireOTP) {
            dispatch(requireOTPVerification(data.email, user.password));
            dispatch(openModal('otp'));
            return data;
        } else {
            const { user, token } = data;
            localStorage.setItem('jwtToken', token);
            dispatch(receiveCurrentUser(user));
            dispatch(closeModal());
            history.push('/events');
            return data;
        }
    } catch (err) {
        const res = await err.json();
        if (res.statusCode === 400) {
            dispatch(receiveErrors(res.errors));
            return res;
        }
    }
};

export const login = (user, history) => async (dispatch) => {
    try {
        const res = await jwtFetch('api/users/login', {
            method: 'POST',
            body: JSON.stringify(user),
        });
        const data = await res.json();
        
        if (data.requireOTP) {
            dispatch(requireOTPVerification(data.email, user.password));
            dispatch(openModal('otp'));
            return data;
        } else {
            const { user, token } = data;
            localStorage.setItem('jwtToken', token);
            dispatch(receiveCurrentUser(user));
            dispatch(closeModal());
            history.push('/events');
            return data;
        }
    } catch (err) {
        const res = await err.json();
        if (res.statusCode === 400) {
            dispatch(receiveErrors(res.errors));
            return res;
        }
    }
};

export const requestOTP = (email) => async (dispatch) => {
    try {
        const res = await jwtFetch('api/users/request-otp', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
        return await res.json();
    } catch (err) {
        const res = await err.json();
        if (res.statusCode === 400 || res.statusCode === 404) {
            dispatch(receiveErrors(res.errors));
            return res;
        }
    }
};

export const verifyOTP = (email, otp, history) => async (dispatch) => {
    try {
        const res = await jwtFetch('api/users/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ email, otp }),
        });
        const { user, token } = await res.json();
        localStorage.setItem('jwtToken', token);
        dispatch(receiveCurrentUser(user));
        dispatch(clearOTPVerification());
        dispatch(closeModal());
        history.push('/events');
    } catch (err) {
        const res = await err.json();
        if (res.statusCode === 400) {
            dispatch(receiveErrors(res.errors));
            return res;
        }
    }
};

export const logout = () => (dispatch) => {
    localStorage.removeItem('jwtToken');
    dispatch(logoutUser());
};

export const getCurrentUser = () => async (dispatch) => {
    const res = await jwtFetch('/api/users/current');
    const user = await res.json();
    return dispatch(receiveCurrentUser(user));
};

const nullErrors = null;

export const sessionErrorsReducer = (state = nullErrors, action) => {
    switch (action.type) {
        case RECEIVE_SESSION_ERRORS:
            return action.errors;
        case CLEAR_SESSION_ERRORS:
            return nullErrors;
        default:
            return state;
    }
};

const initialState = {
    user: undefined,
    otpVerification: {
        required: false,
        email: null,
        password: null
    }
};

const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_CURRENT_USER:
            return { 
                ...state,
                user: action.currentUser,
                otpVerification: {
                    required: false,
                    email: null,
                    password: null
                }
            };
        case RECEIVE_USER_LOGOUT:
            return {
                ...initialState,
                otpVerification: {
                    required: false,
                    email: null,
                    password: null
                }
            };
        case REQUIRE_OTP_VERIFICATION:
            return {
                ...state,
                otpVerification: {
                    required: true,
                    email: action.email,
                    password: action.password
                }
            };
        case CLEAR_OTP_VERIFICATION:
            return {
                ...state,
                otpVerification: {
                    required: false,
                    email: null,
                    password: null
                }
            };
        default:
            return state;
    }
};

export default sessionReducer;