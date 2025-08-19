import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Shield } from 'lucide-react';
import api from "../../api";
import { useAuth } from '../../contexts/AuthContext';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const { userId, email, fromLogin } = location.state || {};

  useEffect(() => {
    if (!userId || !email) {
      navigate('/login');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error('OTP has expired. Please try again.');
          navigate('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [userId, email, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/api/auth/verify-otp', {
        userId,
        otp
      });

      login(response.data.user, response.data.token);
      toast.success('Email verified successfully!');
      navigate(response.data.user.role === 'admin' ? '/admin' : '/voter');
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      if (fromLogin) {
        await api.post('/api/auth/login', { email, password: 'dummy' });
      } else {
        // For registration, we might need to implement a separate resend endpoint
        toast.info('Please try registering again to get a new OTP');
        navigate('/register');
        return;
      }
      toast.success('New OTP sent to your email');
      setTimeLeft(600);
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Verify your email
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-sm font-medium text-indigo-400">{email}</p>
          <p className="mt-2 text-sm text-gray-400">
            Code expires in: <span className="font-medium text-red-400">{formatTime(timeLeft)}</span>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-300 text-center">
              Enter verification code
            </label>
            <div className="mt-4">
              <input
                id="otp"
                name="otp"
                type="text"
                maxLength="6"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="appearance-none relative block w-full px-3 py-4 border border-gray-700 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-center text-2xl font-mono tracking-widest"
                placeholder="000000"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResendOTP}
                className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Resend Code
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;