import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import {
  ForgotPassword, Login, Dashboard, Expense,
  Income, Goal, Profile, SignUp
} from './pages';
import { Navbar } from './components/Navbar';
import { useUser } from './context/UserContext';
import { ProtectedRoutes } from './components/ProtectedRoutes';
import './App.css';

function App() {
  const { user } = useUser();
  const location = useLocation();

  const hideNavbar = !user || ['/login', '/register', '/forgot-password'].includes(location.pathname);

  return (
    <div className="whole-container">
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<Expense />} />
          <Route path="/income" element={<Income />} />
          <Route path="/goals" element={<Goal />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Catch-All: Not Found / Redirect */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </div>
  );
}

export default App;
