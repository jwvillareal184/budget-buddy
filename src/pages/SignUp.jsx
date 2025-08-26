import {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { FloatingLabelInput, PrimaryButton, SecondaryButton, Headers, Particles } from '../components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import './SignUp.css';

export function SignUp() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [userData, setUserData] = useState({
        fname: '',
        lname: '',
        email: '',
        phoneNum: 0,
        birthday: '',
        occupation: '',
        password: ''
    });

    console.log(userData);

    const handleChange = (e) => {
        const { name, value } = e.target;
      
        setUserData(prev => ({
          ...prev,
          [name]: name === 'phoneNum' ? Number(value) : value
        }));
      };
      const createNewUser = () => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._\-])[A-Za-z\d@$!%*?&._\-]{8,}$/;
      
        if (!passwordRegex.test(userData.password)) {
          alert('Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
          return;
        }
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/register`, userData)
          .then(response => {
            alert('User registered successfully!');
            setUserData({
                fname: '',
                lname: '',
                email: '',
                phoneNum: 0,
                birthday: '',
                occupation: '',
                password: ''
              });
              // Redirect to login
              navigate('/login');
          })
          .catch(error => {
            if (error.response && error.response.status === 409) {
              alert('Email is already registered!');
            } else {
              alert('Failed to register user.');
            }
            console.error('Error creating user:', error);
          });
      };
      

    const backToLogin = () => {
        navigate('/login');
    }
    return(
        <div className='container-signup'>
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
            <div className='signup-content'>
                <Headers label='Sign Up' />
                <form>      
                        <div className="name">
                            <FloatingLabelInput name='fname' id='fname' onChange={handleChange} label='First Name' />
                            <FloatingLabelInput name='lname' id='lname' onChange={handleChange} label='Last Name' />
                        </div>
                        <FloatingLabelInput type='email' name='email' id='email' onChange={handleChange} label='Email' />
                        <FloatingLabelInput name='phoneNum' id='phoneNum' onChange={handleChange} label='Contact Number' />
                        <FloatingLabelInput type='date' name='birthday' id='birthday' onChange={handleChange} label='BirthDay' />   
                        <FloatingLabelInput name='occupation' id='occupation' onChange={handleChange} label='Occupation' />  
                        <div className="show-hide-pass">
                        <FloatingLabelInput
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            id="password"
                            value={userData.password}
                            onChange={handleChange}
                            label="Password"
                            className="flex-grow" // custom class for width control
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="toggle-pass-btn"
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </button>
                        </div>
                       <div className="btn-container">
                            <PrimaryButton type='button' onClick={createNewUser} label='Create User' />
                            <SecondaryButton type='button' label='Back' onClick={() => backToLogin()} />
                       </div>
                </form>
            </div>
        </div>
    )
}