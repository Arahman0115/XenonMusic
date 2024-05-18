import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import SearchForm from './SearchForm';
import LyricsDisplay from './LyricsDisplay';
import VideoPlayer from './VideoPlayer';
import Navbar from './Navbar';
import About from './About';
import Library from './Library';
import MainBox from './Mainbox';
import ThemeSelector from './ThemeSelector'; 

function App() {
  const defaultArtist = 'Rick Astley';
  const defaultSong = 'Never Gonna Give You Up';
  const defaultUri = '4PTG3Z6ehGkBFwjybzWkR8';
  const defaultVideoId = 'dQw4w9WgXcQ';
  const [artistName, setArtistName] = useState(defaultArtist);
  const [songName, setSongName] = useState(defaultSong);
  const [videoId, setVideoId] = useState(defaultVideoId);
  const [mainBoxContent, setMainBoxContent] = useState([]);
  const [lyrics, setLyrics] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [trackUri, settrackUri] = useState(defaultUri);
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = import.meta.env.VITE_SPOTIFY_TOKEN;
  const [hasSelectedTrack, setHasSelectedTrack] = useState(false);

  const spotifyPlayerClassName = 'spotify-player-class-name';

  const [libraryDict, setLibraryDict] = useState(() => {
    const storedLibrary = localStorage.getItem('library7');
    return storedLibrary ? JSON.parse(storedLibrary) : {};
  });
  document.body.className = 'theme-default';

  useEffect(() => {
    fetchDefaultLyrics();
  }, []);

  const handleTrackSelection = (trackUri) => {
    settrackUri(trackUri);
    setHasSelectedTrack(true);
  };

  const handleSearchResults = ({ artist, song, lyrics, videoId, trackUri }) => {
    console.log('handleSearchResults:', artist, song, videoId, trackUri);
    setArtistName(artist);
    setSongName(song);
    setLyrics(lyrics);
    setVideoId(videoId);
    settrackUri(trackUri);
    setIsLoading(false);
    console.log('trackUri:', trackUri);
  };

  const handleLyricsSubmission = (lyrics) => {
    setLyrics(lyrics);
  };

  const fetchDefaultLyrics = async () => {
    if (lyrics === '') {
      try {
        const response = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(defaultArtist)}/${encodeURIComponent(defaultSong)}`);
        const defaultLyrics = response.data.lyrics;
        setLyrics(defaultLyrics);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleMouseUp = () => {
    const text = window.getSelection().toString();
    setSelectedText(text);
  };

  useEffect(() => {
    // Function to handle theme change
    const handleThemeChange = (event) => {
      const selectedTheme = event.target.value;
      document.body.className = selectedTheme;
      localStorage.setItem('selectedTheme', selectedTheme); // Save the selected theme to localStorage
      console.log('Theme Changed to:', selectedTheme);
    };

    // Get theme selector element
    const themeSelector = document.getElementById('themeSelector');

    // Attach event listener if theme selector exists
    if (themeSelector) {
      themeSelector.addEventListener('change', handleThemeChange);
    } else {
      console.log('themeSelector not found');
    }

    // Apply the saved theme from localStorage on component mount
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
      document.body.className = savedTheme;
      if (themeSelector) {
        themeSelector.value = savedTheme;
      }
    }

    // Cleanup event listener on component unmount
    return () => {
      if (themeSelector) {
        themeSelector.removeEventListener('change', handleThemeChange);
      }
    };
  }, []);

  useEffect(() => {
    console.log('Saving libraryDict to localStorage:', libraryDict);
    localStorage.setItem('library7', JSON.stringify(libraryDict));
  }, [libraryDict]);

  const addToLibrary = (videoId, lyrics, songName, artistName, trackUri, mainBoxContent) => {
    setLibraryDict((prevState) => {
      if (!prevState[videoId]) {
        const newState = {
          ...prevState,
          [videoId]: { lyrics, songName, artistName, mainBoxContent, trackUri }
        };
        console.log('New state after adding to library:', newState);
        return newState;
      }
      return prevState;
    });
  };

  return (
    <Router>
      <h1 id='xenon-text' className="text-8xl font-bold text-white-500 mb-5">Xenon</h1>
      {!isLoggedIn && <Redirect to="/homepage" />} {/* Redirect to homepage page if not logged in */}
      <Route path="/homepage">
        <HomePage setIsLoggedIn={setIsLoggedIn} /> {/* Pass setIsLoggedIn to HomePage */}
      </Route>
      <Route path="/login">
        <LoginPage setIsLoggedIn={setIsLoggedIn} /> {/* Pass setIsLoggedIn to LoginPage */}
      </Route>
      <ThemeSelector className='ml-5' />
      <div className="container mx-auto p-4 bg-none">
        <Switch>
          <Route exact path="/">
            <div>
              <Navbar />
 
            </div>
            <div className="flex flex-col items-center ">
              <SearchForm 
                chatHistory={chatHistory} 
                onTrackSelection={handleTrackSelection} 
                onSearchResults={handleSearchResults} 
                onLyricsSubmission={handleLyricsSubmission} 
                setHasSelectedTrack={setHasSelectedTrack}
              />
              <div className="flex w-full justify-between mt-5 mb-10">
                <div className="appvideoplayer w-1/2 mr-2">
                  <VideoPlayer 
                  videoId={videoId} 
                  track={trackUri} 
                  accessToken={accessToken} 
                  className={spotifyPlayerClassName}
                 />
                </div>
                <div className="applyricsdisplay w-1/2 ml-2">
                  <LyricsDisplay 
                    lyrics={lyrics} 
                    trackUri={trackUri} 
                    videoId={videoId} 
                    songName={songName} 
                    artistName={artistName} 
                    mainBoxContent={mainBoxContent} 
                    addToLibrary={addToLibrary} 
                  />
                </div>
              </div>
            </div>
            <div className='overflow-auto h-[800px] py-5 px-10 mt-5'>
            <h2 className='ml-10 text-center mb-5 mt-20'> Lyrics Interpreter GPT</h2>
              <MainBox 
              hasSelectedTrack={hasSelectedTrack}
              setMainBoxContent={setMainBoxContent} 
              onChatHistoryChange={setChatHistory} 
              selectedText={selectedText} 
              lyrics={songName === defaultSong ? '' : lyrics} 
              />
            </div>
          </Route>
          <Route path="/about">
            <div className='mt-10'>
              <Navbar />
              <About />
            </div>
          </Route>
          <Route path="/library">
            <Navbar />
            <Library libraryDict={libraryDict} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
