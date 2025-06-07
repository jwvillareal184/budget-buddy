import axios from 'axios';

const BASE_URL = 'http://localhost:3001/user';

export const fetchUserInfo = async () => {
    const token = localStorage.getItem('token');
   
        const response = await axios.get(`${BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      
     

    return response.data;
}