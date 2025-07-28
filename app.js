/***********************************************************************
 *  STREAM BACKDROPS – app.js
 *  Pure dynamic background loading version
 ***********************************************************************/

// DOM Elements
const bgSelect = document.getElementById('bgSelect');
const webcam = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cameraStatus = document.getElementById('cameraStatus');
const snapBtn = document.getElementById('snapBtn');
const galleryGrid = document.getElementById('gallery-grid');

// Background image handling
let bgImg = new Image();
let currentStream = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  const backgrounds = await fetchBackgrounds();
  if (backgrounds.length > 0) {
    initUI(backgrounds);
    initCamera();
  } else {
    showError("No backgrounds found. Please upload images to /backgrounds/ folder.");
  }
});

// Fetch backgrounds from server
async function fetchBackgrounds() {
  try {
    const response = await fetch('/get_backgrounds.php');
    if (!response.ok) throw new Error('Server error: ' + response.status);
    
    const backgrounds = await response.json();
    if (!Array.isArray(backgrounds)) throw new Error('Invalid response format');
    
    return backgrounds.filter(bg => 
      bg.endsWith('.jpg') || 
      bg.endsWith('.jpeg') || 
      bg.endsWith('.png') ||
      bg.endsWith('.webp')
    );
  } catch (error) {
    console.error("Background loading failed:", error);
    showError("Couldn't load backgrounds. Please check console for details.");
    return [];
  }
}

// Initialize UI with backgrounds
function initUI(backgrounds) {
  // Populate dropdown
  bgSelect.innerHTML = '<option value="" disabled selected>Select background...</option>';
  backgrounds.forEach(path => {
    const opt = document.createElement('option');
    opt.value = path;
    opt.textContent = formatName(path);
    bgSelect.appendChild(opt);
  });

  // Populate gallery
  galleryGrid.innerHTML = '';
  backgrounds.forEach(path => {
    const card = document.createElement('div');
    card.className = 'card';
    
    const img = new Image();
    img.src = path;
    img.alt = formatName(path);
    img.loading = 'lazy';
    img.onerror = () => { img.style.display = 'none'; };
    
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'download-btn';
    downloadBtn.textContent = 'Download';
    downloadBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      downloadImage(path);
    });
    
    card.addEventListener('click', () => previewImage(path));
    card.appendChild(img);
    card.appendChild(downloadBtn);
    galleryGrid.appendChild(card);
  });
}

// Format display names
function formatName(path) {
  return path.split('/').pop()
    .split('.')[0]
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

// Initialize camera
function initCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      currentStream = stream;
      webcam.srcObject = stream;
      updateCameraStatus('active', 'Camera active');
      snapBtn.disabled = false;
      
      webcam.onloadedmetadata = () => {
        canvas.width = webcam.videoWidth;
        canvas.height = webcam.videoHeight;
        startSegmentation();
      };
    })
    .catch(err => {
      console.error("Camera error:", err);
      updateCameraStatus('error', 'Camera error: ' + err.message);
    });
}

// MediaPipe segmentation
function startSegmentation() {
  const selfieSegmentation = new SelfieSegmentation({
    locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${file}`
  });
  
  selfieSegmentation.setOptions({ modelSelection: 1 });
  selfieSegmentation.onResults(onResults);
  
  function processFrame() {
    if (webcam.readyState >= webcam.HAVE_ENOUGH_DATA) {
      selfieSegmentation.send({ image: webcam });
    }
    requestAnimationFrame(processFrame);
  }
  processFrame();
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

// Event handlers
bgSelect.addEventListener('change', (e) => {
  if (e.target.value) {
    bgImg = new Image();
    bgImg.crossOrigin = 'Anonymous';
    bgImg.src = e.target.value;
  }
});

snapBtn.addEventListener('click', () => {
  downloadImage(canvas.toDataURL('image/png'), 'backdrop.png');
});

// Helper functions
function updateCameraStatus(status, message) {
  cameraStatus.textContent = message;
  cameraStatus.className = 'camera-status ' + status;
}

function downloadImage(url, filename = null) {
  const link = document.createElement('a');
  link.download = filename || url.split('/').pop();
  link.href = url;
  link.click();
}

function previewImage(url) {
  const preview = document.getElementById('fullscreen-preview');
  const img = document.getElementById('preview-image');
  img.src = url;
  document.getElementById('download-btn').href = url;
  document.getElementById('newtab-btn').href = url;
  preview.style.display = 'flex';
}

function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error';
  errorDiv.textContent = message;
  galleryGrid.parentNode.insertBefore(errorDiv, galleryGrid);
}
