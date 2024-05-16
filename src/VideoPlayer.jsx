//VideoPlayer.jsx
function VideoPlayer({ videoId, track, className }) {
  if (!videoId) return null;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0`
  const spotifyEmbedUrl = `https://open.spotify.com/embed/track/${track}`
  return (
    <div className="flex justify-center mt-10">
    <iframe
      className={className}
      width="100%"
      height="370"
      src={embedUrl}
      title="YouTube Video Player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
<iframe 
className="spotifyplayer mt-5 ml-5 rounded"
src={spotifyEmbedUrl}
width="100%" 
height="352"
allow='encrypted-media' >
</iframe>
    </div>
  );
}

export default VideoPlayer;

