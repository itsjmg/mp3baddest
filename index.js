// Load the YouTube API and initialize the player
function onYouTubeIframeAPIReady() {
  const player = new YT.Player('player', {
    height: '0',
    width: '0',
    videoId: 'VIDEO_ID',
    playerVars: {
      'controls': 0,
      'disablekb': 1,
      'modestbranding': 1,
      'rel': 0,
      'showinfo': 0,
      'start': 0
    },
    events: {
      'onReady': (event) => {
        // Load the audio data from the YouTube video
        loadAudioData('VIDEO_ID', () => {
          // Start the animation
          setInterval(setGradient, 50);
        });
      }
    }
  });
}

// Load the YouTube API script
const script = document.createElement('script');
script.src = 'https://www.youtube.com/iframe_api';
document.head.appendChild(script);
