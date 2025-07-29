/***********************************************************************
 *  Virtual Background App - Fixed Version
 *  With working "No Background" option and error handling
 ***********************************************************************/
const SelfieSegmentation = window.SelfieSegmentation || {};
const bgSelect = document.getElementById('bgSelect');
const webcam = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cameraStatus = document.getElementById('cameraStatus');
const galleryGrid = document.getElementById('gallery-grid');

let bgImg = null;
let currentStream = null;
let segmentationActive = false;

// Local background images (relative paths)
const BACKGROUNDS = [
  'backgrounds/01-bright-office-environment.jpg',
  'backgrounds/02-art-gallery-interior.jpg',
  'backgrounds/03-contemporary-office-furniture.jpg',
  'backgrounds/04-chic-home-office-setup.jpg',
  'backgrounds/05-minimalist-office-design.jpg',
  'backgrounds/06-organized-home-office.jpg',
  'backgrounds/07-office-storage-solutions.jpg',
  'backgrounds/08-corporate-office-space.jpg',
  'backgrounds/09-professional-office-interior.jpg',
  'backgrounds/10-collaborative-workspace.jpg',
  'backgrounds/11-stylish-office-interior.jpg',
  'backgrounds/12-modern-home-office-design.jpg',
  'backgrounds/13a-cozy-office-environment.jpg',
  'backgrounds/14-modern-office-corner.jpg',
  'backgrounds/14a-workspace-setup.jpg',
  'backgrounds/15-basement-workspace.jpg',
  'backgrounds/16-stylish-home-office.jpg',
  'backgrounds/18-professional-home-office.jpg',
  'backgrounds/19-contemporary-learning-area.jpg',
  'backgrounds/20-corporate-office-interior.jpg',
  'backgrounds/21-office-desk-and-chairs.jpg',
  'backgrounds/22-serene-indoor-environment.jpg',
  'backgrounds/23-cozy-workspace.jpg',
  'backgrounds/24-corporate-office-environment.jpg',
  'backgrounds/25-office-workspace-design.jpg',
  'backgrounds/26-simple-office-design.jpg',
  'backgrounds/27-training-room-interior.jpg',
  'backgrounds/28-modern-office-interior-shelving.jpg',
  'backgrounds/29-modern-office-space.jpg',
  'backgrounds/30-digital-printing-workspace.jpg',
  'backgrounds/31-presentation-screen-in-conference-room.jpg',
  'backgrounds/32-collaborative-workspace.jpg',
  'backgrounds/33-contemporary-office-furniture.jpg',
  'backgrounds/34-elegant_desk_chair_combination.jpg',
  'backgrounds/35-creative-work-environment.jpg',
  'backgrounds/36-office-storage-solutions.jpg',
  'backgrounds/hero.jpg'
];

function formatName(url) {
  if (url === 'none') return 'No Background';
  return url.split('/').pop()
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function buildUI() {
  bgSelect.innerHTML = '';
  galleryGrid.innerHTML = '';
  
  // Add "No Background" option first
  const noneOpt = document.createElement('option');
  noneOpt.value = 'none';
  noneOpt.textContent = 'No Background';
  noneOption.selected = true;
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
    img.onerror = () => card.innerHTML = '<div class="error-text">Failed to load</div>';
    card.appendChild(img);
    galleryGrid.appendChild(card);
  });
}

async function loadBackgroundImage(url) {
  if (url === 'none') {
    bgImg = null;
    // Force redraw with no background
    if (segmentationActive) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#333';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(webcam, 0, 0, canvas.width, canvas.height);
    }
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
  const selfie = new SelfieSegmentation({
    locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${f}`
  });
  
  selfie.setOptions({ modelSelection: 1, selfieMode: true });
  selfie.onResults(processSegmentation);

  segmentationActive = true;
  
  function processFrame() {
    if (!segmentationActive) return;
    
    if (webcam.readyState >= 2) {
      selfie.send({ image: webcam }).catch(console.error);
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

  // Apply segmentation mask - FIXED COMPOSITE OPERATIONS
  ctx.globalCompositeOperation = 'source-out';
  ctx.drawImage(segmentationMask, 0, 0, canvas.width, canvas.height);

  // Draw camera feed
  ctx.globalCompositeOperation = 'destination-over';
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', async () => {
  buildUI();
   // Set "No Background" as default
  bgSelect.value = 'none';
  await loadBackgroundImage('none');
  
  await initCamera();
  
  bgSelect.addEventListener('change', async () => {
    await loadBackgroundImage(bgSelect.value);
  });
});

// Cleanup
window.addEventListener('beforeunload', () => {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }
  segmentationActive = false;
});
