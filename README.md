# 🎵 SoundWave - Audio Visualisation Studio

A stunning web-based audio visualizer that transforms your music into mesmerizing visual art. Experience sound in a whole new dimension with real-time audio visualization that dances to your rhythm.

![SoundWave Demo](https://img.shields.io/badge/Demo-Live-brightgreen) ![License](https://img.shields.io/badge/License-CC%20BY--NC%204.0-blue) ![Browser Support](https://img.shields.io/badge/Browser-Modern%20Browsers-orange)

## ✨ Features

### 🎨 Multiple Visualization Types

- **Bars**: Classic audio frequency bars with dynamic heights
- **Wave**: Smooth flowing waveform display
- **Circular**: Mesmerizing circular frequency visualization
- **Particles**: Dynamic particle system that responds to audio
- **Spectrum**: Full spectrum frequency analysis display

### 🌈 Beautiful Color Themes

- **Neon Pulse**: Vibrant pink and cyan gradients
- **Ocean Waves**: Cool blue gradients with wave-like motion
- **Fire Ember**: Warm red and orange gradients
- **Galaxy**: Purple and blue cosmic gradients
- **Custom Themes**: Additional gradient combinations

### 🎤 Flexible Audio Input

- **Microphone Input**: Real-time visualization of live audio
- **File Upload**: Support for MP3, WAV, OGG, and other audio formats
- **Drag & Drop**: Easy file uploading interface

### 🎛️ Advanced Controls

- **Play/Pause**: Full playback control for uploaded audio
- **Progress Bar**: Seek to any position in your audio
- **Time Display**: Current time and total duration
- **Sensitivity Control**: Adjust visualization responsiveness
- **Fullscreen Mode**: Immersive full-screen experience
- **Theme Toggle**: Switch between light and dark modes

### 📱 Modern Design

- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Butter-smooth 60fps animations
- **Glass Morphism**: Modern UI with blur effects and transparency
- **Accessibility**: Full keyboard navigation and screen reader support

## 🚀 Quick Start

### Option 1: Direct Launch

1. **Download or Clone**: Get the project files to your computer
2. **Open**: Launch `home.html` for the landing page or `index.html` for direct app access
3. **Enjoy**: Start visualizing your audio immediately!

### Option 2: Local Server (Recommended)

```bash
# Clone the repository
git clone https://github.com/shirishpothi/soundvisualiser.git
cd sound-visualiser

# Start a local server (Python 3)
python -m http.server 8000

# Or with Node.js
npx serve .

# Open http://localhost:8000 in your browser
```

## 📖 How to Use

> [!IMPORTANT]  
> Please remember to check microphone permissions before using the microphone features.

### 🎵 Getting Started

1. **Launch the App**: Open the application in your web browser
2. **Choose Your Audio Source**:
   - 🎤 **Microphone**: Click "Use Microphone" for real-time audio visualization
   - 📁 **File Upload**: Drag & drop or click "Upload Audio" to select an audio file
   - 🎧 **Supported Formats**: MP3, WAV, OGG, M4A, and more

### 🎨 Customization

3. **Select Visualization Style**:

   - Choose from Bars, Wave, Circular, Particles, or Spectrum
   - Each style offers unique visual patterns and animations

4. **Pick Your Theme**:

   - Browse through multiple color themes
   - Switch between light and dark modes
   - Themes automatically adapt to your visualization style

5. **Fine-tune Settings**:
   - 🎚️ **Sensitivity**: Adjust how responsive the visualization is to audio
   - 🔊 **Volume**: Control audio playback volume
   - ⚡ **Performance**: Toggle effects for optimal performance

### 🎮 Controls

- **Spacebar**: Play/Pause audio
- **Left/Right Arrows**: Seek backward/forward
- **F**: Toggle fullscreen mode
- **T**: Cycle through themes
- **V**: Change visualization type

## 🛠️ Technical Implementation

### Core Technologies

- **🎵 Web Audio API**: Advanced audio processing and real-time frequency analysis
- **🎨 Canvas API**: High-performance 2D graphics rendering at 60fps
- **⚡ JavaScript ES6+**: Modern JavaScript with async/await and modules
- **🎭 CSS3**: Advanced styling with custom properties, animations, and responsive design
- **📱 Progressive Web App**: Offline capability and mobile optimization

### Architecture

- **Modular Design**: Separate files for different functionalities
- **Performance Optimized**: RequestAnimationFrame for smooth animations
- **Memory Efficient**: Proper cleanup and garbage collection
- **Cross-Browser**: Polyfills and fallbacks for maximum compatibility

### Audio Processing

- **FFT Analysis**: Real-time Fast Fourier Transform for frequency data
- **Smoothing Algorithms**: Temporal smoothing for stable visualizations
- **Dynamic Range**: Automatic gain control and normalization
- **Low Latency**: Optimized for real-time audio processing

## 🌐 Browser Support

> [!NOTE]  
> SoundWave is designed to work best on Chromium based browsers.

| Browser | Version | Support Level   |
| ------- | ------- | --------------- |
| Chrome  | 66+     | ✅ Full Support |
| Firefox | 60+     | ✅ Full Support |
| Safari  | 11.1+   | ✅ Full Support |
| Edge    | 79+     | ✅ Full Support |
| Opera   | 53+     | ✅ Full Support |

### Required Features

- Web Audio API
- Canvas 2D Context
- ES6 Modules
- CSS Custom Properties

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **🐛 Report Bugs**: Open an issue with detailed reproduction steps
2. **💡 Suggest Features**: Share your ideas for new visualizations or improvements
3. **🔧 Submit Pull Requests**: Fix bugs or add new features
4. **📖 Improve Documentation**: Help make the docs clearer and more comprehensive

### Development Setup

```bash
# Fork and clone the repository
git clone <enter-fork-url>
cd sound-visualiser

# Install dependencies
npm install

# Start development server
npm run dev

# Create a feature branch
git checkout -b feature/feature-name

# Make your changes and test thoroughly
npm run lint          # Check code quality
npm run format        # Format code
npm run lighthouse    # Test performance

# Commit with descriptive messages
git commit -m "Add amazing new visualization type"

# Push and create a pull request
git push origin feature/feature-name
```

### CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

#### 🔄 **Automated Workflows**

- **Code Quality**: ESLint, Prettier, HTML validation
- **Security Scanning**: CodeQL, dependency audits, vulnerability scans
- **Performance Testing**: Lighthouse CI with accessibility checks
- **Automated Deployment**: GitHub Pages and Netlify integration

#### 🚀 **Deployment Targets**

- **GitHub Pages**: Automatic deployment on main branch
- **Netlify**: Preview deployments for pull requests
- **Pull Request Previews**: Every PR gets a preview deployment

#### 🛡️ **Security Features**

- Daily security scans
- Dependency vulnerability monitoring
- Automated dependency updates via Dependabot
- SARIF security reporting

## 📄 License

This project is licensed under the **GPL-3.0 License**.

### What this means:

- You can use, modify, and distribute the project for any purpose
- You must provide attribution to the original creators
- You cannot use the project for commercial purposes without permission
- You must include the license and attribution notice in all copies or substantial portions of the project

### Attribution

When using or modifying this project, please include:

```
SoundWave Audio Visualisation Studio
Original work by Shirish
Licensed under GPL-3.0 License
```

For commercial licensing inquiries, please contact shirish.pothi.27@gmail.com.

## 🙏 Acknowledgments

- **Web Audio API Community**: For excellent documentation and examples
- **Canvas API Contributors**: For powerful 2D graphics capabilities
- **Open Source Community**: For inspiration and best practices
- **Audio Visualization Pioneers**: For paving the way in digital audio art
- **You**: For being part of the SoundWave journey!

---

<div align="center">

**Made with ❤️ by Shirish, for the audio visualization community**

[🌟 Star this project](https://github.com/your-username/sound-visualiser) • [🐛 Report Bug](https://github.com/your-username/sound-visualiser/issues) • [💡 Request Feature](https://github.com/your-username/sound-visualiser/issues)

</div>
