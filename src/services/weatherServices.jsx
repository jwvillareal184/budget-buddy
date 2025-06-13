import axios from 'axios';

export const weatherServices = async () => {
  return new Promise((resolve, reject) => {
    // Step 1: Get user's geolocation
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Step 2: Send lat/lon to your backend
          const response = await axios.get(`http://localhost:3001/weather/forecast`, {
            params: { lat: latitude, lon: longitude }
          });
          resolve(response.data);
        } catch (error) {
          console.error('Failed to fetch weather from server:', error);
          reject(error);
        }
      },
      (error) => {
        console.error('Geolocation error:', error.message);
        reject(error);
      }
    );
  });
};
