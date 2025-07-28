/***********************************************************************
 *  StreamBackdrops – 100 % front-end version
 ***********************************************************************/

// ---------- CONFIGURATION ----------
// 1. Put your images in /backgrounds/  (root of repo)
// 2. List their exact filenames below (same order you want them shown)
//    → NO leading slashes, NO full URLs needed if they’re in the repo.
const BACKGROUND_FILES = [
  'office1.jpg',
  'office2.jpg',
  'office3.jpg',
  'office4.png'
];

// Build absolute URLs for GitHub Pages (auto-detect origin)
const ORIGIN = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '');
const BACKGROUND_URLS = BACKGROUND_FILES.map(f => `${ORIGIN}/backgrounds/${f}`);

// ---------- DOM ----------
const bgSelect    = document.getElementById('bgSelect');
const webcam      = document.getElementById('webcam');
const canvas      = document.getElementById('canvas');
const ctx         = canvas.getContext('2d');
const cameraStatus= document.getElementById('cameraStatus');
const snapBtn     = document.getElementById('snapBtn');
const galleryGrid = document.getElementById('gallery-grid');
const fullscreen  = document.getElementById('fullscreen-preview');
const previewImg  = document.getElementById('preview-image');
const closeBtn    = document.querySelector('.close-preview');

let bgImg = new Image();
let currentStream = null;

// ---------- INITIALISE ----------
document.addEventListener('DOMContentLoaded', () => {
  initUI(BACKGROUND_URLS);
  initCamera();
});

// ---------- UI ----------
function initUI(urls) {
  // Dropdown
  bgSelect.innerHTML = '<option value="" disabled selected>Select background...</option>';
  urls.forEach(url => {
    const opt = document.createElement('option');
    opt.value = url;
    opt.textContent = formatName(url);
    bgSelect.appendChild(opt);
  });

  // Gallery
  galleryGrid.innerHTML = '';
  urls.forEach(url => {
    const card = document.createElement('div');
    card.className = 'card';

    const img = new Image();
    img.src = url;
    img.alt = formatName(url);
    img.loading = 'lazy';

    const dlBtn = document.createElement('button');
    dlBtn.className = 'download-btn';
    dlBtn.textContent = 'Download';
    dlBtn.onclick = e => { e.stopPropagation(); downloadImage(url); };

    card.onclick = () => previewImage(url);
    card.append(img, dlBtn);
    galleryGrid.appendChild(card);
  });
}

// ---------- CAMERA ----------
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
      console.error(err);
      updateCameraStatus('error', 'Camera error: ' + err.message);
    });
}

// ---------- SEGMENTATION ----------
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

// ---------- EVENTS ----------
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
  if (e.target === fullscreen || e.target === closeBtn)
    fullscreen.style.display = 'none';
});

// ---------- HELPERS ----------
function formatName(url) {
  return url.split('/').pop()
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
