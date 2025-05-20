
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './index.css';
import { closeModal, openModal } from '../../../store/modal';
import { login, clearSessionErrors } from '../../../store/session';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const errors = useSelector((state) => state.errors.session);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        dispatch(clearSessionErrors());
    }, [dispatch]);

    const update = (field) => {
        const setState = field === 'email' ? setEmail : setPassword;
        return (e) => setState(e.currentTarget.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }, history));
    };

    const handleGuestLogin = async () => {
        dispatch(clearSessionErrors());
        setEmail('');
        setPassword('');
        setShowPassword(false);

        // typing effect
        const typingEffect = async (credential, setCredential) => {
            for (const char of credential) {
                // typing in the credential one char at a time
                await new Promise((resolve) =>
                    setTimeout(() => {
                        setCredential((prev) => prev + char);
                        resolve();
                    }, 30)
                );
            }
        };

        await typingEffect('bonjour@guest.com', setEmail);
        await typingEffect('guestpassword1234', setPassword);

        // login guest after typing effect is complete
        const guestCredentials = {
            email: 'demo@demo.com',
            password: 'password',
        };
        await new Promise((resolve) => setTimeout(resolve, 300)); // short pause
        dispatch(login(guestCredentials, history));
    };

    const linkToOtherModal = () => {
        dispatch(closeModal());
        dispatch(openModal('signup'));
    };

    return (
        <form className='login-form' onSubmit={handleSubmit}>
            <h2>Login</h2>

            <input
                type='text'
                value={email}
                onChange={update('email')}
                placeholder='Email'
                className='email-input'
            />
            <div className='input-container'>
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={update('password')}
                    placeholder='Password'
                />
                <i
                    className={
                        showPassword
                            ? 'fa-solid fa-eye password-toggle'
                            : 'fa-solid fa-eye-slash password-toggle'
                    }
                    onClick={() => setShowPassword((prev) => !prev)}
                />
            </div>

            {errors && (
                <div className='errors'>
                    <p>{errors?.email}</p>
                    <p>{errors?.password}</p>
                </div>
            )}
            <div className='button-container'>
                <button
                    type='button'
                    onClick={handleGuestLogin}
                    className='login-as-guest-button'
                >
                    Login as Guest
                </button>
                <button
                    type='submit'
                    disabled={!email || !password}
                    className='login-button'
                >
                    Login
                </button>
            </div>
            <p className='link-to-other-modal'>
                Don't have an account?{' '}
                <span onClick={linkToOtherModal}>
                    Sign up for Bonjour World
                </span>
            </p>
        </form>
    );
};

export default LoginForm;