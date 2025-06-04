import {useState} from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import {SignUp} from './components/SignUp';
import {Login} from './components/Login';
import {Dashboard} from './components/Dashboard';
import { UserProvider } from './components/UserContext';

function App() {
  return (

    <Routes>
      <Route path='/register' element={<SignUp />}/>
      <Route path='/login' element={<Login />}/>
      <Route path='/dashboard' element={<Dashboard />}/>
    </Routes>

  );
}

export default App;
