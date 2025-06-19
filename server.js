const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
}

// Proxy endpoint for lyrics
app.get('/api/lyrics', async (req, res) => {
  try {
    const { title } = req.query;
    
    if (!title) {
      return res.status(400).json({ error: 'Title parameter is required' });
    }

    console.log(`Fetching lyrics for: ${title}`);
    
    const response = await axios.get(`https://lyrics.lewdhutao.my.eu.org/youtube/lyrics?title=${encodeURIComponent(title)}`);
    
    console.log('API response received');
    res.json(response.data);
    
  } catch (error) {
    console.error('Error fetching lyrics:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch lyrics',
      message: error.message 
    });
  }
});

// Serve React app for all other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 