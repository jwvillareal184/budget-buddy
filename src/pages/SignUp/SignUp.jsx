import {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { FloatingLabelInput, PrimaryButton, SecondaryButton, Headers } from '../../components';
import './SignUp.css';

export function SignUp() {
    const navigate = useNavigate();
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
            console.log(userData);
            axios.post('http://localhost:3001/user/register', userData).then(response => {
            console.log('User Created', response.data)
            alert('User data registered sucessfully!');
        })
        .catch(error => {
            console.log('User Created', userData)
            console.error('Error creating user:',error);
            alert('Failed to register the user.');
        })
    }

    const backToLogin = () => {
        navigate('/login');
    }
    return(
        <div className='container-signup'>
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
                        <FloatingLabelInput type='password' name='password' id='password' onChange={handleChange} label='Password' />  
                       <div className="btn-container">
                            <PrimaryButton type='button' onClick={createNewUser} label='Create User' />
                            <SecondaryButton type='button' label='Back' onClick={() => backToLogin()} />
                       </div>
                </form>
            </div>
        </div>
    )
}