import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { openModal } from '../../store/modal';
import './index.css';
import ProfileButton from './ProfileButton';

const NavBar = () => {
    const loggedIn = useSelector((state) => !!state.session.user);
    const user = useSelector((state) => state.session.user);
    const dispatch = useDispatch();

    const getLinks = () => {
        if (loggedIn) {
            return (
                <div className='logged-in-links'>
                    <div id='google_translate_element'></div>
                    <NavLink
                        className='logged-in-link'
                        id='about-us'
                        to={'/aboutus'}
                        activeClassName='active'
                    >
                        About Us
                    </NavLink>
                    <NavLink
                        className='logged-in-link'
                        id='all-events'
                        to={'/events'}
                        activeClassName='active'
                    >
                        Exchanges
                    </NavLink>
                    <button
                        className='logged-in-link'
                        id='create-event-button'
                        onClick={() => dispatch(openModal('createEvent'))}
                    >
                        Host an Exchange
                    </button>
                    <ProfileButton user={user} />
                </div>
            );
        } else {
            return (
                <div className='logged-out-links'>
                    <div id='google_translate_element'></div>
                    <NavLink
                        className='no-underline'
                        to={'/aboutus'}
                        activeClassName='active'
                    >
                        About Us
                    </NavLink>
                    <NavLink
                        className='no-underline'
                        to={'/events'}
                        activeClassName='active'
                    >
                        Exchanges
                    </NavLink>
                    <button
                        className='signup-button'
                        onClick={() => dispatch(openModal('signup'))}
                    >
                        Signup
                    </button>
                    <button
                        className='login-button'
                        onClick={() => dispatch(openModal('login'))}
                    >
                        Log In
                    </button>
                </div>
            );
        }
    };

    return (
        <nav className='nav-bar'>
            <NavLink to='/' className='no-underline'>
                <h1 className='nav-bar-header'>Lingo Lounge</h1>
            </NavLink>
            <div className='nav-links'>{getLinks()}</div>
        </nav>
    );
};

export default NavBar;
