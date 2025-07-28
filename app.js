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
const downloadBtn = document.getElementById('download-btn');
const newtabBtn   = document.getElementById('newtab-btn');

let bgImg     = new Image();
let currentStream = null;
let segmentationActive = false;
/* ---------- 1.  IMAGES ---------- */
async function listBackgrounds() {
  const repo = 'davidmilesphilly/stream-backdrops';
  try {
    // Option 1: Use GitHub API (may hit rate limits)
    const api = `https://api.github.com/repos/${repo}/contents/backgrounds`;
    const res = await fetch(api);
    if (!res.ok) throw new Error('GitHub API request failed');
    
    const files = await res.json();
    return files
      .filter(f => /\.(png|jpe?g|webp)$/i.test(f.name))
      .map(f => `https://raw.githubusercontent.com/${repo}/main/backgrounds/${encodeURIComponent(f.name)}`);
/* ---------- 2.  INIT ---------- */
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

/* ---------- 3.  UI ---------- */
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

    const dl = document.createElement('button');
    dl.className = 'download-btn';
    dl.textContent = 'Download';
    dl.onclick = e => {
      e.stopPropagation();
      downloadImage(url);
    };

    card.onclick = () => previewImage(url);
    card.append(img, dl);
    galleryGrid.appendChild(card);
  });

  /* first background selected */
  if (urls.length) {
    bgSelect.value = urls[0];
    bgImg.src = urls[0];
  }
}

/* ---------- 4.  CAMERA & SEGMENTATION ---------- */
async function initCamera() {
  try {
    // Stop any existing stream first
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
    snapBtn.disabled = false;
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

  if (bgImg.src && bgImg.complete) {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.globalCompositeOperation = 'source-in';
  ctx.drawImage(segmentationMask, 0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = 'source-over';
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}

/* ---------- 5.  HELPERS ---------- */
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

/* ---------- 6. DOWNLOAD (works with GitHub URLs) ---------- */
async function downloadImage(url) {
  try {
    // Create a temporary anchor tag
    const a = document.createElement('a');
    
    // For GitHub raw URLs, we can use them directly with download attribute
    a.href = url;
    a.download = url.split('/').pop(); // Extract filename from URL
    a.rel = 'noopener noreferrer'; // Security best practice
    a.target = '_blank'; // Open in new tab as fallback
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  } catch (err) {
    console.error('Download failed:', err);
    // Fallback: Open in new tab if download fails
    window.open(url, '_blank');
  }
}

/* ---------- 7. FULLSCREEN PREVIEW ---------- */
function previewImage(src) {
  previewImg.src = src;
  
  // Update download button
  downloadBtn.onclick = (e) => {
    e.preventDefault();
    downloadImage(src);
  };
  
  // Update new tab button
  newtabBtn.href = src;
  newtabBtn.target = '_blank';
  
  fullscreen.style.display = 'flex';
}
/* ---------- 8.  CLEAN-UP ---------- */
window.addEventListener('beforeunload', () => {
  currentStream?.getTracks().forEach(t => t.stop());
  segmentationActive = false;
});

/* ---------- 9.  CHANGE BACKGROUND ---------- */
bgSelect.addEventListener('change', e => {
  bgImg.src = e.target.value;
});
/* ---------- 10. VIDEO CONFERENCE BACKGROUND ---------- */
function applyVirtualBackground() {
  // Create a new canvas for the virtual background stream
  const virtualCanvas = document.createElement('canvas');
  virtualCanvas.width = canvas.width;
  virtualCanvas.height = canvas.height;
  const virtualCtx = virtualCanvas.getContext('2d');
  
  // Draw the composition (same as our preview)
  virtualCtx.drawImage(bgImg, 0, 0, virtualCanvas.width, virtualCanvas.height);
  virtualCtx.globalCompositeOperation = 'source-in';
  virtualCtx.drawImage(canvas, 0, 0);
  
  // Convert to video stream
  return virtualCanvas.captureStream();
}

/* ---------- 11. DROPDOWN INTEGRATION ---------- */
bgSelect.addEventListener('change', e => {
  bgImg.src = e.target.value;
  
  // Optional: Auto-apply to video conference when background changes
  if (currentStream) {
    updateVirtualBackgroundStream();
  }
});

let virtualStream = null;

function updateVirtualBackgroundStream() {
  if (virtualStream) {
    virtualStream.getTracks().forEach(track => track.stop());
  }
  virtualStream = applyVirtualBackground();
  
  // Here you would replace your video conference stream
  console.log('New virtual background stream ready:', virtualStream);
  // videoConference.updateStream(virtualStream);
}

/* ---------- 12. EXPORT FUNCTION ---------- */
// Add this to your global scope
window.getVirtualBackgroundStream = () => {
  return virtualStream || applyVirtualBackground();
};
