import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './index.css';
import { closeModal, openModal } from '../../../store/modal';
import { signup, clearSessionErrors } from '../../../store/session';

const SignupForm = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const errors = useSelector((state) => state.errors.session);

    useEffect(() => {
        dispatch(clearSessionErrors());
    }, [dispatch]);

    const update = (field) => {
        let setState;

        switch (field) {
            case 'firstName':
                setState = setFirstName;
                break;
            case 'lastName':
                setState = setLastName;
                break;
            case 'email':
                setState = setEmail;
                break;
            case 'username':
                setState = setUsername;
                break;
            case 'password':
                setState = setPassword;
                break;
            case 'passwordConfirmation':
                setState = setPasswordConfirmation;
                break;
            default:
                throw Error('Unknown field in Signup Form');
        }

        return (e) => setState(e.currentTarget.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const user = {
            firstName,
            lastName,
            email,
            username,
            password,
        };

        dispatch(signup(user, history));
    };

    const alreadyHaveAcct = () => {
        dispatch(closeModal());
        dispatch(openModal('login'));
    };

    return (
        <form className='signup-form' onSubmit={handleSubmit}>
            <h2>Sign Up</h2>

            <div className='inputs'>
                <div className='row-1'>
                    <div className='input-div'>
                        <input
                            type='text'
                            value={firstName}
                            onChange={update('firstName')}
                            placeholder='First Name'
                        />
                    </div>

                    <div className='input-div'>
                        <input
                            type='text'
                            value={lastName}
                            onChange={update('lastName')}
                            placeholder='Last Name'
                        />
                    </div>
                </div>

                <div className='errors'>{errors?.username}</div>
                <div className='errors'>{errors?.email}</div>

                <div className='row-2'>
                    <div className='input-div'>
                        <input
                            type='email'
                            value={email}
                            onChange={update('email')}
                            placeholder='Email'
                        />
                    </div>

                    <div className='input-div'>
                        <input
                            type='text'
                            value={username}
                            onChange={update('username')}
                            placeholder='Username'
                        />
                    </div>
                </div>

                <div className='errors'>
                    {password !== passwordConfirmation &&
                        'Confirm Password field must match'}
                </div>
                <div className='errors'>{errors?.password}</div>

                <div className='row-3'>
                    <div className='input-div'>
                        <input
                            type='password'
                            value={password}
                            onChange={update('password')}
                            placeholder='Password'
                        />
                    </div>

                    <div className='input-div confirm-div'>
                        <input
                            type='password'
                            value={passwordConfirmation}
                            onChange={update('passwordConfirmation')}
                            placeholder='Confirm Password'
                        />
                    </div>
                </div>
            </div>

            <input
                type='submit'
                value='Sign Up'
                disabled={
                    !email ||
                    !username ||
                    !password ||
                    password !== passwordConfirmation
                }
            />
            <p className='link-to-other-modal'>
                Already have an account?{' '}
                <span onClick={alreadyHaveAcct}>Log in here</span>
            </p>
        </form>
    );
};

export default SignupForm;