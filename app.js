/***********************************************************************
 *  Virtual Background App – Vercel-safe
 *  Auto-lists PNG/JPG/WEBP in /backgrounds
 *  Download buttons actually download the file
 ***********************************************************************/
const SelfieSegmentation = window.SelfieSegmentation || {};
const bgSelect   = document.getElementById('bgSelect');
const webcam     = document.getElementById('webcam');
const canvas     = document.getElementById('canvas');
const ctx        = canvas.getContext('2d');
const cameraStatus = document.getElementById('cameraStatus');
const snapBtn    = document.getElementById('snapBtn');
const galleryGrid = document.getElementById('gallery-grid');
const fullscreen = document.getElementById('fullscreen-preview');
const previewImg = document.getElementById('preview-image');

let bgImg     = new Image();
let currentStream = null;
let segmentationActive = false;

async function listBackgrounds() {
  const repo = 'davidmilesphilly/stream-backdrops';
  try {
    // Try to load from localStorage cache first
    const cached = localStorage.getItem('backgrounds');
    if (cached) return JSON.parse(cached);
    
    const api = `https://api.github.com/repos/${repo}/contents/backgrounds`;
    const res = await fetch(api);
    if (!res.ok) throw new Error('GitHub API request failed');
    
    const files = await res.json();
    const urls = files
      .filter(f => /\.(png|jpe?g|webp)$/i.test(f.name))
      .map(f => `https://raw.githubusercontent.com/${repo}/main/backgrounds/${encodeURIComponent(f.name)}`);
    
    // Cache for 1 hour
    localStorage.setItem('backgrounds', JSON.stringify(urls));
    setTimeout(() => localStorage.removeItem('backgrounds'), 3600000);
    
    return urls;
  } catch (err) {
    console.error("Failed to fetch backgrounds:", err);
    return [];
  }
}

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

function buildUI(urls) {
  bgSelect.innerHTML = '';
  galleryGrid.innerHTML = '';
  
  urls.forEach(url => {
    const name = formatName(url);

    /* dropdown */
    const opt = document.createElement('option');
    opt.value = url;
    opt.textContent = name;
    bgSelect.appendChild(opt);

    /* gallery card */
    const card = document.createElement('div');
    card.className = 'card';
    const img = new Image();
    img.src = url;
    img.alt = name;
    img.loading = 'lazy';
    img.crossOrigin = 'anonymous';
    img.onerror = () => { card.innerHTML = '<div class="error-text">Failed to load</div>'; };
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

  if (urls.length) {
    bgSelect.value = urls[0];
    bgImg.src = urls[0];
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
      startSegmentation();
    };
    
    updateStatus('active', 'Camera active');
    // Remove this line: snapBtn.disabled = false;
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

  // Draw background if loaded, otherwise show fallback
  if (bgImg.complete && bgImg.naturalWidth !== 0) {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Reload if failed
    if (bgImg.src && !bgImg.complete) bgImg.src = bgImg.src;
  }

  ctx.globalCompositeOperation = 'source-in';
  ctx.drawImage(segmentationMask, 0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = 'source-over';
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}
function formatName(url) {
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
  previewImg.src = src;
  fullscreen.style.display = 'flex';
  
  fullscreen.addEventListener('click', (e) => {
    if (e.target === fullscreen) {
      fullscreen.style.display = 'none';
    }
  });

  downloadBtn.onclick = (e) => {
    e.preventDefault();
    downloadImage(src);
  };
  
  newtabBtn.href = src;
  newtabBtn.target = '_blank';
}

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

bgSelect.addEventListener('change', e => {
  bgImg.src = e.target.value;
  bgImg.onload = () => {
    if (segmentationActive) {
      requestAnimationFrame(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      });
    }
  };
});

// Remove or keep these video conference functions if not needed
function applyVirtualBackground() {
  const virtualCanvas = document.createElement('canvas');
  virtualCanvas.width = canvas.width;
  virtualCanvas.height = canvas.height;
  const virtualCtx = virtualCanvas.getContext('2d');
  
  virtualCtx.drawImage(bgImg, 0, 0, virtualCanvas.width, virtualCanvas.height);
  virtualCtx.globalCompositeOperation = 'source-in';
  virtualCtx.drawImage(canvas, 0, 0);
  
  return virtualCanvas.captureStream();
}

let virtualStream = null;

function updateVirtualBackgroundStream() {
  if (virtualStream) {
    virtualStream.getTracks().forEach(track => track.stop());
  }
  virtualStream = applyVirtualBackground();
  console.log('New virtual background stream ready:', virtualStream);
}

window.getVirtualBackgroundStream = () => {
  return virtualStream || applyVirtualBackground();
};
