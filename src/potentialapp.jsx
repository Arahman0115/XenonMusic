import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import About from './About';
import Library from './Library';
import MainBox from './Mainbox';
import LyricsDisplay from './LyricsDisplay';
import VideoPlayer from './VideoPlayer';
import SearchForm from './SearchForm';
import './App.css'; // Importing the main CSS file for styles

function App() {
  const defaultArtist = 'Rick Astley';
  const defaultSong = 'Never Gonna Give You Up';
  const defaultVideoId = 'dQw4w9WgXcQ';
  const [artistName, setArtistName] = useState(defaultArtist);
  const [songName, setSongName] = useState(defaultSong);
  const [videoId, setVideoId] = useState(defaultVideoId);
  const [lyrics, setLyrics] = useState('');
  const [mainBoxContent, setMainBoxContent] = useState('');
  const [libraryDict, setLibraryDict] = useState(() => {
    const storedLibrary = localStorage.getItem('library6');
    return storedLibrary ? JSON.parse(storedLibrary) : {};
  });

  useEffect(() => {
    const fetchDefaultLyrics = async () => {
      try {
        const response = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(defaultArtist)}/${encodeURIComponent(defaultSong)}`);
        setLyrics(response.data.lyrics);
      } catch (error) {
        console.error('Error fetching default lyrics:', error);
      }
    };
    fetchDefaultLyrics();
  }, []);

  const addToLibrary = (videoId, lyrics, songName, artistName) => {
    setLibraryDict((prevState) => ({
      ...prevState,
      [videoId]: { lyrics, songName, artistName, mainBoxContent }
    }));
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <h1 className="app-title">Xenon</h1>
        <Switch>
          <Route exact path="/">
            <div className="home-layout">
              <VideoPlayer videoId={videoId} />
              <LyricsDisplay lyrics={lyrics} videoId={videoId} songName={songName} artistName={artistName} addToLibrary={addToLibrary} />
              <SearchForm onSearchResults={(results) => {
                setArtistName(results.artist);
                setSongName(results.song);
                setVideoId(results.videoId);
                setLyrics(results.lyrics);
              }} />
              <MainBox mainBoxContent={mainBoxContent} setMainBoxContent={setMainBoxContent} />
            </div>
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/library">
            <Library libraryDict={libraryDict} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
