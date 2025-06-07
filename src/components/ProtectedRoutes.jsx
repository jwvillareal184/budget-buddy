// components/ProtectedRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';


export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = false; // replace with your real auth logic

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>; // valid JSX element
};
