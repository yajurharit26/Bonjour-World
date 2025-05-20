import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../Event/EventForm.css';
import { closeModal } from '../../store/modal';
import {
    clearUpdateUserErrors,
    fetchUser,
    fetchUsers,
    getUser,
    updateUser,
} from '../../store/users';
import './index.css';

const UserSettings = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.session.user);
    const currentUser = useSelector(getUser(user._id));

    const errors = useSelector((state) => state.errors.updateUser);

    const [username, setUsername] = useState(currentUser?.username);
    const [email, setEmail] = useState(currentUser?.email);
    const [languages, setLanguages] = useState(currentUser?.languages);

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchUser(user._id));
    }, [dispatch, user._id]);

    useEffect(() => {
        setUsername(currentUser?.username);
        setEmail(currentUser?.email);
        setLanguages(currentUser?.languages);
    }, [currentUser]);

    useEffect(() => {
        return () => dispatch(clearUpdateUserErrors());
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedUser = {
            ...currentUser,
            username,
            email,
            languages,
        };
        dispatch(updateUser(updatedUser));
    };

    const update = (field) => {
        return (e) => {
            switch (field) {
                case 'username':
                    setUsername(e.currentTarget.value);
                    break;
                case 'email':
                    setEmail(e.currentTarget.value);
                    break;
                case 'language':
                    setLanguages(e.currentTarget.value);
                    break;
                default:
                    console.error('Field name error');
                    break;
            }
        };
    };

    const firstSix = [
        'Arabic',
        'English',
        'French',
        'German',
        'Hindi',
        'Japanese',
    ];

    const lastSix = [
        'Korean',
        'Mandarin',
        'Portugese',
        'Russian',
        'Spanish',
        'Swahili',
    ];

    const addLanguage = (lang) => (e) => {
        setLanguages([...languages, lang]);
    };

    const removeLanguage = (lang) => (e) => {
        setLanguages(languages.filter((val) => val !== lang));
    };

    return (
        <form className='user-settings-form' onSubmit={handleSubmit}>
            <h2>
                Hi, {currentUser?.firstName} {currentUser?.lastName}
            </h2>

            <div className='inputs'>
                <div className='username-error errors'>{errors?.username}</div>
                <div className='username-div'>
                    <label htmlFor='username'>Username:</label>
                    <input
                        id='username'
                        type='username'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                    />
                </div>

                <div className='email-error errors'>{errors?.email}</div>
                <div className='email-div'>
                    <label htmlFor='email'>Email:</label>
                    <input
                        id='email'
                        type='text'
                        placeholder='Email'
                        value={email}
                        onChange={update('email')}
                    />
                </div>
            </div>

            <div className='select'>
                <div className='languages-container'>
                    <h3 className='your-languages'>Your Languages</h3>
                    <div className='errors lang-error'>{errors?.languages}</div>
                    <div className='top-language-container'>
                        {firstSix.map((lang) => {
                            return languages?.includes(lang) ? (
                                <div
                                    className='event-unselect-btn lang-btn'
                                    key={lang}
                                    onClick={removeLanguage(lang)}
                                >
                                    <div>{lang}</div>
                                    <div className='x-button'>&times;</div>
                                </div>
                            ) : (
                                <div
                                    className='event-select-btn lang-btn'
                                    key={lang}
                                    onClick={addLanguage(lang)}
                                >
                                    <span>{lang}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className='bottom-language-container'>
                        {lastSix.map((lang) => {
                            return languages?.includes(lang) ? (
                                <div
                                    className='event-unselect-btn lang-btn'
                                    key={lang}
                                    onClick={removeLanguage(lang)}
                                >
                                    <div>{lang}</div>
                                    <div className='x-button'>&times;</div>
                                </div>
                            ) : (
                                <div
                                    className='event-select-btn lang-btn'
                                    key={lang}
                                    onClick={addLanguage(lang)}
                                >
                                    <span>{lang}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <input type='submit' value='Save' />
        </form>
    );
};

export default UserSettings;
