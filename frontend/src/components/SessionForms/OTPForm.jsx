import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './index.css';
import { verifyOTP, requestOTP, clearSessionErrors } from '../../store/session';

const OTPForm = () => {
    const [otp, setOTP] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const errors = useSelector((state) => state.errors.session);
    const { email } = useSelector((state) => state.session.otpVerification);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        dispatch(clearSessionErrors());
    }, [dispatch]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && isResending) {
            setIsResending(false);
        }
    }, [countdown, isResending]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(verifyOTP(email, otp, history));
    };

    const handleResendOTP = async () => {
        if (countdown === 0) {
            setIsResending(true);
            setCountdown(60); // 60 seconds cooldown
            await dispatch(requestOTP(email));
        }
    };

    return (
        <form className='otp-form' onSubmit={handleSubmit}>
            <h2>OTP Verification</h2>
            <p className="otp-instruction">
                A verification code has been sent to your email: <strong>{email}</strong>
            </p>

            <div className="otp-input-container">
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                    placeholder="Enter OTP"
                    maxLength={4}
                    className="otp-input"
                />
            </div>

            {errors?.otp && <div className="errors"><p>{errors.otp}</p></div>}

            <div className="button-container">
                <button
                    type="submit"
                    disabled={!otp || otp.length < 4}
                    className="verify-otp-button"
                >
                    Verify OTP
                </button>
            </div>

            <p className="resend-otp">
                Didn't receive the code?{' '}
                {countdown > 0 ? (
                    <span className="countdown">Resend in {countdown}s</span>
                ) : (
                    <span className="resend-link" onClick={handleResendOTP}>
                        Resend OTP
                    </span>
                )}
            </p>
        </form>
    );
};

export default OTPForm;