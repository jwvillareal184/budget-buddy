export const getLocationDetails = async (lat, lon) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
      const data = await res.json();
      return data.address.country; // or data.display_name
    } catch (err) {
      console.error('Reverse geocoding failed:', err);
      return 'Unknown location';
    }
  };
  