import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './index.css';

function SearchForm({ onSearchResults, onLibraryPage, onLyricsSubmission, onTrackSelection, setHasSelectedTrack }) {
  const [artist, setArtist] = useState('');
  const [song, setSong] = useState('');
  const [tracks, setTracks] = useState([]);
  const [selectedTrackUri, setSelectedTrackUri] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const songInputRef = useRef(null);
  const artistInputRef = useRef(null);

  const clear = () => {
    setArtist('');
    setSong('');
    const button1 = document.getElementById('clear-button');
    button1.classList.add('explosion');

    setTimeout(() => {
      button1.classList.remove('explosion');
    }, 500);
  };

  const handleTrackSelection = (uri) => {
    setSelectedTrackUri(uri);
    setHasSelectedTrack(true);
    setTracks([]); // This will hide the track list
    onTrackSelection(uri); // Call the onTrackSelection function passed from App component
  };
  
  useEffect(() => {
    const fetchSpotifyToken = async () => {
      const tokenData = localStorage.getItem('spotifyTokenData');
      const now = new Date();
  
      if (tokenData) {
        const { token, timestamp } = JSON.parse(tokenData);
        const tokenAge = now.getTime() - timestamp;
  
        if (tokenAge < 3600000) { // Less than one hour
          setToken(token);
          return;
        }
      }
  
      try {
        // Change URL as per your Netlify function's endpoint
        const response = await axios.get('/.netlify/functions/refreshSpotifyToken');
        if (response.data && response.data.token) {
          localStorage.setItem('spotifyTokenData', JSON.stringify({
            token: response.data.token,
            timestamp: now.getTime()
          }));
          setToken(response.data.token);
        }
      } catch (error) {
        console.error('Error fetching Spotify token:', error);
      }
    };
  
    // Immediate fetch on mount
    fetchSpotifyToken();
  
    // Set up interval to refresh token every hour
    const intervalId = setInterval(fetchSpotifyToken, 3600000); // 3600000 ms = 1 hour
  
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);


  const handleSearch = async () => {
    const song = songInputRef.current ? songInputRef.current.value : '';
    const artist = artistInputRef.current ? artistInputRef.current.value : '';

    if (!song || !artist) {
        console.log('Both artist and song are required');
        setLoading(false);  // Stop loading when inputs are empty
        onSearchResults({ artist, lyrics: 'Whoops! Did you forget to type something?' });
        return;
    }
    setLoading(true);  // Start loading
    setHasSelectedTrack(false);

    try {
        if (!token) {
            console.log('Spotify token not available');
            setLoading(false);  // Stop loading if token is not available
            return;
        }

        // Fetch lyrics from Lyrics.ovh
        const lyricsRes = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`);
        const lyrics = lyricsRes.data.lyrics ? lyricsRes.data.lyrics : 'Lyrics not found';
        onLyricsSubmission(lyrics);
        const button = document.getElementById('explosion-button');
        button.classList.add('explosion');

        setTimeout(() => {
            button.classList.remove('explosion');
        }, 500);

        // Fetch tracks from Spotify
        const response = await axios.get('https://api.spotify.com/v1/search', {
            params: { q: `${artist} ${song}`, type: 'track', limit: 5 },
            headers: { Authorization: `Bearer ${token}` },
        });

        setTracks(response.data.tracks.items);
        setLoading(false);

        // Ensure the first track URI is set initially
        if (response.data.tracks.items.length > 0) {
            setSelectedTrackUri(response.data.tracks.items[0].uri.replace('spotify:track:', ''));
        }

        // Fetch video from YouTube
        const youtubeRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                q: `${artist} ${song}`,
                key: import.meta.env.VITE_KEY,
                part: 'snippet',
                type: 'video',
                maxResults: 1,
            },
        });

        const youtubeItems = youtubeRes.data.items;
        const videoId = youtubeItems.length ? youtubeItems[0].id.videoId : '';

        // Pass the fetched data to the parent component's state
        onSearchResults({ artist, song, lyrics, videoId, trackUri: selectedTrackUri });

    } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);  // Stop loading on error
        onSearchResults({ artist, lyrics: 'Whoops! Did you forget to type something?' });
    }
};

return (
  <div className='searchfield ml-5 flex flex-col mb-10'>
      {!onLibraryPage && (
          <>
              <div>
                  <input
                      className='artistinput px-5 mr-10 border-2 bg-white-500 rounded-md text-center border-white-500 h-8'
                      type="text"
                      value={artist}
                      onChange={(e) => setArtist(e.target.value)}
                      placeholder="Enter artist"
                      ref={artistInputRef}
                  />
                  <input
                      className='songinput px-5 mr-10 mt-5 h-8 border-2 rounded-md text-center border-white-500'
                      type="text"
                      value={song}
                      onChange={(e) => setSong(e.target.value)}
                      placeholder="Enter song name"
                      ref={songInputRef}
                  />
              </div>
              <div className="flex justify-center mb-5 px-5 justify mt-5 h-8">
                  <button id='explosion-button' onClick={handleSearch} disabled={loading}>Search</button>
                  <button id='clear-button' onClick={clear}>Clear</button>
                  {loading && (
                      <div className="loading-spinner"></div>
                  )}
              </div>
          </>
      )}
      {tracks.length > 0 && (
          <div className="selection-box rounded-2xl px-5 mt-5">
              <h2 className='mb-5'>Top Results</h2>
              {tracks.map((track, index) => (
                  <div 
                      key={index} 
                      className="track-item"
                      onClick={() => handleTrackSelection(track.uri.replace('spotify:track:', ''))}
                  >
                      <div className="track-name">{track.name}</div>
                      <div className="track-artist">by {track.artists[0].name}</div>
                  </div>
              ))}
          </div>
      )}
  </div>
);


}

export default SearchForm;
