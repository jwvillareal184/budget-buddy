import axios from 'axios';

const BASE_URL = `${process.env.BACKEND_URL}user`;

export const fetchUserInfo = async () => {
    const token = localStorage.getItem('token');
   
        const response = await axios.get(`${BASE_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
    return response.data;
}

export const updateUserInfo = async (userId, data) => {
  try {
    const token = localStorage.getItem('token');
    await axios.put(`${BASE_URL}/users/${userId}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("Profile updated!");
  } catch (err) {
    console.error("Update failed:", err);
  }
};

export const deleteUserInfo = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${BASE_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("User deleted successfully!");
    // Optional: clear token & redirect if needed
    localStorage.removeItem('token');
    window.location.href = '/login'; // or to your login page
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Failed to delete user.");
  }
};
