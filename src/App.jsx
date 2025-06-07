import { Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Expense } from './pages/Expense';
import { Income } from './pages/Income';
import {Goal} from './pages/Goal';
import {Profile} from './pages/Profile'
import { ProtectedRoute } from './components/ProtectedRoutes';
import { SignUp } from './pages/SignUp';
import './App.css'

function App() {
  return (
    <div className='container'>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />}/>
      <Route path="/expenses" element={<Expense /> } />
      <Route path="/income" element={<Income /> } />
      <Route path='/goals' element={<Goal/>} />
      <Route path='/profile' element={<Profile/>} />
    </Routes>
    </div>
  );
}

export default App;
