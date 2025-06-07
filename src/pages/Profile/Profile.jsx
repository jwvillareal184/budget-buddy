import { useState } from "react";
import { useUser } from "../../context/UserContext";
import {Headers} from '../../components';

export const Profile = () => {
    const {user} = useUser();
    console.log(user)

    return(
        <div>
            <div>
                <Headers label='Profile' />
            </div>
            {user ? (
                <div>
                    <div>{user.fname} {user.lname}</div>
                    <div>{user.birthday}</div>
                    <div>{user.email}</div>
                    <div>{user.occupation}</div>
                    <div>{user.phoneNum}</div>
                </div>
            ) : (
                <div>
                    Loading...
                </div>
            )}
        </div>
    )
}