
/***********************************************************************
 * Virtual Background App - Enhanced Version
 ***********************************************************************/
const SelfieSegmentation = window.SelfieSegmentation || {};
const bgSelect = document.getElementById('bgSelect');
const webcam = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cameraStatus = document.getElementById('cameraStatus');
const galleryGrid = document.getElementById('gallery-grid');
const fullscreenPreview = document.getElementById('fullscreen-preview');
const previewImage = document.getElementById('preview-image');
const closePreview = document.querySelector('.close-preview');

let bgImg = null;
let currentStream = null;
let segmentationActive = false;
let selfieSegmentation = null;

// Background images - automatically detects .jpg or .png extensions
const BACKGROUND_NAMES = [
    "01-bright-office-environment",
    "02-art-gallery-interior",
    "03-contemporary-office-furniture",
    "04-chic-home-office-setup",
    "05-minimalist-office-design",
    "06-organized-home-office",
    "07-office-storage-solutions",
    "08-corporate-office-space",
    "09-professional-office-interior",
    "10-collaborative-workspace",
    "11-stylish-office-interior",
    "12-modern-home-office-design",
    "13a-cozy-office-environment",
    "14-modern-office-corner",
    "14a-workspace-setup",
    "15-basement-workspace",
    "16-stylish-home-office",
    "18-professional-home-office",
    "19-contemporary-learning-area",
    "20-corporate-office-interior",
    "21-office-desk-and-chairs",
    "22-serene-indoor-environment",
    "23-cozy-workspace",
    "24-corporate-office-environment",
    "25-office-workspace-design",
    "26-simple-office-design",
    "27-training-room-interior",
    "28-modern-office-interior-shelving",
    "29-modern-office-space",
    "30-digital-printing-workspace",
    "31-presentation-screen-in-conference-room",
    "32-collaborative-workspace",
    "33-contemporary-office-furniture",
    "34-elegant_desk_chair_combination",
    "35-creative-work-environment",
    "36-office-storage-solutions",
    "hero"
];

let BACKGROUNDS = [];

function formatName(url) {
  if (url === 'none') return 'No Background';
  return url.split('/').pop()
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// Auto-detect image extensions and build background URLs
async function detectImageExtensions() {
  const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
  
  for (const name of BACKGROUND_NAMES) {
    for (const ext of extensions) {
      const url = `/static/backgrounds/${name}${ext}`;
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
          BACKGROUNDS.push(url);
          break;
        }
      } catch (e) {
        // Continue to next extension
      }
    }
  }
  
  if (BACKGROUNDS.length === 0) {
    console.warn('No background images found. Please check your file paths.');
  }
}

function showLoadingState() {
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading-state';
  loadingDiv.innerHTML = `
    <div class="loading-spinner"></div>
    <p>Loading backgrounds...</p>
  `;
  galleryGrid.appendChild(loadingDiv);
}

function removeLoadingState() {
  const loading = document.querySelector('.loading-state');
  if (loading) loading.remove();
}

function addImageToGallery(url, name) {
  // Create gallery cards
  const card = document.createElement('div');
  card.className = 'card';
  
  const img = new Image();
  img.src = url;
  img.alt = name;
  img.loading = 'lazy';
  img.style.cursor = 'pointer';
  
  // Add click handler for preview
  img.addEventListener('click', () => openPreview(url));
  
  img.onerror = () => {
    card.innerHTML = '<div class="error-text">Failed to load</div>';
  };
  
  // Create download button
  const downloadBtn = document.createElement('button');
  downloadBtn.className = 'download-btn';
  downloadBtn.innerHTML = '⬇ Download';
  downloadBtn.onclick = (e) => {
    e.stopPropagation();
    const filename = url.split('/').pop();
    downloadImage(url, filename);
  };
  
  // Add card info overlay
  const cardInfo = document.createElement('div');
  cardInfo.className = 'card-info';
  cardInfo.innerHTML = `<h3>${name}</h3>`;
  
  card.appendChild(img);
  card.appendChild(downloadBtn);
  card.appendChild(cardInfo);
  galleryGrid.appendChild(card);
}

function openPreview(imageSrc) {
  previewImage.src = imageSrc;
  fullscreenPreview.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closePreviewModal() {
  fullscreenPreview.style.display = 'none';
  document.body.style.overflow = '';
}

function downloadImage(url, filename) {
  // Analytics tracking (if you have Google Analytics)
  if (typeof gtag !== 'undefined') {
    gtag('event', 'download', {
      'event_category': 'background',
      'event_label': filename,
      'value': 1
    });
  }
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Show success message
  showNotification('Background downloaded successfully!', 'success');
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => notification.classList.add('show'), 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 3000);
}

async function buildUI() {
  bgSelect.innerHTML = '';
  galleryGrid.innerHTML = '';
  
  // Show loading state
  showLoadingState();
  
  // Detect available images
  await detectImageExtensions();
  
  // Remove loading state
  removeLoadingState();
  
  // Add "No Background" option first and set as default
  const noneOpt = document.createElement('option');
  noneOpt.value = 'none';
  noneOpt.textContent = 'No Background';
  noneOpt.selected = true;
  bgSelect.appendChild(noneOpt);
  
  // Add all background options
  BACKGROUNDS.forEach(url => {
    const name = formatName(url);
    const opt = document.createElement('option');
    opt.value = url;
    opt.textContent = name;
    bgSelect.appendChild(opt);

    addImageToGallery(url, name);
  });
  
  if (BACKGROUNDS.length === 0) {
    galleryGrid.innerHTML = '<div class="error-text">No background images found. Please check your backgrounds folder.</div>';
  }
}

async function loadBackgroundImage(url) {
  if (url === 'none') {
    bgImg = null;
    return;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      bgImg = img;
      resolve();
    };
    img.onerror = () => {
      console.error('Failed to load background:', url);
      bgImg = null;
      resolve();
    };
    img.src = url;
  });
}

async function changeBackground(bgUrl) {
  await loadBackgroundImage(bgUrl);
}

async function initCamera() {
  try {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { 
        facingMode: 'user', 
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 }
      }
    });
    
    webcam.srcObject = stream;
    currentStream = stream;
    cameraStatus.textContent = 'Camera active';
    cameraStatus.classList.add('active');
    
    webcam.onloadedmetadata = () => {
      canvas.width = webcam.videoWidth;
      canvas.height = webcam.videoHeight;
      startSegmentation();
    };
  } catch (err) {
    console.error('Camera initialization error:', err);
    cameraStatus.textContent = 'Camera error: ' + err.message;
    cameraStatus.classList.add('error');
  }
}

function startSegmentation() {
  selfieSegmentation = new SelfieSegmentation({
    locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${f}`
  });
  
  selfieSegmentation.setOptions({ modelSelection: 1, selfieMode: true });
  selfieSegmentation.onResults(processSegmentation);

  segmentationActive = true;
  
  function processFrame() {
    if (!segmentationActive) return;
    
    if (webcam.readyState >= 2) {
      selfieSegmentation.send({ image: webcam }).catch(console.error);
    }
    requestAnimationFrame(processFrame);
  }
  
  processFrame();
}

function processSegmentation({ segmentationMask, image }) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background if available
  if (bgImg && bgImg.complete) {
    // Scale background to cover canvas
    const scale = Math.max(canvas.width / bgImg.width, canvas.height / bgImg.height);
    const x = (canvas.width - bgImg.width * scale) / 2;
    const y = (canvas.height - bgImg.height * scale) / 2;
    ctx.drawImage(bgImg, x, y, bgImg.width * scale, bgImg.height * scale);
  } else {
    // Default background when none selected
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Apply segmentation mask
  ctx.globalCompositeOperation = 'source-out';
  ctx.drawImage(segmentationMask, 0, 0, canvas.width, canvas.height);

  // Draw camera feed
  ctx.globalCompositeOperation = 'destination-over';
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  // Reset composite operation
  ctx.globalCompositeOperation = 'source-over';
}

// Event Listeners
closePreview.addEventListener('click', closePreviewModal);

fullscreenPreview.addEventListener('click', (e) => {
  if (e.target === fullscreenPreview) {
    closePreviewModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePreviewModal();
  }
});

// Initialize the app
document.addEventListener('DOMContentLoaded', async () => {
  await buildUI();
  await initCamera();
  
  // Set "No Background" as default
  bgSelect.value = 'none';
  await loadBackgroundImage('none');
  
  // Event listeners
  bgSelect.addEventListener('change', async () => {
    await changeBackground(bgSelect.value);
  });
  
  // Search functionality
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', filterGallery);
  
  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      filterGallery();
    });
  });
  
  // Camera controls
  document.getElementById('flipCamera').addEventListener('click', flipCamera);
  document.getElementById('toggleCamera').addEventListener('click', toggleCamera);
  document.getElementById('capturePhoto').addEventListener('click', capturePhoto);
  
  // Performance monitoring
  startPerformanceMonitoring();
});

function filterGallery() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    const img = card.querySelector('img');
    if (!img) return;
    
    const name = img.alt.toLowerCase();
    const matchesSearch = name.includes(searchTerm);
    const matchesFilter = activeFilter === 'all' || name.includes(activeFilter);
    
    if (matchesSearch && matchesFilter) {
      card.style.display = 'block';
      card.style.animation = 'fadeIn 0.3s ease';
    } else {
      card.style.display = 'none';
    }
  });
}

async function flipCamera() {
  // This would require more complex camera switching logic
  showNotification('Camera flip feature coming soon!', 'info');
}

let cameraEnabled = true;
async function toggleCamera() {
  if (cameraEnabled) {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
    }
    webcam.srcObject = null;
    segmentationActive = false;
    cameraStatus.textContent = 'Camera disabled';
    cameraStatus.classList.remove('active');
    cameraEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Camera Disabled', canvas.width/2, canvas.height/2);
  } else {
    await initCamera();
    cameraEnabled = true;
  }
}

function capturePhoto() {
  const link = document.createElement('a');
  link.download = `backdrop-photo-${Date.now()}.png`;
  link.href = canvas.toDataURL();
  link.click();
  showNotification('Photo captured!', 'success');
}

let frameCount = 0;
let lastTime = performance.now();

function startPerformanceMonitoring() {
  const performanceIndicator = document.getElementById('performanceIndicator');
  
  function updateFPS() {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
      
      performanceIndicator.textContent = `FPS: ${fps}`;
      performanceIndicator.className = `performance-indicator ${
        fps >= 25 ? 'fps-good' : fps >= 15 ? 'fps-medium' : 'fps-poor'
      }`;
      
      frameCount = 0;
      lastTime = currentTime;
    }
    
    if (segmentationActive) {
      requestAnimationFrame(updateFPS);
    }
  }
  
  updateFPS();
}

// Cleanup
window.addEventListener('beforeunload', () => {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }
  segmentationActive = false;
});
