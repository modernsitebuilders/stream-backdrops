/***********************************************************************
 *  Virtual Background App - Fixed Version
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

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {  
  try {
    // Try loading from GitHub API first
    let urls = await fetchBackgrounds();
    
    // If empty, use manual fallback list
    if (urls.length === 0) {
      console.log('Using fallback image list');
      urls = [
        'https://raw.githubusercontent.com/davidmilesphilly/streams-backdrops/main/backgrounds/office1.jpg',
        'https://raw.githubusercontent.com/davidmilesphilly/streams-backdrops/main/backgrounds/office2.jpg'
      ];
    }

    if (urls.length) {
      initUI(urls);
      initCamera();
      setupEventListeners();
    } else {
      displayError('No background images found. Please ensure your repository is public and contains images in the backgrounds folder.');
    }
  } catch (error) {
    console.error('Initialization error:', error);
    displayError('Failed to load backgrounds. Please check your internet connection and try again.');
  }
});

// Fetch backgrounds from GitHub API
async function fetchBackgrounds() {
  try {
    const res = await fetch('https://api.github.com/repos/davidmilesphilly/streams-backdrops/contents/backgrounds');
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    
    const files = await res.json();
    return files
      .filter(f => f.type === 'file' && /\.(png|jpe?g|webp)$/i.test(f.name))
      .map(f => `https://raw.githubusercontent.com/davidmilesphilly/streams-backdrops/main/backgrounds/${encodeURIComponent(f.name)}`);
  } catch (error) {
    console.log('GitHub API method failed:', error.message);
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

// Camera initialization
async function initCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'user' } 
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
    updateCameraStatus('error', `Camera error: ${err.message}`);
  }
}

// Background segmentation
function startSegmentation() {
  const selfie = new SelfieSegmentation({
    locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${file}`
  });
  
  selfie.setOptions({ modelSelection: 1 });
  selfie.onResults(onResults);

  function processFrame() {
    if (webcam.readyState >= webcam.HAVE_ENOUGH_DATA) {
      selfie.send({ image: webcam });
    }
    requestAnimationFrame(processFrame);
  }
  processFrame();
}

// Handle segmentation results
function onResults(results) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (bgImg.src && bgImg.complete) {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.globalCompositeOperation = 'source-in';
  ctx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = 'source-over';
  ctx.drawImage(webcam, 0, 0, canvas.width, canvas.height);
}

// Event Listeners
function setupEventListeners() {
  bgSelect.addEventListener('change', e => {
    if (e.target.value) {
      bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      bgImg.src = e.target.value;
    }
  });

  snapBtn.addEventListener('click', () => {
    downloadImage(canvas.toDataURL('image/png'), 'virtual-background.png');
  });

  fullscreen.addEventListener('click', e => {
    if (e.target === fullscreen || e.target === closeBtn) {
      fullscreen.style.display = 'none';
    }
  });

  document.getElementById('download-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    await downloadImage(previewImg.src);
  });

  document.getElementById('newtab-btn').addEventListener('click', (e) => {
    e.preventDefault();
    window.open(previewImg.src, '_blank');
  });
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
    if (href.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = href;
      a.download = name || 'background.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }
    
    const response = await fetch(href);
    if (!response.ok) throw new Error('Failed to fetch image');
    
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = name || href.split('/').pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
  } catch (error) {
    console.error('Download failed:', error);
    window.open(href, '_blank');
  }
}

function previewImage(src) {
  previewImg.src = src;
  fullscreen.style.display = 'flex';
}
