const axios = require('axios');

exports.handler = async function(event, context) {
  const clientId = process.env.VITE_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.VITE_SPOTIFY_CLIENT_SECRET;
  const tokenUrl = 'https://accounts.spotify.com/api/token';

  const tokenResponse = await getSpotifyToken(clientId, clientSecret, tokenUrl);
  if (tokenResponse.error) {
    console.error('Spotify token error:', tokenResponse.error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve Spotify token' })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ token: tokenResponse.access_token })
  };
};

async function getSpotifyToken(clientId, clientSecret, tokenUrl) {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  try {
    const response = await axios.post(tokenUrl, 'grant_type=client_credentials', {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Spotify token:', error);
    return { error: error.message };
  }
};