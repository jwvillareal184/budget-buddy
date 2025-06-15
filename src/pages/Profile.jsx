import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { Headers, FloatingLabelInput, PrimaryButton, SecondaryButton } from '../components';
import { updateUserInfo, deleteUserInfo } from "../services/UserServices";
import '../styles/styles.module.css';


export const Profile = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    birthday: '',
    occupation: '',
    phoneNum: '',
    fname: '',
    lname: '',
    email: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        birthday: user.birthday || '',
        occupation: user.occupation || '',
        phoneNum: user.phoneNum || '',
        fname: user.fname || '',
        lname: user.lname || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 🔄 Start loading
    try {
      await updateUserInfo(user._id, {
        birthday: formData.birthday,
        occupation: formData.occupation,
        phoneNum: formData.phoneNum
      });
  
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      console.log(user._id)
      await deleteUserInfo(user._id);
    }
  };
  
  
  if (!user) return <div>Loading...</div>;

  return (
    <div className="Profile">
        <div className="profile-content">
        <Headers label="Profile" />
        <form onSubmit={handleSubmit}>

            <FloatingLabelInput
            label="First Name"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
            readOnly
            />

            <FloatingLabelInput
            label="Last Name"
            name="lname"
            value={formData.lname}
            onChange={handleChange}
            readOnly
            />

            <FloatingLabelInput
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            readOnly
            />

            <FloatingLabelInput
            label="Birthday"
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            />

            <FloatingLabelInput
            label="Occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            />

            <FloatingLabelInput
            label="Phone Number"
            name="phoneNum"
            value={formData.phoneNum}
            onChange={handleChange}
            />

            <div className="btn-container">
            <PrimaryButton type="submit" label={loading ? 'Updating...' : 'Update Profile'} disabled={loading} />
            <SecondaryButton type="button" label="Delete Profile" onClick={handleDelete} />
            </div>
        </form>
        </div>

 

    </div>
  );
};
