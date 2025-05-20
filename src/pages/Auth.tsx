
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/context/AuthContext';

export default function Auth() {
  const location = useLocation();
  const isSignup = location.pathname === '/auth/signup';
  const { user, isLoading } = useAuth();
  
  // If we have a user and finished loading, redirect to home
  if (user && !isLoading) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-festive-600">FestiveFeastFind</h1>
          <p className="text-muted-foreground mt-2">
            {isSignup ? 'Create an account to get started' : 'Welcome back!'}
          </p>
        </div>
        <AuthForm type={isSignup ? 'signup' : 'signin'} />
      </div>
    </div>
  );
}
