// SpotifyPlayer.jsx
import { useEffect } from 'react';

function SpotifyPlayer({ accessToken, trackUri }) {
  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new Spotify.Player({
        name: 'Web Playback SDK Template',
        getOAuthToken: cb => { cb(accessToken); }
      });

      // Error handling
      player.addListener('initialization_error', ({ message }) => { console.error(message); });
      player.addListener('authentication_error', ({ message }) => { console.error(message); });
      player.addListener('account_error', ({ message }) => { console.error(message); });
      player.addListener('playback_error', ({ message }) => { console.error(message); });

      // Playback status updates
      player.addListener('player_state_changed', state => { console.log(state); });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        player._options.id = device_id;
        play({ playerInstance: player, spotify_uri: trackUri });
      });

      // Connect to the player!
      player.connect();
    };
  }, [accessToken, trackUri]);

   // This component does not render anything
}

export default SpotifyPlayer;