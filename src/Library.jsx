import React, { useEffect, useState } from 'react';
import VideoPlayer from './VideoPlayer';
import LyricsDisplay from './LyricsDisplay';
import MainBox from './Mainbox';
import MainBoxContentDisplay from './MainBoxContentDisplay';
import arrowright from './assets/arrow-right.png';
import arrowdown from './assets/arrow-down.png';

const Library = ({ onLibraryPage }) => {
  const [libraryDict, setLibraryDict] = useState({});
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (videoId) => {
    setExpanded(prev => ({ ...prev, [videoId]: !prev[videoId] }));
  };
  const removeEntry = (videoId) => {
    const storedLibrary = localStorage.getItem('library6');
    if (storedLibrary) {
      try {
        const parsedLibrary = JSON.parse(storedLibrary);
        delete parsedLibrary[videoId];
        localStorage.setItem('library6', JSON.stringify(parsedLibrary));
        setLibraryDict(parsedLibrary);
      } catch (error) {
        console.error('Error parsing library from localStorage:', error);
      }
    }
  };

  onLibraryPage = true;
  const renderRemoveButton = (videoId) => {
    return (
      <button className='removeentrybutton ml-20 mt-5' onClick={() => removeEntry(videoId)}> Remove</button>
    );
  
  }

  useEffect(() => {
    // Retrieve libraryDict from localStorage on component mount
    const storedLibrary = localStorage.getItem('library6');

    if (storedLibrary) {
      try {
        const parsedLibrary = JSON.parse(storedLibrary);
        setLibraryDict(parsedLibrary);
      } catch (error) {
        console.error('Error parsing library from localStorage:', error);
      }
    }
  }, []);


  // Render VideoPlayer and LyricsDisplay for each key-value pair in the dictionary
  const libraryEntries = Object.entries(libraryDict);

  return (
    <div className="max-w-8xl mt-5">
      <div className=' ml-50'>
        <h2 className="text-4xl font-bold text-white-500 text-center justify-end mb-10">Library</h2>
      </div>
      <div className="text-white h-10 w-350 p-4 rounded-2xl"></div>
  
      {(Object.keys(libraryDict).length === 0) ? (
        <p className='text-2xl font-bold text-white-500 text-center'>Start Adding Music to the Library!</p>
      ) : (

        libraryEntries.map(([videoId, { lyrics, songName, artistName, mainBoxContent }]) => (
          <div key={videoId} className="songcont flex mt-1 w-50 bg-yellow-500 border-rounded">
            <div className='songcont2 mr-5 ml-10 border-rounded ' >
              <h3 className=' mr-15 songname border-rounded' onClick={() => toggleExpand(videoId)}>
                <div className='mr-5 mt-3px-[-15]' style={{display: 'flex', alignItems: 'center'}}>
                  <img className='mr-5 mt-3' src={expanded[videoId] ? arrowdown : arrowright} />
                  {songName && artistName ? `${songName} - ${artistName}` : null}
                </div>
              </h3>
              {expanded[videoId] && (
                <div className="entry-content mr-20 w-200">
                  <div className='mr-1 ml-10 w-300'>
                    <LyricsDisplay lyrics={lyrics} videoId={videoId} onLibraryPage={true} />
                  </div>
                  <div className="vidplayerdiv  ml-5 mr-15 d-flex justify-center align-center ml-40 mb-10 px-55 mr-5">
                    <VideoPlayer className='video-player ml-1 mb-10 flex flex-col' videoId={videoId} />
                  </div>
              <div className='w-200'> 
              <p className='chathistorytext text-3xl text-center font-bold mb-5 underline underline-offset-7'>
              Chat History 
              </p>
              <p className='border rounded-md mb-10 text-center font-bold text-justify'>
   
              <div className='ml-5 mr-5 mt-5 overflow-auto h-[400px]'>
              <MainBoxContentDisplay content={mainBoxContent} />

              </div>
              </p>              
              </div>
                </div>
              )}
            </div>
            {!expanded[videoId] ? renderRemoveButton(videoId) : null}        
          </div>
        ))
      )}
    </div>
  )};
export default Library;