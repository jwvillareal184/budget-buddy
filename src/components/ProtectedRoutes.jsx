// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export const ProtectedRoutes = () => {
  const { user } = useUser();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
