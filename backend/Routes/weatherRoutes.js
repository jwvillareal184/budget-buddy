const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/forecast', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Missing latitude or longitude' });
  }

  try {
    const response = await axios.get('https://api.tomorrow.io/v4/weather/forecast', {
      params: {
        location: `${lat},${lon}`,
        apikey: '3cH3RGH7V0oP74xzdVYPCAg2uM0B2xnt',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});


module.exports = router;
