/***********************************************************************
 *  Virtual Background App – Vercel-safe
 *  Auto-lists PNG/JPG/WEBP in /backgrounds
 *  Download buttons actually download the file
 ***********************************************************************/

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

/* ---------- 1.  LIST BACKGROUNDS (same-origin) ---------- */
async function listBackgrounds() {
  // Vercel/Netlify serve /backgrounds/ as a directory without index.json
  // We therefore fetch the GitHub API (public repo) as a fallback
  const repo = 'davidmilesphilly/streams-backdrops';
  const api  = `https://api.github.com/repos/${repo}/contents/backgrounds`;
  const res  = await fetch(api);
  if (!res.ok) throw new Error('Unable to load backgrounds');
  const files = await res.json();
  return files
    .filter(f => /\.(png|jpe?g|webp)$/i.test(f.name))
    .map(f => `https://raw.githubusercontent.com/${repo}/main/backgrounds/${encodeURIComponent(f.name)}`);
}

/* ---------- 2.  INIT ---------- */
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const urls = await listBackgrounds();
    buildUI(urls);
    await initCamera();
  } catch (err) {
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
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: 1280, height: 720 }
    });
    webcam.srcObject = stream;
    currentStream = stream;
    webcam.onloadedmetadata = () => {
      canvas.width  = webcam.videoWidth;
      canvas.height = webcam.videoHeight;
      startSegmentation();
    };
    updateStatus('active', 'Camera active');
    snapBtn.disabled = false;
  } catch (err) {
    updateStatus('error', `Camera error: ${err.message}`);
  }
}

function startSegmentation() {
  const selfie = new SelfieSegmentation({
    locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${f}`
  });
  selfie.setOptions({ modelSelection: 1, selfieMode: true });
  selfie.onResults(onSegment);

  segmentationActive = true;
  (function loop() {
    if (segmentationActive && webcam.readyState >= 2) {
      selfie.send({ image: webcam }).catch(() => {});
    }
    requestAnimationFrame(loop);
  })();
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

/* ---------- 6.  DOWNLOAD (same-origin or CORS-enabled) ---------- */
async function downloadImage(url) {
  try {
    const res  = await fetch(url);
    const blob = await res.blob();
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = url.split('/').pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  } catch (err) {
    alert('Download failed: ' + err.message);
  }
}

/* ---------- 7.  FULLSCREEN PREVIEW ---------- */
function previewImage(src) {
  previewImg.src = src;
  downloadBtn.href = src;
  downloadBtn.download = src.split('/').pop();
  newtabBtn.href = src;
  fullscreen.style.display = 'flex';
}
document.querySelector('.close-preview').onclick = () => {
  fullscreen.style.display = 'none';
};

/* ---------- 8.  CLEAN-UP ---------- */
window.addEventListener('beforeunload', () => {
  currentStream?.getTracks().forEach(t => t.stop());
  segmentationActive = false;
});

/* ---------- 9.  CHANGE BACKGROUND ---------- */
bgSelect.addEventListener('change', e => {
  bgImg.src = e.target.value;
});
