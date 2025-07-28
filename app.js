/***********************************************************************
 *  Auto-discovers every image in /backgrounds
 *  Repo: davidmilesphilly/streams-backdrops
 ***********************************************************************/

const GITHUB_USER = 'davidmilesphilly';
const GITHUB_REPO = 'streams-backdrops';
const FOLDER      = 'backgrounds';

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

// ---------- START ----------
document.addEventListener('DOMContentLoaded', async () => {
  const urls = await fetchBackgrounds();
  if (urls.length) {
    initUI(urls);
    initCamera();
  } else {
    showError('No backgrounds found.');
  }
});

// ---------- BACKGROUND DISCOVERY ----------
async function fetchBackgrounds() {
  const apiURL = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${FOLDER}`;
  try {
    const res = await fetch(apiURL);
    if (!res.ok) throw new Error(res.status);
    const files = await res.json();
    return files
      .filter(f => /(png|jpe?g|webp)$/i.test(f.name))
      .map(f => `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/${FOLDER}/${f.name}`);
  } catch {
    return [];
  }
}

// ---------- UI ----------
function initUI(urls) {
  bgSelect.innerHTML = '<option value="" disabled selected>Select background...</option>';
  urls.forEach(url => {
    const opt = document.createElement('option');
    opt.value = url;
    opt.textContent = formatName(url);
    bgSelect.appendChild(opt);
  });

  galleryGrid.innerHTML = '';
  urls.forEach(url => {
    const card = document.createElement('div');
    card.className = 'card';

    const img = new Image();
    img.src = url;
    img.alt = formatName(url);
    img.loading = 'lazy';
    img.crossOrigin = 'anonymous';
    img.onerror = () => img.style.display = 'none';

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
}

// ---------- CAMERA ----------
async function initCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
    currentStream = stream;
    webcam.srcObject = stream;
    updateCameraStatus('active', 'Camera active');
    snapBtn.disabled = false;

    webcam.onloadedmetadata = () => {
      canvas.width  = webcam.videoWidth;
      canvas.height = webcam.videoHeight;
      startSegmentation();
    };
  } catch (err) {
    updateCameraStatus('error', 'Camera error: ' + err.message);
  }
}

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

// ---------- EVENTS ----------
bgSelect.addEventListener('change', e => {
  if (e.target.value) {
    bgImg = new Image();
    bgImg.crossOrigin = 'anonymous';
    bgImg.src = e.target.value;
  }
});

snapBtn.addEventListener('click', () =>
  downloadImage(canvas.toDataURL('image/png'), 'backdrop.png')
);

fullscreen.addEventListener('click', e => {
  if (e.target === fullscreen || e.target === closeBtn)
    fullscreen.style.display = 'none';
});

// ---------- HELPERS ----------
function formatName(url) {
  return url.split('/').pop()
            .replace(/\.(png|jpe?g|webp)$/i, '')
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
}
function updateCameraStatus(cls, msg) {
  cameraStatus.textContent = msg;
  cameraStatus.className = 'camera-status ' + cls;
}
function downloadImage(href, name) {
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
