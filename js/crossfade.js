const playlist = [
    'mp3/song1.mp3',
    'mp3/song2.mp3',
    'mp3/song3.mp3',
    'mp3/song4.mp3'
  ];
  
  const audio1 = new Audio();
  const audio2 = new Audio();
  let currentIndex = 0;
  let isAudio1Playing = true;
  let isPlaying = false;
  
  const playlistEl = document.getElementById('playlist');
  const nowPlayingEl = document.getElementById('nowPlaying');
  const volumeSlider = document.getElementById('volumeSlider');
  const progressBar = document.getElementById('progressBar');
  const crossfadeInputs = [];
  
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const stopBtn = document.getElementById('stopBtn');
  
  // Generate UI for playlist and crossfade inputs
  playlist.forEach((song, i) => {
    const li = document.createElement('li');
    li.textContent = `${i + 1}. ${song}`;
    playlistEl.appendChild(li);
  
    if (i < playlist.length - 1) {
      const crossfadeDiv = document.createElement('div');
      crossfadeDiv.className = 'crossfade-input';
      crossfadeDiv.innerHTML = `
        <label>Crossfade: </label>
        <input type="number" value="12" min="0" max="12" />
      `;
      playlistEl.appendChild(crossfadeDiv);
      crossfadeInputs.push(crossfadeDiv.querySelector('input'));
    }
  });
  
  // Start playlist
  document.getElementById('startBtn').addEventListener('click', () => {
    currentIndex = 0;
    isPlaying = true;
    playTrack(currentIndex);
  });
  
  // Volume control
  volumeSlider.addEventListener('input', () => {
    const vol = parseFloat(volumeSlider.value);
    audio1.volume = vol;
    audio2.volume = vol;
  });
  
  // Seeking via progress bar
  progressBar.addEventListener('input', () => {
    const currentAudio = isAudio1Playing ? audio1 : audio2;
    if (currentAudio.duration) {
      const seekTime = (progressBar.value / 100) * currentAudio.duration;
      currentAudio.currentTime = seekTime;
    }
  });
  
  // Prev button
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      playTrack(currentIndex);
    }
  });
  
  // Next button
  nextBtn.addEventListener('click', () => {
    if (currentIndex < playlist.length - 1) {
      currentIndex++;
      playTrack(currentIndex);
    }
  });

  // Stop button
  stopBtn.addEventListener('click', () => {
    const currentAudio = isAudio1Playing ? audio1 : audio2;
    currentAudio.pause();
    currentAudio.currentTime = 0;
    progressBar.value = 0;
    nowPlayingEl.textContent = 'Stopped';
    isPlaying = false;
  });  
  
  function playTrack(index) {
    const currentAudio = isAudio1Playing ? audio1 : audio2;
    const nextAudio = isAudio1Playing ? audio2 : audio1;
  
    currentAudio.src = playlist[index];
    currentAudio.volume = parseFloat(volumeSlider.value);
    currentAudio.play();
    nowPlayingEl.textContent = `Now Playing: ${playlist[index]}`;
    isPlaying = true;
  
    currentAudio.ontimeupdate = () => {
      // Update progress bar
      const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
      progressBar.value = isNaN(progress) ? 0 : progress;
  
      // Handle crossfade logic
      const nextIndex = index + 1;
      const crossfadeDuration = nextIndex < crossfadeInputs.length
        ? parseFloat(crossfadeInputs[index].value) || 0
        : 0;
  
      if (
        currentAudio.duration &&
        currentAudio.duration - currentAudio.currentTime <= crossfadeDuration &&
        nextIndex < playlist.length
      ) {
        currentAudio.ontimeupdate = null;
  
        nextAudio.src = playlist[nextIndex];
        nextAudio.volume = 0;
        nextAudio.play();
  
        fadeVolumes(currentAudio, nextAudio, crossfadeDuration);
  
        isAudio1Playing = !isAudio1Playing;
        currentIndex = nextIndex;
        playTrack(nextIndex);
      }
    };
  }
  
  function fadeVolumes(outgoing, incoming, duration) {
    const steps = 20;
    const intervalTime = (duration * 1000) / steps;
    const volumeStep = parseFloat(volumeSlider.value) / steps;
  
    let step = 0;
    const fadeInterval = setInterval(() => {
      if (step < steps) {
        outgoing.volume = Math.max(0, outgoing.volume - volumeStep);
        incoming.volume = Math.min(parseFloat(volumeSlider.value), incoming.volume + volumeStep);
        step++;
      } else {
        clearInterval(fadeInterval);
      }
    }, intervalTime);
  }
  