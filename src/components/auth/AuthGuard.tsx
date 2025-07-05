import React, { useState } from 'react';
import LoginForm from './LoginForm';
import OTPVerification from './OTPVerification';
import { useAuth } from './AuthProvider';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, login, loading } = useAuth();
  const [showOTP, setShowOTP] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const handleLoginSuccess = (email: string) => {
    setPendingEmail(email);
    setShowOTP(true);
  };

  const handleOTPSuccess = () => {
    const dummyUser = {
      success: true,
      message: 'Logged in',
      userId: '12345',
      email: pendingEmail,
      name: 'Demo User',
      uid: 'UID123',
      websiteUrl: 'https://example.com',
      adminUrl: 'https://admin.example.com',
    };
    login(dummyUser);
    setShowOTP(false);
    setPendingEmail('');
  };

  const handleBackToLogin = () => {
    setShowOTP(false);
    setPendingEmail('');
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (!isAuthenticated) {
    if (showOTP) {
      return (
        <OTPVerification
          email={pendingEmail}
          onVerifySuccess={handleOTPSuccess}
          onBack={handleBackToLogin}
        />
      );
    }

    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return <>{children}</>;
};

export default AuthGuard;
