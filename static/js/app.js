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

// Background images - update extensions to match your files (.png or .jpg)
const BACKGROUNDS = [
    "/static/backgrounds/01-bright-office-environment.jpg",
    "/static/backgrounds/02-art-gallery-interior.jpg",
    "/static/backgrounds/03-contemporary-office-furniture.jpg",
    "/static/backgrounds/04-chic-home-office-setup.jpg",
    "/static/backgrounds/05-minimalist-office-design.jpg",
    "/static/backgrounds/06-organized-home-office.jpg",
    "/static/backgrounds/07-office-storage-solutions.jpg",
    "/static/backgrounds/08-corporate-office-space.jpg",
    "/static/backgrounds/09-professional-office-interior.jpg",
    "/static/backgrounds/10-collaborative-workspace.jpg",
    "/static/backgrounds/11-stylish-office-interior.jpg",
    "/static/backgrounds/12-modern-home-office-design.jpg",
    "/static/backgrounds/13a-cozy-office-environment.jpg",
    "/static/backgrounds/14-modern-office-corner.jpg",
    "/static/backgrounds/14a-workspace-setup.jpg",
    "/static/backgrounds/15-basement-workspace.jpg",
    "/static/backgrounds/16-stylish-home-office.jpg",
    "/static/backgrounds/18-professional-home-office.jpg",
    "/static/backgrounds/19-contemporary-learning-area.jpg",
    "/static/backgrounds/20-corporate-office-interior.jpg",
    "/static/backgrounds/21-office-desk-and-chairs.jpg",
    "/static/backgrounds/22-serene-indoor-environment.jpg",
    "/static/backgrounds/23-cozy-workspace.jpg",
    "/static/backgrounds/24-corporate-office-environment.jpg",
    "/static/backgrounds/25-office-workspace-design.jpg",
    "/static/backgrounds/26-simple-office-design.jpg",
    "/static/backgrounds/27-training-room-interior.jpg",
    "/static/backgrounds/28-modern-office-interior-shelving.jpg",
    "/static/backgrounds/29-modern-office-space.jpg",
    "/static/backgrounds/30-digital-printing-workspace.jpg",
    "/static/backgrounds/31-presentation-screen-in-conference-room.jpg",
    "/static/backgrounds/32-collaborative-workspace.jpg",
    "/static/backgrounds/33-contemporary-office-furniture.jpg",
    "/static/backgrounds/34-elegant_desk_chair_combination.jpg",
    "/static/backgrounds/35-creative-work-environment.jpg",
    "/static/backgrounds/36-office-storage-solutions.jpg",
    "/static/backgrounds/hero.jpg"
];

function formatName(url) {
  if (url === 'none') return 'No Background';
  return url.split('/').pop()
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function downloadImage(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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

function buildUI() {
  bgSelect.innerHTML = '';
  galleryGrid.innerHTML = '';
  
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
    
    card.appendChild(img);
    card.appendChild(downloadBtn);
    galleryGrid.appendChild(card);
  });
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
  buildUI();
  await initCamera();
  
  // Set "No Background" as default
  bgSelect.value = 'none';
  await loadBackgroundImage('none');
  
  bgSelect.addEventListener('change', async () => {
    await changeBackground(bgSelect.value);
  });
});

// Cleanup
window.addEventListener('beforeunload', () => {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }
  segmentationActive = false;
});
