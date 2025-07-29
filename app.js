/***********************************************************************
 *  Virtual Background App - Final Version
 *  With "No Background" default and fixed image loading
 ***********************************************************************/
const SelfieSegmentation = window.SelfieSegmentation || {};
const bgSelect = document.getElementById('bgSelect');
const webcam = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cameraStatus = document.getElementById('cameraStatus');
const galleryGrid = document.getElementById('gallery-grid');
const fullscreen = document.getElementById('fullscreen-preview');
const previewImg = document.getElementById('preview-image');

let bgImg = new Image();
let currentStream = null;
let segmentationActive = false;

// Hardcoded list of all background images
async function listBackgrounds() {
  return [
    'backgrounds/01-bright-office-environment..jpg',
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
    'backgrounds/36-office-storage-solutions .jpg',
    'backgrounds/hero.jpg'
  ];
}

function formatName(url) {
  if (url === 'none') return 'No Background';
  return url.split('/').pop()
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function updateStatus(cls, msg) {
  cameraStatus.textContent = msg;
  cameraStatus.className = 'camera-status ' + cls;
}

function showError(msg) {
  const div = document.createElement('div');
  div.className = 'global-error';
  div.innerHTML = `<p>${msg}</p>`;
  document.querySelector('.container').prepend(div);
}

function loadImageWithRetry(url, retries = 3, delay = 1000) {
  return new Promise((resolve, reject) => {
    if (url === 'none') {
      resolve(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    img.onload = () => resolve(img);
    img.onerror = () => {
      if (retries > 0) {
        setTimeout(() => {
          console.log(`Retrying image load (${retries} attempts left)...`);
          loadImageWithRetry(url, retries - 1, delay).then(resolve).catch(reject);
        }, delay);
      } else {
        reject(new Error(`Failed to load image after 3 attempts: ${url}`));
      }
    };
    
    img.src = `${url}?t=${Date.now()}`;
  });
}

function buildUI(urls) {
  bgSelect.innerHTML = '';
  galleryGrid.innerHTML = '';
  
  // Add "No Background" option first
  const noneOpt = document.createElement('option');
  noneOpt.value = 'none';
  noneOpt.textContent = 'No Background';
  bgSelect.appendChild(noneOpt);
  
  // Add all other backgrounds
  urls.forEach(url => {
    const name = formatName(url);

    const opt = document.createElement('option');
    opt.value = url;
    opt.textContent = name;
    bgSelect.appendChild(opt);

    const card = document.createElement('div');
    card.className = 'card';
    
    const img = new Image();
    img.src = url;
    img.alt = name;
    img.loading = 'lazy';
    img.crossOrigin = 'anonymous';
    img.onerror = () => card.innerHTML = '<div class="error-text">Failed to load</div>';
    img.style.cursor = 'pointer';
    img.onclick = (e) => {
      e.stopPropagation();
      previewImage(url);
    };

    const dl = document.createElement('button');
    dl.className = 'download-btn';
    dl.textContent = 'Download';
    dl.onclick = e => {
      e.stopPropagation();
      downloadImage(url);
    };

    card.append(img, dl);
    galleryGrid.appendChild(card);
  });

  // Set default to "No Background"
  bgSelect.value = 'none';
  bgImg = null;
}

async function loadBackgroundImage(url) {
  try {
    if (url === 'none') {
      bgImg = null;
      if (segmentationActive) {
        requestAnimationFrame(() => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
      }
      return;
    }

    const img = await loadImageWithRetry(url);
    bgImg = img;
    console.log('Background successfully loaded:', url);
    
    if (segmentationActive) {
      requestAnimationFrame(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      });
    }
  } catch (err) {
    console.error('Background loading failed:', err);
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
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
    
    webcam.onloadedmetadata = () => {
      canvas.width = webcam.videoWidth;
      canvas.height = webcam.videoHeight;
      console.log('Camera initialized at:', canvas.width, 'x', canvas.height);
      startSegmentation();
    };
    
    updateStatus('active', 'Camera active');
  } catch (err) {
    updateStatus('error', `Camera error: ${err.message}`);
    console.error('Camera initialization error:', err);
  }
}

function startSegmentation() {
  const selfie = new SelfieSegmentation({
    locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${f}`
  });
  
  selfie.setOptions({ modelSelection: 1, selfieMode: true });
  selfie.onResults(onSegment);

  segmentationActive = true;
  
  let lastFrameTime = 0;
  const targetFPS = 30;
  const frameDelay = 1000 / targetFPS;

  async function processFrame() {
    if (!segmentationActive) return;

    const now = Date.now();
    const elapsed = now - lastFrameTime;

    if (elapsed >= frameDelay && webcam.readyState >= 2) {
      try {
        await selfie.send({ image: webcam });
        lastFrameTime = now;
      } catch (err) {
        console.error('Segmentation error:', err);
      }
    }

    requestAnimationFrame(processFrame);
  }

  processFrame();
}

function onSegment({ segmentationMask, image }) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background if loaded and exists
  if (bgImg && bgImg.complete && bgImg.naturalWidth !== 0) {
    try {
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    } catch (err) {
      console.error('Error drawing background:', err);
      ctx.fillStyle = '#333';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  } else {
    // No background or failed to load - show plain color
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Apply segmentation mask
  ctx.globalCompositeOperation = 'source-in';
  ctx.drawImage(segmentationMask, 0, 0, canvas.width, canvas.height);

  // Draw camera feed
  ctx.globalCompositeOperation = 'source-over';
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}

async function downloadImage(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = url.split('/').pop();
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }, 100);
  } catch (err) {
    console.error("Download failed:", err);
    window.open(url, '_blank');
  }
}

function previewImage(src) {
  if (src === 'none') return;
  
  previewImg.src = src;
  fullscreen.style.display = 'flex';
  
  fullscreen.addEventListener('click', (e) => {
    if (e.target === fullscreen) {
      fullscreen.style.display = 'none';
    }
  });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const urls = await listBackgrounds();
    console.log('Loaded backgrounds:', urls);
    buildUI(urls);
    await initCamera();
  } catch (err) {
    console.error('Error:', err);
    showError('Cannot load backgrounds: ' + err.message);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && fullscreen.style.display === 'flex') {
    fullscreen.style.display = 'none';
  }
});

document.querySelector('.close-preview').addEventListener('click', () => {
  fullscreen.style.display = 'none';
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    segmentationActive = false;
  } else {
    segmentationActive = true;
    if (webcam.srcObject) {
      startSegmentation();
    }
  }
});

window.addEventListener('beforeunload', () => {
  currentStream?.getTracks().forEach(t => t.stop());
  segmentationActive = false;
});

bgSelect.addEventListener('change', async e => {
  await loadBackgroundImage(e.target.value);
});
