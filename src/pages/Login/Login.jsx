import './Login.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { PrimaryButton, Headers, FloatingLabelInput } from '../../components';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser(); // 👈 use context

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/user/login', { email, password })
      .then(result => {
        localStorage.setItem('token', result.data.token);

        // Save user to context
        setUser(result.data.user);

        navigate("/dashboard");
      })
      .catch(error => {
        if (error.response) {
          const message = error.response.data.message;

          if (message === 'Incorrect password') {
            alert('Password Incorrect');
          } else if (message === 'User not found') {
            alert('Account does not exist');
            navigate('/register');
          } else {
            alert('Login failed: ' + message);
          }
        } else {
          console.log(error);
          alert("Login failed due to network/server error");
        }
      });
  };

  return (

      <div className="login-content">
        <Headers label='Login' />
        <form onSubmit={handleSubmit}>
         
          <FloatingLabelInput type='email' name='email' label='Email' onChange={(e) => setEmail(e.target.value)}/>
          <FloatingLabelInput type='password' name='password' label='Password' onChange={(e) => setPassword(e.target.value)}/>
          <PrimaryButton type='submit' label='Login'  />
        </form>
        <div className="signup">Don't have an account? <span>Sign up for free</span></div>
        
      </div>
    
 
  );
}
