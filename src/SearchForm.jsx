import { useState, useRef } from 'react';
import axios from 'axios';
import './index.css'

function SearchForm({ onSearchResults, onLibraryPage, onLyricsSubmission }) {
  const [artist, setArtist] = useState('');
  const [song, setSong] = useState('');
  const youtubeApiKey = process.env.REACT_APP_YOUTUBE_API_KEY;

  const songInputRef = useRef(null);
  const artistInputRef = useRef(null);
  const clear = () => {
    setArtist('')
    setSong('')
    var button1 = document.getElementById('clear-button');
      button1.classList.add('explosion');

      setTimeout(function() {
        button1.classList.remove('explosion');
      }, 500);
  }
  const handleSearch = async () => {
    try {
      // Fetch lyrics from the Lyrics.ovh API
     
      const song = songInputRef.current ? songInputRef.current.value : '';
      const artist = artistInputRef.current ? artistInputRef.current.value : '';

      if (!song || !artist) {
        console.log('Both artist and song are required');
        return;
      }
      console.log('song', song);

      const lyricsRes = await axios.get(`https://api.lyrics.ovh/v1/${artist}/${song}`);
  
      // Access the `lyrics` property directly
      const lyrics = lyricsRes.data ? lyricsRes.data.lyrics : 'Lyrics not found';
      onLyricsSubmission(lyrics);
      var button = document.getElementById('explosion-button');
      button.classList.add('explosion');

      setTimeout(function() {
        button.classList.remove('explosion');
      }, 500);
  
      // Fetch video information directly from YouTube API
      const youtubeRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          q: `${artist} ${song}`,
          key: youtubeApiKey,
          part: 'snippet',
          type: 'video',
          maxResults: 1,
        },
      });
  
      const youtubeItems = youtubeRes.data.items;
      const videoId = youtubeItems.length ? youtubeItems[0].id.videoId : '';
  
      // Pass the fetched data to the parent component's state
      onSearchResults({ artist, song, lyrics, videoId });
 
    } catch (error) {
      console.error('Error fetching data:', error);
      onSearchResults({ artist, lyrics: 'Whoops! Did you forget to type something?' });    }

  };
  const renderButtons = !onLibraryPage && (
    <div className="flex ml-10 mb-5 px-5 justify mt-5 h-8">
    <button id='explosion-button' onClick={handleSearch}>Search</button>
    <button id='clear-button' onClick={clear}>Clear</button>
    </div>
  );
  const renderInputs = !onLibraryPage && (
    <div> 
    <input
    className='px-5 mr-10 border-2 bg-white-500 rounded-md text-center border-white-500 h-8 '
    type="text"
    value={artist}
    onChange={(e) => setArtist(e.target.value)}
    placeholder="Enter artist"
    ref={artistInputRef}
  />
  <input
    className='px-5 mr-10 mt-5 h-8 border-2 rounded-md text-center border-white-500 '
    type="text"
    value={song}
    onChange={(e) => setSong(e.target.value)}
    placeholder="Enter song name"
    ref={songInputRef}
  /></div>
  );
  
  
  return (
    <div className='searchfield ml-5 flex justify-left mb-10'>
      {renderInputs}
      {renderButtons}
    </div>
  );
}

export default SearchForm;

function LyricsDisplay({ lyrics }) {
  return (
    <div>
      <h2>Lyrics</h2>
      
      <pre>{lyrics}</pre>
    </div>
  );
}

