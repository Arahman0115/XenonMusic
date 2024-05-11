//VideoPlayer.jsx
function VideoPlayer({ videoId, className }) {
    if (!videoId) return null;
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1mute=1`
  
    return (
      <div className="flex justify-center mt-10">
      <iframe
        className={className}
        width="100%"
        height="400"
        src={embedUrl}
        title="YouTube Video Player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      </div>
    );
  }
  
  export default VideoPlayer;