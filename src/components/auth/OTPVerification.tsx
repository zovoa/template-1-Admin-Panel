import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Mail, RefreshCw } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const { login } = useAuth();

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const Base_url = `https://8ed7-106-208-116-1.ngrok-free.app`

  // ✅ Send OTP initially
  useEffect(() => {
    if (!email) {
      console.warn('⚠️ No email found in location.state — redirecting to login...');
      navigate('/');
      return;
    }

    const sendOtp = async () => {
      console.log('📤 Sending OTP to:', email);
      try {
        const response = await fetch(
          `${Base_url}/web/otp_send?mail=${email}`,
          { method: 'POST' }
        );
        console.log('📬 OTP Send Status:', response.status);
      } catch (err) {
        console.error('❌ Failed to send OTP:', err);
        setError('Failed to send OTP');
      }
    };

    sendOtp();
  }, [email, navigate]);

  // ✅ Countdown for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // ✅ Submit OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${Base_url}/web/otp_verify?email=${email}&otp=${otp}`,
        { method: 'POST' }
      );

      console.log('🔐 OTP Verify Status:', response.status);

      if (response.status === 200) {
        const result = await response.json();

        // 🧠 Load previous login object from localStorage
        const existingUser = JSON.parse(localStorage.getItem('auth_user') || '{}');

        // 🔀 Merge OTP response into previous login object
        const updatedUser = {
          ...existingUser,
          ...result,
        };
        login(updatedUser);

        console.log('👓 Existing user from storage:', existingUser);
        console.log('✅ Final Merged User:', updatedUser);



       

        login(updatedUser); // Save to context + localStorage
        console.log('🧠 Saved merged user to context + storage.');

        navigate('/dashboard');
      } else {
        const msg = await response.text();
        throw new Error(msg || 'Invalid OTP');
      }
    } catch (err) {
      console.error('❌ OTP verification failed:', err);
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(
        `${Base_url}/web/otp_send?mail=${email}`,
        { method: 'POST' }
      );
      console.log('🔁 OTP Resent. Status:', response.status);
      setCountdown(30);
      setCanResend(false);
      setOtp('');
    } catch (err) {
      console.error('❌ Failed to resend OTP:', err);
      setError('Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription>
            We’ve sent a 6-digit verification code to<br />
            <span className="font-medium text-gray-900">{email}</span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">Didn't receive the code?</p>
              {canResend ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Resend Code
                </Button>
              ) : (
                <p className="text-sm text-gray-500">Resend code in {countdown}s</p>
              )}
            </div>

            <Button type="button" variant="ghost" onClick={handleBack} className="w-full">
              Back to Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPVerification;
