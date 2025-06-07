import {useState} from 'react';
import axios from 'axios';


export function SignUp() {
    const [userData, setUserData] = useState({
        fname: '',
        lname: '',
        email: '',
        phoneNum: 0,
        birthday: '',
        occupation: '',
        password: ''
    });

    console.log(userData)

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
    return(
        <div>
            <div>
                <div>Sign Up</div>
                <form>
                    <div>
                        <input type="text" name="fname" id="fname" placeholder='First Name' onChange={handleChange} required />
                        <input type="text" name="lname" id="lname" placeholder='Last Name' onChange={handleChange} required />
                    </div>
                    <div>
                        <input type="email" name="email" id="email" placeholder='Email' onChange={handleChange} required />
                    </div>
                    <div>
                        <input type="text" name="phoneNum" id="phoneNum" placeholder='Phone Number' onChange={handleChange} required />
                    </div>
                    <div>
                        <input type="date" name="birthday" id="birthday" placeholder='Birthday' onChange={handleChange} required />
                    </div>
                    <div>
                        <input type="text" name="occupation" id="occupation" placeholder='Occupation' onChange={handleChange} required />
                    </div>
                    <div>
                        <input type="password" name="password" id="password" placeholder='Password' onChange={handleChange} required />
                    </div>
                    <div>
                        <button type="button" onClick={createNewUser}>Sign Up</button>
                    </div>
                    <div>
                        <button type="button">Back</button>
                    </div>
                </form>
            </div>
        </div>
    )
}