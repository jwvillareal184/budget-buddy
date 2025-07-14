import './Login.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { PrimaryButton, Headers, FloatingLabelInput, Particles } from '../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 👇 Track remaining attempts
  const [attemptsLeft, setAttemptsLeft] = useState(3);

  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:3001/user/login', { email, password })
      .then(result => {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user)); 
        setUser(result.data.user);
        setTimeout(() => navigate("/dashboard"), 3000);
        
      })
      .catch(error => {
        // On any error, decrement attempts
        setAttemptsLeft(prev => prev - 1);

        if (error.response) {
          const message = error.response.data.message;

          if (message === 'Incorrect password') {
            if (attemptsLeft - 1 > 0) {
              alert(`Password incorrect. You have ${attemptsLeft - 1} attempt${attemptsLeft - 1 > 1 ? 's' : ''} left.`);
            } else {
              alert('Too many failed attempts. Redirecting to Forgot Password.');
              navigate('/forgot-password');
            }
          } else if (message === 'User not found') {
            alert('Account does not exist. Please sign up.');
            navigate('/register');
          } else {
            alert('Login failed: ' + message);
          }
        } else {
          alert("Login failed due to network/server error");
        }
      });
  };

  return (
    <div className="container-login">
      <Particles
        particleColors={['#6A1E55', '#A64D79']}
        particleCount={200}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={200}
        moveParticlesOnHover={true}
        alphaParticles={false}
        disableRotation={false}
      />
      <div className="login-content">
        <Headers label='Login' />
        <form onSubmit={handleSubmit}>
          <FloatingLabelInput
            type='email'
            name='email'
            label='Email'
            onChange={e => setEmail(e.target.value)}
            value={email}
          />

          <div className="show-hide-pass">
            <FloatingLabelInput
              type={showPassword ? 'text' : 'password'}
              name="password"
              onChange={e => setPassword(e.target.value)}
              value={password}
              label="Password"
              className="flex-grow"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="toggle-pass-btn"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          <PrimaryButton type='submit' label='Login' />
        </form>

        <div className="signup">
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')}>Sign up for free</span>
        </div>
      </div>
    </div>
  );
}
