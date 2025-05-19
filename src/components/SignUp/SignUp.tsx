import {useState} from 'react';
import axios from 'axios';

interface User {
    fname: string;
    lname: string;
    email: string;
    phoneNum: number;
    birthday: Date;
    occupation: string;
    password: string;

}
export function SignUp() {
    const [userData, setUserData] = useState<User>();

    const createNewUser = () => {
    
        axios.get('http://localhost:3001/users', userData).then(response => {
            console.log(response)
        })
        .catch(error => {
            console.log(error)
        })
    }
    return(
        <div>
            <div>
                <div>Sign Up</div>
                <form>
                    <div>
                        <input type="text" name="fname" id="fname" required />
                        <input type="text" name="lname" id="lname" required />
                    </div>
                    <div>
                        <input type="email" name="email" id="email" required />
                    </div>
                    <div>
                        <input type="text" name="phoneNum" id="phoneNum" required />
                    </div>
                    <div>
                        <input type="date" name="birthday" id="birthday" required />
                    </div>
                    <div>
                        <input type="text" name="occupation" id="occupation" required />
                    </div>
                    <div>
                        <input type="password" name="password" id="password" required />
                    </div>
                    <div>
                        <button type="button">Sign Up</button>
                    </div>
                    <div>
                        <button type="button">Back</button>
                    </div>
                </form>
            </div>
        </div>
    )
}