import { createContext, useContext, useEffect, useState} from "react";
import axios from 'axios';

const UserContext = createContext(null);

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        try {
            const res = await axios.get('http://localhost:3001/user/me', {withCredentials: true});
            setUser(res.data.user);
        } catch (err) {
            setUser(null);
        }
    }

    const logout = () => {
        axios.post("http://localhost:3001/user/logout", {}, { withCredentials: true });
        setUser(null);
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return(
        <UserContext.Provider value={{ user, setUser, logout }}>
        {children}
      </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext);