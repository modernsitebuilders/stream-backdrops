/***********************************************************************
 *  Virtual Background App - Final Fixed Version
 *  Handles all errors and loads backgrounds properly
 ***********************************************************************/

// DOM Elements
const bgSelect = document.getElementById('bgSelect');
const webcam = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cameraStatus = document.getElementById('cameraStatus');
const snapBtn = document.getElementById('snapBtn');
const galleryGrid = document.getElementById('gallery-grid');
const fullscreen = document.getElementById('fullscreen-preview');
const previewImg = document.getElementById('preview-image');
const closeBtn = document.querySelector('.close-preview');

let bgImg = new Image();
let currentStream = null;
let segmentationActive = false;

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {  
  try {
    // Try loading from GitHub API first
    let urls = await fetchBackgrounds();
    
    // If empty, use local fallback images
    if (urls.length === 0) {
      console.log('Using local fallback images');
      urls = [
        'https://example.com/path/to/fallback1.jpg',
        'https://example.com/path/to/fallback2.jpg'
      ];
    }

    if (urls.length) {
      initUI(urls);
      await initCamera();
    } else {
      displayError('No background images found. Please add images to your backgrounds folder.');
    }
  } catch (error) {
    console.error('Initialization error:', error);
    displayError('Failed to load backgrounds. Please check your internet connection.');
  }
});

// Fetch backgrounds from GitHub API
async function fetchBackgrounds() {
  try {
    const res = await fetch('https://api.github.com/repos/davidmilesphilly/streams-backdrops/contents/backgrounds');
    if (!res.ok) {
      console.log('GitHub API responded with:', res.status);
      return [];
    }
    
    const files = await res.json();
    const imageUrls = files
      .filter(f => f.type === 'file' && /\.(png|jpe?g|webp)$/i.test(f.name))
      .map(f => `https://raw.githubusercontent.com/davidmilesphilly/streams-backdrops/main/backgrounds/${encodeURIComponent(f.name)}`);
    
    console.log('Found images:', imageUrls);
    return imageUrls;
  } catch (error) {
    console.log('GitHub API request failed:', error.message);
    return [];
  }
}

// Initialize UI with fetched backgrounds
function initUI(urls) {
  // Clear existing
  bgSelect.innerHTML = '';
  galleryGrid.innerHTML = '';

  // Add default option
  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.disabled = true;
  defaultOpt.selected = true;
  defaultOpt.textContent = 'Select background...';
  bgSelect.appendChild(defaultOpt);

  // Add each image
  urls.forEach(url => {
    // Add to dropdown
    const opt = document.createElement('option');
    opt.value = url;
    opt.textContent = formatName(url);
    bgSelect.appendChild(opt);

    // Add to gallery
    const card = document.createElement('div');
    card.className = 'card';

    const img = new Image();
    img.src = url;
    img.alt = formatName(url);
    img.loading = 'lazy';
    img.crossOrigin = 'anonymous';
    
    img.onerror = () => {
      card.classList.add('image-error');
      card.innerHTML = `<div class="error-text">Image failed to load</div>`;
    };

    const dl = document.createElement('button');
    dl.className = 'download-btn';
    dl.textContent = 'Download';
    dl.onclick = (e) => {
      e.stopPropagation();
      downloadImage(url);
    };

    card.onclick = () => previewImage(url);
    card.append(img, dl);
    galleryGrid.appendChild(card);
  });
}

// Camera initialization
async function initCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      } 
    });
    currentStream = stream;
    webcam.srcObject = stream;
    updateCameraStatus('active', 'Camera active');
    snapBtn.disabled = false;

    webcam.onloadedmetadata = () => {
      canvas.width = webcam.videoWidth;
      canvas.height = webcam.videoHeight;
      startSegmentation();
    };
  } catch (err) {
    console.error('Camera error:', err);
    updateCameraStatus('error', `Camera error: ${err.message}`);
  }
}

// Background segmentation with error handling
function startSegmentation() {
  try {
    const selfie = new SelfieSegmentation({
      locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${file}`
    });
    
    selfie.setOptions({ 
      modelSelection: 1,
      selfieMode: true
    });
    
    selfie.onResults(results => {
      if (!segmentationActive) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      if (bgImg.src && bgImg.complete) {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = '#333';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Apply segmentation mask
      ctx.globalCompositeOperation = 'source-in';
      ctx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);

      // Draw camera feed
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    });

    segmentationActive = true;
    
    function processFrame() {
      if (segmentationActive && webcam.readyState >= webcam.HAVE_ENOUGH_DATA) {
        try {
          selfie.send({ image: webcam });
        } catch (e) {
          console.error('Segmentation error:', e);
          segmentationActive = false;
          return;
        }
      }
      requestAnimationFrame(processFrame);
    }
    processFrame();
  } catch (error) {
    console.error('Segmentation initialization failed:', error);
    updateCameraStatus('error', 'Background removal unavailable');
  }
}

// Display error message
function displayError(msg) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'global-error';
  errorDiv.innerHTML = `
    <p>${msg}</p>
    <p>Repository: davidmilesphilly/streams-backdrops/backgrounds</p>
  `;
  document.querySelector('.container').prepend(errorDiv);
}

// Helper Functions
function formatName(url) {
  return url.split('/').pop()
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function updateCameraStatus(cls, msg) {
  cameraStatus.textContent = msg;
  cameraStatus.className = 'camera-status ' + cls;
}

async function downloadImage(href, name) {
  try {
    const a = document.createElement('a');
    a.href = href;
    a.download = name || 'background.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Download failed:', error);
    window.open(href, '_blank');
  }
}

function previewImage(src) {
  previewImg.src = src;
  fullscreen.style.display = 'flex';
}

// Clean up when leaving page
window.addEventListener('beforeunload', () => {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }
  segmentationActive = false;
});
