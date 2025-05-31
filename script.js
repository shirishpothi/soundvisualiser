// Audio Context
let audioContext;
let audioSource;
let analyser;
let audioBuffer;
let audioElement;
let microphone;
let animationId;
let isPlaying = false;
let isMicActive = false;
let currentVisualizationType = 'bars';
let currentColorTheme = 'gradient1';
let sensitivity = 5;
let smoothing = 0.8;
let isFullscreen = false;

// Animation variables for enhanced empty state
let staticAnimationId;
let animationStartTime = 0;
let isStaticAnimating = false;
let particles = [];

// Audio effects
let bassGain, midGain, trebleGain;
let bassFilter, midFilter, trebleFilter;

// DOM Elements
const visualiserCanvas = document.getElementById('visualiser');
const micButton = document.getElementById('micButton');
const audioUpload = document.getElementById('audioUpload');
const playPauseButton = document.getElementById('playPauseButton');
const playbackControls = document.getElementById('playbackControls');
const progressBar = document.querySelector('.progress-bar');
const currentTimeDisplay = document.getElementById('currentTime');
const totalTimeDisplay = document.getElementById('totalTime');
const trackInfo = document.getElementById('trackInfo');
const trackNameElement = document.getElementById('trackName');
const visualizationTypeSelect = document.getElementById('visualizationType');
const colorThemeSelect = document.getElementById('colorTheme');
const sensitivityInput = document.getElementById('sensitivity');
const smoothingInput = document.getElementById('smoothing');
const visualizationInfo = document.getElementById('visualizationInfo');
const infoType = document.getElementById('infoType');
const infoTheme = document.getElementById('infoTheme');

// New UI elements
const volumeMeter = document.getElementById('volumeMeter');
const volumeFill = document.getElementById('volumeFill');
const frequencyDisplay = document.getElementById('frequencyDisplay');
const bassValue = document.getElementById('bassValue');
const midValue = document.getElementById('midValue');
const highValue = document.getElementById('highValue');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const recordBtn = document.getElementById('recordBtn');

// Audio controls
const bassControl = document.getElementById('bassControl');
const midControl = document.getElementById('midControl');
const trebleControl = document.getElementById('trebleControl');
const bassDisplay = document.getElementById('bassDisplay');
const midDisplay = document.getElementById('midDisplay');
const trebleDisplay = document.getElementById('trebleDisplay');

// Preset buttons
const presetButtons = document.querySelectorAll('.preset-btn');

// Canvas setup
const ctx = visualiserCanvas.getContext('2d');
let canvasWidth = visualiserCanvas.offsetWidth;
let canvasHeight = visualiserCanvas.offsetHeight;
visualiserCanvas.width = canvasWidth;
visualiserCanvas.height = canvasHeight;

// Color themes
const colorThemes = {
  gradient1: {
    // Neon Pulse
    colors: ['#ff00cc', '#00ffff', '#ff00cc'],
    background: 'rgba(18, 18, 18, 0.7)'
  },
  gradient2: {
    // Ocean Waves
    colors: ['#00c6fb', '#005bea', '#00c6fb'],
    background: 'rgba(18, 18, 18, 0.7)'
  },
  gradient3: {
    // Fire Ember
    colors: ['#ff0844', '#ffb199', '#ff0844'],
    background: 'rgba(18, 18, 18, 0.7)'
  },
  gradient4: {
    // Galaxy
    colors: ['#8e2de2', '#4a00e0', '#8e2de2'],
    background: 'rgba(18, 18, 18, 0.7)'
  },
  gradient5: {
    // Sunset
    colors: ['#FF6B6B', '#FFE66D', '#FF8E53'],
    background: 'rgba(18, 18, 18, 0.7)'
  },
  gradient6: {
    // Aurora
    colors: ['#A8E6CF', '#88D8C0', '#6FCF97'],
    background: 'rgba(18, 18, 18, 0.7)'
  }
};

// Preset configurations
const presets = {
  energetic: {
    type: 'bars',
    theme: 'gradient1',
    sensitivity: 8,
    smoothing: 0.6
  },
  calm: {
    type: 'wave',
    theme: 'gradient6',
    sensitivity: 3,
    smoothing: 0.9
  },
  psychedelic: {
    type: 'circular',
    theme: 'gradient3',
    sensitivity: 10,
    smoothing: 0.4
  },
  minimal: {
    type: 'spectrum',
    theme: 'gradient2',
    sensitivity: 5,
    smoothing: 0.8
  }
};

// Initialize
function init() {
  // Setup theme toggle
  setupThemeToggle();

  // Event listeners
  window.addEventListener('resize', handleResize);
  micButton.addEventListener('click', toggleMicrophone);
  audioUpload.addEventListener('change', handleAudioUpload);
  if (playPauseButton) {
    playPauseButton.addEventListener('click', togglePlayPause);
  }

  // Visualization controls
  visualizationTypeSelect.addEventListener('change', e => {
    currentVisualizationType = e.target.value;
    updateVisualizationInfo();
  });
  colorThemeSelect.addEventListener('change', e => {
    currentColorTheme = e.target.value;
    updateVisualizationInfo();

    // Restart static animation with new theme colors
    if (isStaticAnimating) {
      stopStaticAnimation();
      startStaticAnimation();
    }
  });
  sensitivityInput.addEventListener('input', e => {
    sensitivity = parseInt(e.target.value);
  });

  if (smoothingInput) {
    smoothingInput.addEventListener('input', e => {
      smoothing = parseFloat(e.target.value);
      if (analyser) {
        analyser.smoothingTimeConstant = smoothing;
      }
    });
  }

  // Audio controls
  if (bassControl) {
    bassControl.addEventListener('input', e => {
      const value = parseInt(e.target.value);
      bassDisplay.textContent = value;
      updateEqualizer();
    });
  }

  if (midControl) {
    midControl.addEventListener('input', e => {
      const value = parseInt(e.target.value);
      midDisplay.textContent = value;
      updateEqualizer();
    });
  }

  if (trebleControl) {
    trebleControl.addEventListener('input', e => {
      const value = parseInt(e.target.value);
      trebleDisplay.textContent = value;
      updateEqualizer();
    });
  }

  // Fullscreen toggle
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
  }

  // Record button
  if (recordBtn) {
    recordBtn.addEventListener('click', toggleRecording);
  }

  // Preset buttons
  presetButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      const presetName = e.target.dataset.preset;
      applyPreset(presetName);
    });
  });

  // Progress bar click event
  if (document.querySelector('.progress-bar')) {
    document.querySelector('.progress-bar').addEventListener('click', e => {
      if (audioElement && audioBuffer) {
        const rect = e.target.getBoundingClientRect();
        const position = (e.clientX - rect.left) / rect.width;
        const seekTime = audioBuffer.duration * position;

        audioElement.currentTime = seekTime;
      }
    });
  }

  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboardShortcuts);

  // Draw initial canvas with animation
  startStaticAnimation();
  updateVisualizationInfo();
}

// Resize handler
function handleResize() {
  canvasWidth = visualiserCanvas.offsetWidth;
  canvasHeight = visualiserCanvas.offsetHeight;
  visualiserCanvas.width = canvasWidth;
  visualiserCanvas.height = canvasHeight;

  // Reinitialize particles for new canvas size
  if (isStaticAnimating) {
    initParticles();
  }

  if (!analyser) {
    drawStatic();
  }
}

// Initialize particles for background animation
function initParticles() {
  particles = [];
  const particleCount = 15;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.3 + 0.1,
      phase: Math.random() * Math.PI * 2
    });
  }
}

// Update particle positions
function updateParticles(time) {
  particles.forEach(particle => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    // Wrap around screen edges
    if (particle.x < 0) {
      particle.x = canvasWidth;
    }
    if (particle.x > canvasWidth) {
      particle.x = 0;
    }
    if (particle.y < 0) {
      particle.y = canvasHeight;
    }
    if (particle.y > canvasHeight) {
      particle.y = 0;
    }

    // Subtle floating animation
    particle.y += Math.sin(time * 0.001 + particle.phase) * 0.2;
    particle.opacity = 0.1 + Math.sin(time * 0.002 + particle.phase) * 0.1;
  });
}

// Draw background particles
function drawBackgroundParticles() {
  const theme = colorThemes[currentColorTheme];

  particles.forEach(particle => {
    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = theme.colors[0];
    ctx.shadowBlur = 10;
    ctx.shadowColor = theme.colors[0];

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  });
}

// Enhanced static visualization with animations
function drawStatic() {
  if (!isStaticAnimating) {
    startStaticAnimation();
    return;
  }

  const time = performance.now();
  if (animationStartTime === 0) {
    animationStartTime = time;
  }

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const theme = colorThemes[currentColorTheme];

  // Draw background
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Update and draw particles
  updateParticles(time);
  drawBackgroundParticles();

  // Create animated gradient for text
  const gradientOffset = Math.sin(time * 0.001) * 0.2;
  const gradient = ctx.createLinearGradient(
    canvasWidth * (0.2 + gradientOffset),
    canvasHeight / 2,
    canvasWidth * (0.8 - gradientOffset),
    canvasHeight / 2
  );

  theme.colors.forEach((color, i) => {
    const stop = i / (theme.colors.length - 1);
    gradient.addColorStop(stop, color);
  });

  // Breathing animation for text scale
  const breathingScale = 1 + Math.sin(time * 0.002) * 0.05;
  const glowIntensity = 15 + Math.sin(time * 0.003) * 10;
  const glowOpacity = 0.6 + Math.sin(time * 0.002) * 0.3;

  ctx.save();
  ctx.translate(canvasWidth / 2, canvasHeight / 2);
  ctx.scale(breathingScale, breathingScale);

  // Draw animated sine waves instead of text
  // Note: coordinate system is already centered due to ctx.translate above
  const waveWidth = canvasWidth * 0.7; // 70% of canvas width
  const startX = -waveWidth / 2; // Start from left side of centered wave

  // Single clean sine wave
  const frequency = 4; // Number of wave cycles across the width
  const amplitude = 30; // Wave height
  const speed = 0.001; // Animation speed

  // No amplitude variation - constant amplitude

  // Create gradient for the wave
  const waveGradient = ctx.createLinearGradient(
    startX,
    -50,
    startX + waveWidth,
    50
  );
  theme.colors.forEach((color, i) => {
    const stop = i / (theme.colors.length - 1);
    waveGradient.addColorStop(stop, color);
  });

  // Set up glow effect
  ctx.shadowBlur = glowIntensity;
  ctx.shadowColor = theme.colors[0];
  ctx.globalAlpha = glowOpacity;
  ctx.strokeStyle = waveGradient;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Draw the sine wave
  ctx.beginPath();
  for (let x = 0; x <= waveWidth; x += 2) {
    const normalizedX = x / waveWidth;
    const wavePhase = normalizedX * Math.PI * 2 * frequency + time * speed;
    const waveY = Math.sin(wavePhase) * amplitude;

    if (x === 0) {
      ctx.moveTo(startX + x, waveY);
    } else {
      ctx.lineTo(startX + x, waveY);
    }
  }
  ctx.stroke();

  // Add subtle outer glow
  ctx.shadowBlur = glowIntensity * 2;
  ctx.globalAlpha = glowOpacity * 0.3;
  ctx.lineWidth = 5;
  ctx.stroke();

  // Add subtle text hint below the waves
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = theme.colors[0];
  ctx.font = '14px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Start by using your microphone or uploading audio', 0, 80);

  // Reset shadow and alpha
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;

  ctx.restore();
}

// Start the static animation loop
function startStaticAnimation() {
  if (isStaticAnimating) {
    return;
  }

  isStaticAnimating = true;
  animationStartTime = 0;
  initParticles();

  function animate() {
    if (!isStaticAnimating) {
      return;
    }

    staticAnimationId = requestAnimationFrame(animate);
    drawStatic();
  }

  animate();
}

// Stop the static animation
function stopStaticAnimation() {
  isStaticAnimating = false;
  if (staticAnimationId) {
    cancelAnimationFrame(staticAnimationId);
    staticAnimationId = null;
  }
}

// Initialize Audio Context
function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = smoothing;

    // Create equalizer filters
    bassFilter = audioContext.createBiquadFilter();
    bassFilter.type = 'lowshelf';
    bassFilter.frequency.value = 320;

    midFilter = audioContext.createBiquadFilter();
    midFilter.type = 'peaking';
    midFilter.frequency.value = 1000;
    midFilter.Q.value = 0.5;

    trebleFilter = audioContext.createBiquadFilter();
    trebleFilter.type = 'highshelf';
    trebleFilter.frequency.value = 3200;
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
}

// Toggle microphone
async function toggleMicrophone() {
  try {
    if (isMicActive) {
      stopAudio();
      micButton.innerHTML =
        '<i class="fas fa-microphone"></i><span>Use Microphone</span>';
      isMicActive = false;
      return;
    }

    stopAudio();
    initAudioContext();

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);

    isMicActive = true;
    micButton.innerHTML =
      '<i class="fas fa-microphone-slash"></i><span>Stop Microphone</span>';
    playbackControls.classList.add('hidden');
    trackInfo.classList.add('hidden');

    visualize();
  } catch (error) {
    console.error('Error accessing microphone:', error);
    alert('Could not access microphone. Please check permissions.');
  }
}

// Handle file upload
function handleAudioUpload(e) {
  const file = e.target.files[0];
  if (!file) {
    return;
  }

  if (!file.type.startsWith('audio/')) {
    alert('Please select an audio file.');
    return;
  }

  const reader = new FileReader();

  reader.onload = function (event) {
    stopAudio();
    initAudioContext();

    const arrayBuffer = event.target.result;

    audioContext.decodeAudioData(
      arrayBuffer,
      buffer => {
        audioBuffer = buffer;

        if (audioElement) {
          audioElement.remove();
        }

        audioElement = new Audio();
        audioElement.src = URL.createObjectURL(file);
        audioElement.addEventListener('timeupdate', updateProgress);
        audioElement.addEventListener('ended', () => {
          playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
          isPlaying = false;
        });

        audioSource = audioContext.createMediaElementSource(audioElement);
        audioSource.connect(analyser);
        analyser.connect(audioContext.destination);

        // Show playback controls and track info
        playbackControls.classList.remove('hidden');
        trackInfo.classList.remove('hidden');
        trackNameElement.textContent = file.name;

        // Set duration display
        const totalMinutes = Math.floor(buffer.duration / 60);
        const totalSeconds = Math.floor(buffer.duration % 60);
        totalTimeDisplay.textContent = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;

        // Start playing
        togglePlayPause();
      },
      error => {
        console.error('Error decoding audio file:', error);
        alert('Could not decode the audio file.');
      }
    );
  };

  reader.onerror = function (error) {
    console.error('Error reading file:', error);
    alert('Error reading the file.');
  };

  reader.readAsArrayBuffer(file);
}

// Toggle play/pause
function togglePlayPause() {
  if (!audioElement || !audioBuffer) {
    return;
  }

  if (isPlaying) {
    audioElement.pause();
    playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
    cancelAnimationFrame(animationId);
    isPlaying = false;
  } else {
    audioElement.play();
    playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
    isPlaying = true;
    visualize();
  }
}

// Update progress bar
function updateProgress() {
  if (!audioElement || !audioBuffer) {
    return;
  }

  const currentTime = audioElement.currentTime;
  const duration = audioBuffer.duration;
  const progress = (currentTime / duration) * 100;

  progressBar.style.width = `${progress}%`;

  const currentMinutes = Math.floor(currentTime / 60);
  const currentSeconds = Math.floor(currentTime % 60);
  currentTimeDisplay.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`;
}

// Update playback info
function updatePlaybackInfo() {
  if (!audioElement) {
    return;
  }

  const currentTime = audioElement.currentTime;
  const duration = audioElement.duration;
  const progressPercent = (currentTime / duration) * 100;

  currentTimeDisplay.textContent = formatTime(currentTime);
  totalTimeDisplay.textContent = formatTime(duration);
  progressBar.style.width = `${progressPercent}%`;

  // Animate progress bar with glow effect
  const themeColor = colorThemes[currentColorTheme].colors[0];
  progressBar.style.boxShadow = `0 0 10px ${themeColor}`;
}

// Stop all audio
function stopAudio() {
  if (isPlaying && audioElement) {
    audioElement.pause();
    isPlaying = false;
  }

  if (microphone) {
    microphone.disconnect();
    microphone = null;
  }

  if (audioSource) {
    audioSource.disconnect();
  }

  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  isMicActive = false;

  // Restart static animation when audio stops
  setTimeout(() => {
    if (!isPlaying && !isMicActive) {
      startStaticAnimation();
    }
  }, 100);
}

// Visualization loop
function visualize() {
  if (!analyser) {
    return;
  }

  // Stop static animation when audio visualization starts
  stopStaticAnimation();

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  canvasWidth = visualiserCanvas.offsetWidth;
  canvasHeight = visualiserCanvas.offsetHeight;
  visualiserCanvas.width = canvasWidth;
  visualiserCanvas.height = canvasHeight;

  // Show visualization info pill
  if (visualizationInfo) {
    visualizationInfo.classList.remove('hidden');
    infoType.textContent =
      currentVisualizationType.charAt(0).toUpperCase() +
      currentVisualizationType.slice(1);

    // Map theme id to friendly name
    const themeNames = {
      gradient1: 'Neon Pulse',
      gradient2: 'Ocean Waves',
      gradient3: 'Fire Ember',
      gradient4: 'Galaxy'
    };
    infoTheme.textContent = themeNames[currentColorTheme] || currentColorTheme;
  }

  function draw() {
    animationId = requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Apply sensitivity
    const amplifiedData = dataArray.map(value =>
      Math.min(255, value * (sensitivity / 5))
    );

    switch (currentVisualizationType) {
      case 'bars':
        drawBars(amplifiedData);
        break;
      case 'wave':
        drawWave(amplifiedData);
        break;
      case 'circular':
        drawCircular(amplifiedData);
        break;
      case 'particles':
        drawParticles(amplifiedData);
        break;
      case 'spectrum':
        drawSpectrum(amplifiedData);
        break;
      default:
        drawBars(amplifiedData);
    }

    // Update audio metrics
    updateAudioMetrics(amplifiedData);

    if (audioElement && isPlaying) {
      updatePlaybackInfo();
    }
  }

  draw();
}

// Draw bars visualization
function drawBars(dataArray) {
  const bufferLength = dataArray.length;
  const barWidth = (canvasWidth / bufferLength) * 2.5;
  let x = 0;

  // Create gradient based on theme
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  const colors = colorThemes[currentColorTheme].colors;
  colors.forEach((color, i) => {
    gradient.addColorStop(i / (colors.length - 1), color);
  });

  ctx.fillStyle = gradient;

  // Draw each bar with a small gap
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i] * 0.9;
    const barSpacing = 1;

    // Add soft glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = colors[0];

    // Draw rounded top bars
    const barX = x;
    const barY = canvasHeight - barHeight;
    const barW = barWidth - barSpacing;

    ctx.fillRect(barX, barY, barW, barHeight);

    // Add rounded top
    ctx.beginPath();
    ctx.arc(barX + barW / 2, barY, barW / 2, 0, Math.PI, true);
    ctx.fill();

    x += barWidth;
  }

  // Reset shadow
  ctx.shadowBlur = 0;
}

// Draw circular visualization
function drawCircular(dataArray) {
  const bufferLength = dataArray.length;
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const radius = Math.min(centerX, centerY) * 0.7;

  const theme = colorThemes[currentColorTheme];
  const colors = theme.colors;

  // Create radial gradient
  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    radius * 0.2,
    centerX,
    centerY,
    radius * 1.2
  );
  colors.forEach((color, i) => {
    gradient.addColorStop(i / (colors.length - 1), color);
  });

  // Add glow effect
  ctx.shadowBlur = 20;
  ctx.shadowColor = colors[0];

  // Create fill gradient with transparency
  const fillGradient = ctx.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    radius * 1.2
  );
  fillGradient.addColorStop(0, colors[0] + '66'); // 40% opacity
  fillGradient.addColorStop(0.7, colors[1] + '33'); // 20% opacity
  fillGradient.addColorStop(1, colors[colors.length - 1] + '00'); // 0% opacity

  // Draw outer circle shape
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 3;

  ctx.beginPath();

  // Use more points for smoother circle
  const steps = Math.floor(bufferLength / 4);
  for (let i = 0; i < steps; i++) {
    const dataIndex = Math.floor(i * (bufferLength / steps));
    const angle = ((Math.PI * 2) / steps) * i;
    const amplitude = dataArray[dataIndex] / 255;

    // Add wave effect to radius
    const dynamicRadius = radius * (0.7 + amplitude * 0.3);

    const x = centerX + Math.cos(angle) * dynamicRadius;
    const y = centerY + Math.sin(angle) * dynamicRadius;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      // Use curve for smoother circle
      const prevAngle = ((Math.PI * 2) / steps) * (i - 1);
      const prevAmplitude =
        dataArray[Math.floor((i - 1) * (bufferLength / steps))] / 255;
      const prevDynamicRadius = radius * (0.7 + prevAmplitude * 0.3);

      const prevX = centerX + Math.cos(prevAngle) * prevDynamicRadius;
      const prevY = centerY + Math.sin(prevAngle) * prevDynamicRadius;

      const cpX =
        centerX + Math.cos((angle + prevAngle) / 2) * dynamicRadius * 1.1;
      const cpY =
        centerY + Math.sin((angle + prevAngle) / 2) * dynamicRadius * 1.1;

      ctx.quadraticCurveTo(cpX, cpY, x, y);
    }
  }

  ctx.closePath();
  ctx.stroke();

  // Fill with semi-transparent gradient
  ctx.fillStyle = fillGradient;
  ctx.fill();

  // Draw center point
  ctx.beginPath();
  ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
  ctx.fillStyle = colors[0];
  ctx.fill();

  // Reset shadow
  ctx.shadowBlur = 0;
}

// Draw wave visualization
function drawWave(dataArray) {
  const bufferLength = dataArray.length;
  const theme = colorThemes[currentColorTheme];
  const colors = theme.colors;

  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  colors.forEach((color, i) => {
    gradient.addColorStop(i / (colors.length - 1), color);
  });

  ctx.strokeStyle = gradient;
  ctx.lineWidth = 3;
  ctx.shadowBlur = 10;
  ctx.shadowColor = colors[0];

  ctx.beginPath();

  const sliceWidth = canvasWidth / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * canvasHeight) / 2;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  ctx.lineTo(canvasWidth, canvasHeight / 2);
  ctx.stroke();

  // Reset shadow
  ctx.shadowBlur = 0;
}

// Draw particles visualization
function drawParticles(dataArray) {
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const theme = colorThemes[currentColorTheme];
  const colors = theme.colors;

  for (let i = 0; i < dataArray.length; i += 4) {
    const value = dataArray[i];
    if (value > 50) {
      const angle = (i / dataArray.length) * Math.PI * 2;
      const radius = value * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      ctx.fillStyle = colors[i % colors.length];
      ctx.shadowBlur = 10;
      ctx.shadowColor = colors[i % colors.length];

      ctx.beginPath();
      ctx.arc(x, y, value / 20, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Reset shadow
  ctx.shadowBlur = 0;
}

// Draw spectrum visualization
function drawSpectrum(dataArray) {
  const barWidth = canvasWidth / dataArray.length;
  const theme = colorThemes[currentColorTheme];
  const colors = theme.colors;

  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
  colors.forEach((color, i) => {
    gradient.addColorStop(i / (colors.length - 1), color);
  });

  ctx.fillStyle = gradient;
  ctx.shadowBlur = 5;
  ctx.shadowColor = colors[0];

  for (let i = 0; i < dataArray.length; i++) {
    const barHeight = (dataArray[i] / 255) * canvasHeight;
    ctx.fillRect(
      i * barWidth,
      canvasHeight - barHeight,
      barWidth - 1,
      barHeight
    );
  }

  // Reset shadow
  ctx.shadowBlur = 0;
}

// Update volume meter and frequency display
function updateAudioMetrics(dataArray) {
  if (!dataArray) {
    return;
  }

  // Calculate volume (RMS)
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i] * dataArray[i];
  }
  const volume = Math.sqrt(sum / dataArray.length) / 255;

  // Update volume meter
  if (volumeFill) {
    volumeFill.style.width = `${volume * 100}%`;
  }

  // Calculate frequency bands
  const bassEnd = Math.floor(dataArray.length * 0.1);
  const midEnd = Math.floor(dataArray.length * 0.5);

  let bassSum = 0,
    midSum = 0,
    highSum = 0;

  for (let i = 0; i < bassEnd; i++) {
    bassSum += dataArray[i];
  }
  for (let i = bassEnd; i < midEnd; i++) {
    midSum += dataArray[i];
  }
  for (let i = midEnd; i < dataArray.length; i++) {
    highSum += dataArray[i];
  }

  const bassAvg = Math.floor(bassSum / bassEnd);
  const midAvg = Math.floor(midSum / (midEnd - bassEnd));
  const highAvg = Math.floor(highSum / (dataArray.length - midEnd));

  // Update frequency display
  if (bassValue) {
    bassValue.textContent = bassAvg;
  }
  if (midValue) {
    midValue.textContent = midAvg;
  }
  if (highValue) {
    highValue.textContent = highAvg;
  }
}

// Helper functions

// Format time in MM:SS format
function formatTime(seconds) {
  if (isNaN(seconds)) {
    return '0:00';
  }
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// New utility functions

// Update visualization info display
function updateVisualizationInfo() {
  if (infoType && infoTheme) {
    const typeNames = {
      bars: 'Bars',
      wave: 'Wave',
      circular: 'Circular',
      particles: 'Particles',
      spectrum: 'Spectrum'
    };

    const themeNames = {
      gradient1: 'Neon Pulse',
      gradient2: 'Ocean Waves',
      gradient3: 'Fire Ember',
      gradient4: 'Galaxy',
      gradient5: 'Sunset',
      gradient6: 'Aurora'
    };

    infoType.textContent = typeNames[currentVisualizationType] || 'Bars';
    infoTheme.textContent = themeNames[currentColorTheme] || 'Neon Pulse';
  }
}

// Update equalizer
function updateEqualizer() {
  if (!bassFilter || !midFilter || !trebleFilter) {
    return;
  }

  const bassValue = bassControl ? parseInt(bassControl.value) : 0;
  const midValue = midControl ? parseInt(midControl.value) : 0;
  const trebleValue = trebleControl ? parseInt(trebleControl.value) : 0;

  bassFilter.gain.value = bassValue;
  midFilter.gain.value = midValue;
  trebleFilter.gain.value = trebleValue;
}

// Toggle fullscreen
function toggleFullscreen() {
  if (!isFullscreen) {
    if (visualiserCanvas.requestFullscreen) {
      visualiserCanvas.requestFullscreen();
    } else if (visualiserCanvas.webkitRequestFullscreen) {
      visualiserCanvas.webkitRequestFullscreen();
    } else if (visualiserCanvas.msRequestFullscreen) {
      visualiserCanvas.msRequestFullscreen();
    }
    visualiserCanvas.classList.add('fullscreen');
    fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    isFullscreen = true;
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    visualiserCanvas.classList.remove('fullscreen');
    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    isFullscreen = false;
  }
}

// Toggle recording (placeholder)
function toggleRecording() {
  // This would implement audio recording functionality
  console.log('Recording feature coming soon!');
}

// Apply preset configuration
function applyPreset(presetName) {
  const preset = presets[presetName];
  if (!preset) {
    return;
  }

  // Update controls
  currentVisualizationType = preset.type;
  currentColorTheme = preset.theme;
  sensitivity = preset.sensitivity;
  smoothing = preset.smoothing;

  // Update UI elements
  visualizationTypeSelect.value = preset.type;
  colorThemeSelect.value = preset.theme;
  sensitivityInput.value = preset.sensitivity;
  if (smoothingInput) {
    smoothingInput.value = preset.smoothing;
  }

  // Update analyser if it exists
  if (analyser) {
    analyser.smoothingTimeConstant = smoothing;
  }

  // Update active preset button
  presetButtons.forEach(btn => btn.classList.remove('active'));
  document
    .querySelector(`[data-preset="${presetName}"]`)
    ?.classList.add('active');

  updateVisualizationInfo();
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(e) {
  switch (e.key) {
    case ' ': // Spacebar - play/pause
      e.preventDefault();
      if (playPauseButton) {
        togglePlayPause();
      }
      break;
    case 'f': // F - fullscreen
    case 'F':
      e.preventDefault();
      if (fullscreenBtn) {
        toggleFullscreen();
      }
      break;
    case 'm': // M - microphone
    case 'M':
      e.preventDefault();
      toggleMicrophone();
      break;
    case '1':
    case '2':
    case '3':
    case '4':
      e.preventDefault();
      const presetNames = ['energetic', 'calm', 'psychedelic', 'minimal'];
      const presetIndex = parseInt(e.key) - 1;
      if (presetNames[presetIndex]) {
        applyPreset(presetNames[presetIndex]);
      }
      break;
  }
}

// Enhanced theme toggle with staggered animations and effects
function setupThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) {
    return;
  }

  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  themeToggle.addEventListener('click', e => {
    // Prevent multiple rapid clicks
    if (themeToggle.classList.contains('rotating')) {
      return;
    }

    // Create ripple effect
    createRippleEffect(e, themeToggle);

    // Add rotation animation
    themeToggle.classList.add('rotating');
    setTimeout(() => {
      themeToggle.classList.remove('rotating');
    }, 600);

    if (prefersReducedMotion) {
      // Instant theme change for reduced motion
      toggleThemeInstant();
    } else {
      // Enhanced theme transition with blur-to-clear effects
      performEnhancedThemeTransition();
    }

    // Update aria-label
    const isLight = document.body.classList.contains('light-theme');
    themeToggle.setAttribute(
      'aria-label',
      isLight ? 'Switch to dark theme' : 'Switch to light theme'
    );
  });
}

// Create ripple effect on theme toggle click
function createRippleEffect(event, button) {
  const ripple = document.createElement('span');
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.classList.add('ripple');
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';

  button.appendChild(ripple);

  // Remove ripple after animation
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Instant theme toggle for reduced motion
function toggleThemeInstant() {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// Enhanced theme transition with staggered animations
function performEnhancedThemeTransition() {
  const elementsToAnimate = [
    { selector: '.nav-container', delay: 0 },
    { selector: '.app-container, .visualiser-container', delay: 50 },
    {
      selector: '.visualization-options, .playback-controls, .audio-controls',
      delay: 100
    },
    {
      selector:
        '.volume-meter, .frequency-display, .info-pill, .fullscreen-btn',
      delay: 150
    },
    { selector: '.animated-background, .gradient-blob', delay: 200 }
  ];

  // Add transitioning class to prevent interactions
  document.body.classList.add('theme-transitioning');

  // Phase 1: Blur out elements with staggered timing
  elementsToAnimate.forEach(({ selector, delay }) => {
    setTimeout(() => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.classList.add('blur-out');
      });
    }, delay);
  });

  // Phase 2: Toggle theme at midpoint
  setTimeout(() => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  }, 350); // Midpoint of 0.7s transition

  // Phase 3: Blur in elements with staggered timing
  setTimeout(() => {
    elementsToAnimate.forEach(({ selector, delay }) => {
      setTimeout(() => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          el.classList.remove('blur-out');
          el.classList.add('blur-in');
        });
      }, delay);
    });
  }, 400);

  // Phase 4: Clean up classes
  setTimeout(() => {
    elementsToAnimate.forEach(({ selector }) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.classList.remove('blur-out', 'blur-in');
      });
    });
    document.body.classList.remove('theme-transitioning');
  }, 900); // Allow time for all animations to complete
}

// Start the app
window.addEventListener('DOMContentLoaded', init);
