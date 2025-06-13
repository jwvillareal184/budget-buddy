import { Routes, Route, useLocation } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Expense } from './pages/Expense';
import { Income } from './pages/Income';
import { Goal } from './pages/Goal';
import { Profile } from './pages/Profile';
import { SignUp } from './pages/SignUp';
import { Navbar } from './components/Navbar';
import { useUser } from './context/UserContext';
import './App.css';

function App() {
  const { user } = useUser();
  const location = useLocation();

  const hideNavbar = !user || ['/login', '/register'].includes(location.pathname);

  return (
    <div className='whole-container'>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expense />} />
        <Route path="/income" element={<Income />} />
        <Route path="/goals" element={<Goal />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
