const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;
const GENIUS_API_TOKEN = 'pLUm9_fBMtV-UsPN0Gd7bvgDG-DsRUZVzk9KiR-wMstI2PW9KweQVUwr8y77WnnS';

app.use(cors());

app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    const response = await axios.get('https://api.genius.com/search', {
      params: { q },
      headers: { Authorization: `Bearer ${GENIUS_API_TOKEN}` },
    });

    // Ensure there is at least one hit
    const hits = response.data.response.hits;
    if (hits.length === 0) {
      return res.json({ lyrics: 'Lyrics not found' });
    }

    // Extract the lyrics URL from the first hit
    const lyricsUrl = hits[0].result.url;

    // Fetch lyrics page and parse the content
    const lyricsPage = await axios.get(lyricsUrl);
    const $ = cheerio.load(lyricsPage.data);
    const lyrics = $('[class^="Lyrics__Root"]').text().trim() || 'Lyrics not found';

    // Send the extracted lyrics back to the client
    res.json({ lyrics });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Error retrieving lyrics' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});

//pLUm9_fBMtV-UsPN0Gd7bvgDG-DsRUZVzk9KiR-wMstI2PW9KweQVUwr8y77WnnS