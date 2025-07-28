/***********************************************************************
 *  STREAM BACKDROPS – app.js
 ***********************************************************************/

// DOM Elements
const bgSelect       = document.getElementById('bgSelect');
const webcam         = document.getElementById('webcam');
const canvas         = document.getElementById('canvas');
const ctx            = canvas.getContext('2d');
const cameraStatus   = document.getElementById('cameraStatus');
const snapBtn        = document.getElementById('snapBtn');
const galleryGrid    = document.getElementById('gallery-grid');
const fullscreen     = document.getElementById('fullscreen-preview');
const previewImg     = document.getElementById('preview-image');
const closePreview   = document.querySelector('.close-preview');

// Globals
let bgImg       = new Image();
let currentStream = null;

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', async () => {
  const bgs = await fetchBackgrounds();
  if (bgs.length) {
    initUI(bgs);
    initCamera();
  } else {
    showError('No backgrounds found. Add images to /backgrounds/ folder.');
  }
});

// --- BACKGROUND LOADER ---
async function fetchBackgrounds() {
  try {
    const res = await fetch('/get_backgrounds.php');
    if (!res.ok) throw new Error(res.statusText);
    const files = await res.json();
    return files.filter(f => /(jpg|jpeg|png|webp)$/i.test(f));
  } catch (e) {
    console.error('Background fetch failed:', e);
    showError('Could not load backgrounds.');
    return [];
  }
}

function initUI(backgrounds) {
  // Dropdown
  bgSelect.innerHTML = '<option value="" disabled selected>Select background...</option>';
  backgrounds.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p;
    opt.textContent = formatName(p);
    bgSelect.appendChild(opt);
  });

  // Gallery
  galleryGrid.innerHTML = '';
  backgrounds.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    const img = new Image();
    img.src = p;
    img.alt = formatName(p);
    img.loading = 'lazy';
    img.onerror = () => (img.style.display = 'none');
    const dl = document.createElement('button');
    dl.className = 'download-btn';
    dl.textContent = 'Download';
    dl.onclick = e => { e.stopPropagation(); downloadImage(p); };
    card.onclick = () => previewImage(p);
    card.append(img, dl);
    galleryGrid.appendChild(card);
  });
}

// --- CAMERA ---
function initCamera() {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: 'user' } })
    .then(stream => {
      currentStream = stream;
      webcam.srcObject = stream;
      updateCameraStatus('active', 'Camera active');
      snapBtn.disabled = false;
      webcam.onloadedmetadata = () => {
        canvas.width  = webcam.videoWidth;
        canvas.height = webcam.videoHeight;
        startSegmentation();
      };
    })
    .catch(err => {
      console.error('Camera error:', err);
      updateCameraStatus('error', 'Camera error: ' + err.message);
    });
}

// --- SEGMENTATION ---
function startSegmentation() {
  const selfie = new SelfieSegmentation({
    locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${file}`
  });
  selfie.setOptions({ modelSelection: 1 });
  selfie.onResults(onResults);

  function loop() {
    if (webcam.readyState >= webcam.HAVE_ENOUGH_DATA)
      selfie.send({ image: webcam });
    requestAnimationFrame(loop);
  }
  loop();
}

function onResults(results) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  if (bgImg.src && bgImg.complete)
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  else {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Mask
  ctx.globalCompositeOperation = 'source-in';
  ctx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);

  // Webcam overlay
  ctx.globalCompositeOperation = 'source-over';
  ctx.drawImage(webcam, 0, 0, canvas.width, canvas.height);
}

// --- EVENTS ---
bgSelect.addEventListener('change', e => {
  if (e.target.value) {
    bgImg = new Image();
    bgImg.crossOrigin = 'anonymous';
    bgImg.src = e.target.value;
  }
});

snapBtn.addEventListener('click', () => {
  downloadImage(canvas.toDataURL('image/png'), 'backdrop.png');
});

fullscreen.addEventListener('click', e => {
  if (e.target === fullscreen || e.target === closePreview)
    fullscreen.style.display = 'none';
});

// --- HELPERS ---
function formatName(path) {
  return path.split('/').pop()
             .replace(/\.(jpg|jpeg|png|webp)$/i, '')
             .replace(/[-_]/g, ' ')
             .replace(/\b\w/g, c => c.toUpperCase());
}
function updateCameraStatus(cls, msg) {
  cameraStatus.textContent = msg;
  cameraStatus.className = 'camera-status ' + cls;
}
function downloadImage(href, name = null) {
  const a = document.createElement('a');
  a.href = href;
  a.download = name || href.split('/').pop();
  a.click();
}
function previewImage(src) {
  previewImg.src = src;
  document.getElementById('download-btn').href = src;
  document.getElementById('newtab-btn').href = src;
  fullscreen.style.display = 'flex';
}
function showError(msg) {
  const div = document.createElement('div');
  div.className = 'error';
  div.textContent = msg;
  galleryGrid.parentNode.insertBefore(div, galleryGrid);
}
