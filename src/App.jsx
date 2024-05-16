//App.jsx
// Copilot: focus on LyricsDisplay.jsx 
import { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, } from '@react-three/drei';
import { MeshBasicMaterial } from 'three';


import axios from 'axios';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import SearchForm from './SearchForm';
import LyricsDisplay from './LyricsDisplay';
import VideoPlayer from './VideoPlayer';
import Navbar from './Navbar';
import About from './About';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Library from './Library';
import * as THREE from 'three';
import MainBox from './Mainbox';

function App() {
  const defaultArtist = 'Rick Astley';
  const defaultSong = 'Never Gonna Give You Up';
  const defaultUri = '4PTG3Z6ehGkBFwjybzWkR8';
  const defaultVideoId = 'dQw4w9WgXcQ';
  const [artistName, setArtistName] = useState(defaultArtist);
  const [songName, setSongName] = useState(defaultSong);
  const [videoId, setVideoId] = useState(defaultVideoId);
  const [mainBoxContent, setMainBoxContent] = useState('');
  const [lyrics, setLyrics] = useState('');
  const[selectedText, setSelectedText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [trackUri, settrackUri] = useState(defaultUri);
  const [libraryDict, setLibraryDict] = useState(() => {
    //const storedLibrary = localStorage.getItem('library2');
    const storedLibrary = localStorage.getItem('library6');
    return storedLibrary ? JSON.parse(storedLibrary) : {};
  });
  document.body.className = 'theme-default'

  useEffect(() => {
    fetchDefaultLyrics();
  }, []);


  // Update video and lyrics upon search results
 // const handleSearchResults = ({ videoId, lyrics }) => {
 //   setVideoId(videoId);
 //   setLyrics(lyrics);
 // };

 const handleSearchResults = ({ artist, song, lyrics, videoId, trackUri }) => {
  console.log('handleSearchResults:', artist, song, videoId)
  setArtistName(artist);
  setMainBoxContent(mainBoxContent);
  setSongName(song);
  setVideoId(videoId);
  settrackUri(trackUri);
  console.log('trackUri:', trackUri);
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
  function handleMouseUp() {
    const text = window.getSelection().toString();
    setSelectedText(text);
}
useEffect(() => {
  const handleThemeChange = (event) => {
    document.body.className = event.target.value;
    console.log('Theme Changed to:', event.target.value);
  };

  const themeSelector = document.getElementById('themeSelector');
  
  if (themeSelector) {
    themeSelector.addEventListener('change', handleThemeChange);
  } else {
    console.log('themeSelector not found');
  }

  return () => {
    if (themeSelector) {
      themeSelector.removeEventListener('change', handleThemeChange);
    }
  };
}, []); 
  useEffect(() => {
    localStorage.setItem('library6', JSON.stringify(libraryDict));
  }, [libraryDict]);
  // Function to add a song and lyrics to the library
  const addToLibrary = (videoId, lyrics, songName, artistName) => {
    setLibraryDict((prevState) => {
      // Check if the song is already in the library
      if (!prevState[videoId]) {
        console.log(mainBoxContent)
        return {
          ...prevState,
          [videoId]: { lyrics, songName, artistName, mainBoxContent }
        };
      }
      //67918
      // If the song is already in the library, return the previous state
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

      <div className="container mx-auto p-4">
        

        <Switch>

          <Route exact path="/">
          <div>
          <div>
          <Navbar />


          </div>
            </div>
            <div>          
            
            <div>
            <select id="themeSelector" className='bg-black-500'>
                <option value="theme-default">Default</option>
                <option value="theme-spotify">Spotify</option>
              </select>
            </div> 
          </div>
          
            <div id="three-container" className="w-1/2 mr-2" />
            <div className="flex">
              <div className="appvideoplayer w-1/2 mr-2">
                <VideoPlayer videoId={videoId} track = {trackUri} />
              </div>
              <div className="applyricsdisplay w-1/2 ml-10 flex flex-row ">
                <LyricsDisplay lyrics={lyrics} videoId={videoId} songName={songName} artistName={artistName} mainBoxContent={mainBoxContent} addToLibrary={addToLibrary} />
                <div>
                  <button className="librarybutton px-15 py-23 ml-5 mt-60" onClick={handleMouseUp}>
                  Analyze
  </button>
            </div>
          </div>
          
        </div>
       
        
        <SearchForm chatHistory={chatHistory} onSearchResults={handleSearchResults} onLyricsSubmission={handleLyricsSubmission} />            <div>
        <div className='overflow-auto h-[600px]'> 
        <MainBox setMainBoxContent={setMainBoxContent} onChatHistoryChange={setChatHistory} selectedText={selectedText} lyrics={songName === defaultSong ? '' : lyrics}
         />   

        </div>
                
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
      {/* Add more routes as needed */}
    </Switch>
    
  </div>
    </Router>
  );
}

export default App;