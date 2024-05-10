//App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchForm from './SearchForm';
import LyricsDisplay from './LyricsDisplay';
import VideoPlayer from './VideoPlayer';
import Navbar from './Navbar';
import About from './About';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Library from './Library';
import * as THREE from 'three';
import MainBox from './Mainbox';

function App() {
  const defaultArtist = 'Rick Astley';
  const defaultSong = 'Never Gonna Give You Up';
  const defaultVideoId = 'dQw4w9WgXcQ';
  const [artistName, setArtistName] = useState(defaultArtist);
  const [songName, setSongName] = useState(defaultSong);
  const [videoId, setVideoId] = useState(defaultVideoId);
  const [lyrics, setLyrics] = useState('');
  const [libraryDict, setLibraryDict] = useState(() => {
    //const storedLibrary = localStorage.getItem('library2');
    const storedLibrary = localStorage.getItem('library4');
    return storedLibrary ? JSON.parse(storedLibrary) : {};
  });

  // Fetch lyrics for the default song on mount
  useEffect(() => {
    fetchDefaultLyrics();
  }, []);

  // Update video and lyrics upon search results
 // const handleSearchResults = ({ videoId, lyrics }) => {
 //   setVideoId(videoId);
 //   setLyrics(lyrics);
 // };
 const handleSearchResults = ({ artist, song, lyrics, videoId }) => {
  console.log('handleSearchResults:', artist, song, videoId)
  setArtistName(artist);
  setSongName(song);
  setVideoId(videoId);
  setLibraryDict(prev => ({
    ...prev,
    [videoId]: { lyrics, songName: song, artistName: artist }
  }));
};
  const handleLyricsSubmission = (lyrics) => {
    setLyrics(lyrics);
  };
  // Fetch lyrics for the default song
  const fetchDefaultLyrics = async () => {
    try {
      const response = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(defaultArtist)}/${encodeURIComponent(defaultSong)}`);
      const defaultLyrics = response.data.lyrics;
      setLyrics(defaultLyrics);
    } catch (error) {
      console.error('Error fetching default lyrics:', error);
    }
  };
  useEffect(() => {
    localStorage.setItem('library4', JSON.stringify(libraryDict));
  }, [libraryDict]);
  // Function to add a song and lyrics to the library
  const addToLibrary = (videoId, lyrics, songName, artistName) => {
    console.log('addToLibrary:', videoId, songName, artistName);
    setLibraryDict((prevState) => {
      // Check if the song is already in the library
      if (!prevState[videoId]) {
        return {
          ...prevState,
          [videoId]: { lyrics, songName, artistName }
        };
      }
      // If the song is already in the library, return the previous state
      return prevState;
    });
  };
  return (
    <Router>
      <div className="container mx-auto p-4">
        <Navbar />
        <div>
          <h1 id='xenon-text' className="text-8xl font-bold text-white-500 mb-5">Xenon</h1>
          
        </div>
        <Switch>
          <Route exact path="/">
            <div id="three-container" className="w-1/2 mr-2" />
            <div className="flex">
              <div className="w-1/2 mr-2">
                <VideoPlayer videoId={videoId} />
              </div>
              <div className="w-1/2 ml-2">
                <LyricsDisplay lyrics={lyrics} videoId={videoId} songName={songName} artistName={artistName} addToLibrary={addToLibrary} />
              </div>
              
            </div>
           
            <SearchForm onSearchResults={handleSearchResults} onLyricsSubmission={handleLyricsSubmission} />            <div>
            <MainBox lyrics={songName === defaultSong ? '' : lyrics}
             />            
             </div>
            
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/library">
            <Library libraryDict={libraryDict} />
          </Route>
          {/* Add more routes as needed */}
        </Switch>
        
      </div>
    </Router>
  );
}

export default App;
