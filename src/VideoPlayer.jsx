import React, { useState, useEffect, useRef } from 'react';

const VideoPlayer = ({ videoId, track, className, onBgColorChange }) => {
  const [embedUrl, setEmbedUrl] = useState(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (track) {
      setEmbedUrl(`https://open.spotify.com/embed/track/${track}`);
    } else {
      setEmbedUrl(null);
    }
  }, [track]);

  useEffect(() => {
    const fetchSpotifyBgColor = () => {
      try {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
          const message = {
            type: 'GET_SPOTIFY_BG_COLOR'
          };
          iframe.contentWindow.postMessage(message, '*');
        }
      } catch (error) {
        console.error('Error accessing iframe content:', error);
      }
    };

    const handleMessage = (event) => {
      if (event.data.type === 'SPOTIFY_BG_COLOR') {
        const bgColor = event.data.color;
        onBgColorChange(bgColor);
      }
    };

    window.addEventListener('message', handleMessage);

    const intervalId = setInterval(fetchSpotifyBgColor, 1000); // Check every second

    return () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(intervalId);
    };
  }, [embedUrl, onBgColorChange]);

  return (
    <div className="flex justify-center mt-10">
      {embedUrl && (
        <iframe
          ref={iframeRef}
          className={className}
          src={embedUrl}
          width="100%"
          height="352"
          allow="encrypted-media"
          allowFullScreen
          title="Spotify Player"
        />
      )}
    </div>
  );
};

export default VideoPlayer;
