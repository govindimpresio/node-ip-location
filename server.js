const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.set('trust proxy', true);

app.get('/api/location', async (req, res) => {
  try {
    // Get IP from request headers or fallback
    const clientIP =
      req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

    // Call IP Geolocation API
    const response = await axios.get(`https://ipapi.co/${clientIP}/json/`);

    console.log(response.data);

    const {
      ip,
      city,
      region,
      country_name,
      latitude,
      longitude,
      org,
    } = response.data;

    res.json({
      ip,
      city,
      region,
      country: country_name,
      latitude,
      longitude,
      isp: org,
      source: 'ipapi',
    });
  } catch (error) {
    console.error('IP Lookup Error:', error.message);
    res.status(500).json({ error: 'Unable to determine location.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
