import React, { useState, useEffect } from 'react';
import './LyricsDisplay.css';

function LyricsDisplay({ lyrics, videoId, songName, artistName, trackUri, mainBoxContent, addToLibrary, onLibraryPage, handleAnalyzeClickProp }) {
  const [selectedText, setSelectedText] = useState('');
  const [lines, setLines] = useState([]);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (lyrics) {
      const linesArray = lyrics.split('\n').map((line, index) => ({
        text: line,
        delay: index * 0.9, // Staggered delay
      }));
      setLines(linesArray);
      setAnimationKey(prevKey => prevKey + 1); // Increment the key to restart animations
    }
  }, [lyrics]);

  // Function to handle highlighting the selected text
  const handleHighlight = () => {
    const highlightedText = document.getElementById('lyrics-text');
    if (highlightedText) {
      highlightedText.innerHTML = highlightedText.innerHTML.replace(
        selectedText,
        `<span style="background-color: yellow; font-weight: bold;">${selectedText}</span>`
      );
    }
  };

  const handleAnalyzeClick = () => {
    handleAnalyzeClickProp(selectedText);
  };

  // Function to handle text selection
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setSelectedText(selection.toString());
      console.log('Selected text:', selectedText);
    } else {
      setSelectedText('');
    }
  };

  // Handle adding to the library using the provided prop function
  const handleAddToLibraryClick = () => {
    addToLibrary(videoId, lyrics, songName, artistName, trackUri, mainBoxContent);
    console.log('Calling addToLibrary with:', { videoId, lyrics, songName, artistName, trackUri, mainBoxContent });
  };

  const renderButtons = !onLibraryPage && (
    <div className="flex justify-center mt-5">
      <button className="highlight-button px-5 py-2 mx-2" onClick={handleHighlight}>
        Highlight
      </button>
      <button className="library-button px-5 py-2 mx-2" onClick={handleAddToLibraryClick}>
        Add to your Library
      </button>
     
    </div>
  );

  // Check if lyrics is null or undefined
  if (!lyrics) {
    return null; // Return null if lyrics are not available
  }

  return (
    <div className="lyrics-display text-center flex flex-col px-5 py-5 mx-5 rounded-lg shadow-lg text-white">
      <h2 className="text-4xl font-bold mb-5">Lyrics</h2>
      <div className="lyrics-container mx-auto max-w-xl overflow-y-auto max-h-80 p-4 bg-white text-black rounded-lg shadow-inner" onMouseUp={handleTextSelection}>
        {lines.map((line, index) => (
          <p 
            key={`${animationKey}-${index}`} // Unique key for each line to restart animation
            className="lyrics-line"
            style={{ '--delay': `${line.delay}s` }} // Stagger the animation delay
          >
            {line.text}
          </p>
        ))}
      </div>
      {renderButtons}
    </div>
  );
}

export default LyricsDisplay;
