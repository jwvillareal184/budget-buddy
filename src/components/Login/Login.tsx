import './Login.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

export function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();
  const { setUser } = useUser(); // 👈 use context

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
    <div>
      <form onSubmit={handleSubmit}>
        <input type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} required />
        <input type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} required />
        <button type='submit'>Log in</button>
      </form>
    </div>
  );
}
