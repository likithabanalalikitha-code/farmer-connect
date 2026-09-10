import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/common/Spinner';

const GuestRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  }

  if (isAuthenticated) {
    const destination = user?.role === 'farmer'
      ? '/farmer/dashboard'
      : user?.role === 'admin'
        ? '/admin/dashboard'
        : user?.role === 'delivery-agent'
          ? '/delivery/orders'
          : '/marketplace';
    return <Navigate to={destination} replace />;
  }

  return children;
};

export default GuestRoute;