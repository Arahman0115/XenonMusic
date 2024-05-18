import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();

app.use(cors());

app.get('/lyrics', async (req, res) => {
  const { artist, song } = req.query;

  try {
    const response = await axios.get(`https://api.musixmatch.com/ws/1.1/matcher.lyrics.get`, {
      params: {
        q_track: song,
        q_artist: artist,
        apikey: '5ddb5818e2a391f2287eff55a3dad1f0',
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching lyrics' });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));