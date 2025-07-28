/***********************************************************************
 *  STREAM BACKDROPS – app.js
 *  Updated with dynamic background loading
 ***********************************************************************/

// DOM Elements
const bgSelect = document.getElementById('bgSelect');
const webcam = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cameraStatus = document.getElementById('cameraStatus');
const snapBtn = document.getElementById('snapBtn');
const toggleCameraBtn = document.getElementById('toggleCameraBtn');
const galleryGrid = document.getElementById('gallery-grid');

// Background image handling
let bgImg = new Image();
let currentStream = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  await loadBackgrounds();
  initCamera();
  setupEventListeners();
});

// Load backgrounds dynamically from server
async function loadBackgrounds() {
  try {
    const response = await fetch('/get_backgrounds.php');
    if (!response.ok) throw new Error('Network response was not ok');
    
    const backgrounds = await response.json();
    
    if (!backgrounds || !backgrounds.length) {
      throw new Error('No backgrounds found');
    }
    
    populateBackgroundSelect(backgrounds);
    populateGallery(backgrounds);
    
    return backgrounds;
  } catch (error) {
    console.error('Error loading backgrounds:', error);
    
    // Fallback to hardcoded backgrounds if API fails
    const fallbackBackgrounds = [
      'backgrounds/art_gallery_interior.jpg',
      'backgrounds/art_gallery_interior_black_and_white.jpg',
      'backgrounds/contemporary-office-layout.jpg',
      'backgrounds/digital-architecture-visualization.jpg'
    ];
    
    populateBackgroundSelect(fallbackBackgrounds);
    populateGallery(fallbackBackgrounds);
    return fallbackBackgrounds;
  }
}

// Populate background dropdown
function populateBackgroundSelect(backgrounds) {
  bgSelect.innerHTML = '<option value="" disabled selected>Select background...</option>';
  
  backgrounds.forEach(path => {
    const opt = document.createElement('option');
    opt.value = path;
    opt.textContent = path.split('/').pop()
                         .split('.')[0]
                         .replace(/[-_]/g, ' ')
                         .replace(/\b\w/g, l => l.toUpperCase());
    bgSelect.appendChild(opt);
  });
}

// Populate gallery grid
function populateGallery(backgrounds) {
  galleryGrid.innerHTML = '';
  
  backgrounds.forEach(path => {
    const card = document.createElement('div');
    card.className = 'card';
    
    const img = document.createElement('img');
    img.src = path;
    img.alt = path.split('/').pop()
                  .split('.')[0]
                  .replace(/[-_]/g, ' ');
    img.loading = 'lazy';
    
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'download-btn';
    downloadBtn.innerHTML = 'Download';
    downloadBtn.addEventListener('click', () => {
      downloadImage(path);
    });
    
    // Click on image to preview
    card.addEventListener('click', () => {
      previewImage(path);
    });
    
    card.appendChild(img);
    card.appendChild(downloadBtn);
    galleryGrid.appendChild(card);
  });
}

// Initialize camera
function initCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      currentStream = stream;
      webcam.srcObject = stream;
      cameraStatus.textContent = 'Camera active';
      cameraStatus.classList.add('active');
      snapBtn.disabled = false;
      
      webcam.onloadedmetadata = () => {
        canvas.width = webcam.videoWidth;
        canvas.height = webcam.videoHeight;
        startSegmentation();
      };
    })
    .catch(err => {
      console.error("Camera access error:", err);
      cameraStatus.textContent = 'Camera error: ' + err.message;
      cameraStatus.classList.add('error');
    });
}

// Setup MediaPipe selfie segmentation
function startSegmentation() {
  const selfieSegmentation = new SelfieSegmentation({
    locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${file}`
  });
  
  selfieSegmentation.setOptions({ modelSelection: 1 });
  selfieSegmentation.onResults(onResults);
  
  function loop() {
    if (webcam.readyState >= webcam.HAVE_ENOUGH_DATA) {
      selfieSegmentation.send({ image: webcam });
    }
    requestAnimationFrame(loop);
  }
  
  requestAnimationFrame(loop);
}

// Handle segmentation results
function onResults(results) {
  ctx.globalCompositeOperation = 'source-over';
  
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

// Setup event listeners
function setupEventListeners() {
  // Background selection
  bgSelect.addEventListener('change', e => {
    if (e.target.value) {
      bgImg.crossOrigin = 'Anonymous';
      bgImg.src = e.target.value;
    }
  });
  
  // Take snapshot
  snapBtn.addEventListener('click', () => {
    downloadImage(canvas.toDataURL('image/png'), 'backdrop.png');
  });
  
  // Toggle camera
  toggleCameraBtn.addEventListener('click', () => {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
      currentStream = null;
      webcam.srcObject = null;
      cameraStatus.textContent = 'Camera off';
      cameraStatus.classList.remove('active');
      snapBtn.disabled = true;
    } else {
      initCamera();
    }
  });
  
  // Fullscreen preview close
  document.querySelector('.close-preview').addEventListener('click', () => {
    document.getElementById('fullscreen-preview').style.display = 'none';
  });
}

// Download image helper
function downloadImage(url, filename = null) {
  const link = document.createElement('a');
  link.download = filename || url.split('/').pop();
  link.href = url;
  link.click();
}

// Preview image in fullscreen
function previewImage(url) {
  const preview = document.getElementById('fullscreen-preview');
  const img = document.getElementById('preview-image');
  
  img.src = url;
  document.getElementById('download-btn').href = url;
  document.getElementById('newtab-btn').href = url;
  preview.style.display = 'flex';
}
