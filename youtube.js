let audioData = null;

function loadAudioData(videoId, callback) {
  // Replace YOUR_API_KEY with your actual API key
  const API_KEY = 'AIzaSyBMKiuC92VJQ2J4MtvaP8ZY4tzHeAx2npQ';

  // Set up the API request
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${KtGFByAJRQQ}&key=${AIzaSyBMKiuC92VJQ2J4MtvaP8ZY4tzHeAx2npQ}&part=contentDetails`;
  const xhr = new XMLHttpRequest();
  xhr.open('GET', apiUrl);

  // Send the API request
  xhr.onload = () => {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      const duration = response.items[0].contentDetails.duration;

      // Use the duration to calculate the start and end time of the audio segment
      const startTime = 0;
      const endTime = parseISO8601Duration(duration);

      // Retrieve the audio segment using the YouTube API
      const audioUrl = `https://www.youtube.com/watch?v=${KtGFByAJRQQ}&t=${startTime}s`;
      const audioContext = new AudioContext();
      const xhr = new XMLHttpRequest();
      xhr.open('GET', audioUrl);
      xhr.responseType = 'arraybuffer';
      xhr.onload = () => {
        audioContext.decodeAudioData(xhr.response, (buffer) => {
          audioData = {
            buffer,
            context: audioContext,
            sampleRate: buffer.sampleRate,
            analyser: createAnalyser(audioContext, buffer)
          };
          callback();
        });
      };
      xhr.send();
    } else {
      console.error('Failed to retrieve video data from the YouTube API');
    }
  };
  xhr.send();

  // Utility function to parse ISO 8601 duration strings (e.g. "PT3M45S")
  function parseISO8601Duration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  }

  // Utility function to create an AnalyserNode for the given AudioContext and AudioBuffer
  function createAnalyser(context, buffer) {
    const analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(analyser);
    analyser.connect(context.destination);
    source.start(0);
    return analyser;
  }
}
