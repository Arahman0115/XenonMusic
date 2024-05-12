//LyricsDisplay.jsx
import React, { useState } from 'react';

function LyricsDisplay({ lyrics, videoId, songName, artistName, addToLibrary, onLibraryPage, handleAnalyzeClickProp }) {
  const [selectedText, setSelectedText] = useState('');

  // Function to handle highlighting the selected text
  const handleHighlight = () => {
    const highlightedText = document.getElementById('lyrics-text');
    if (highlightedText) {
      highlightedText.innerHTML = highlightedText.innerHTML.replace(
        selectedText,
        `<span style="background-color: red;">${selectedText}</span>`
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
    addToLibrary(videoId, lyrics, songName, artistName);
    console.log('Calling addToLibrary with:', { videoId, lyrics, songName, artistName});
  };
  const renderButtons = !onLibraryPage && (
    <div className="flex ml-60 justify mt-5">
      <button className="highlightbutton px-5 py-2" onClick={handleHighlight}>
        Highlight
      </button>
      <button className="librarybutton px-5 py-2 ml-5" onClick={handleAddToLibraryClick}>
        Add to your Library
      </button>
      
    </div>
  );

  // Check if lyrics is null or undefined
  if (!lyrics) {
    return null; // Return null if lyrics are not available
  }

  return (
    <div className="text-center justify-end flex flex-col px-5 ml-5">
      <h2 className="text-3xl font-bold text-black-500">Lyrics</h2>
      <div className="mx-auto max-w-xl overflow-y-auto max-h-80 mt-[-50px]" onMouseUp={handleTextSelection}>
        <pre id="lyrics-text" className="whitespace-pre-line">{lyrics}</pre>
      </div>
      {/* Highlight and Add to your Library buttons */}
      <div className="flex-start ml-25 mt-5">
      {renderButtons}
      </div>
    </div>
  );
}

export default LyricsDisplay;