/***********************************************************************
 *  Virtual Background App using GitHub-hosted images
 *  Uses GitHub API to discover images in specified folder
 ***********************************************************************/

// GitHub Configuration
const GITHUB_USER = 'davidmilesphilly';      // Your GitHub username
const GITHUB_REPO = 'streams-backdrops';     // Your repository name
const BACKGROUNDS_FOLDER = 'backgrounds';    // Folder containing background images

// DOM Elements
const bgSelect = document.getElementById('bgSelect');
const webcam = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cameraStatus = document.getElementById('cameraStatus');
const snapBtn = document.getElementById('snapBtn');
const galleryGrid = document.getElementById('gallery-grid');
const fullscreen = document.getElementById('fullscreen-preview');
const previewImg = document.getElementById('preview-image');
const closeBtn = document.querySelector('.close-preview');

let bgImg = new Image();
let currentStream = null;

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
  console.log(`Initializing app with repository: ${GITHUB_USER}/${GITHUB_REPO}/${BACKGROUNDS_FOLDER}`);
  
  try {
    const urls = await fetchBackgrounds();
    
    if (urls.length) {
      initUI(urls);
      initCamera();
      setupEventListeners();
    } else {
      showError('No backgrounds found. Please check your repository settings.');
      console.error(`No images found in ${GITHUB_USER}/${GITHUB_REPO}/${BACKGROUNDS_FOLDER}`);
    }
  } catch (error) {
    console.error('Initialization failed:', error);
    showError('Failed to load backgrounds. Please try again later.');
  }
});

// Fetch backgrounds from GitHub
async function fetchBackgrounds() {
  const apiURL = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${BACKGROUNDS_FOLDER}`;
  console.log(`Fetching images from: ${apiURL}`);

  try {
    const res = await fetch(apiURL);
    if (!res.ok) throw new Error(`GitHub API responded with ${res.status}`);
    
    const files = await res.json();
    return files
      .filter(f => /(png|jpe?g|webp)$/i.test(f.name))
      .map(f => `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/${BACKGROUNDS_FOLDER}/${encodeURIComponent(f.name)}`);
  } catch (error) {
    console.error('Error fetching from GitHub:', error);
    
    // Fallback to manual list if API fails
    return getManualImageList();
  }
}

// Manual image list fallback
function getManualImageList() {
  console.warn(`Using manual image list for ${GITHUB_USER}/${GITHUB_REPO}`);
  
  // Add your actual image filenames here
  const manualImages = [
    'office-background-1.jpg',
    'professional-backdrop-2.png',
    'home-office-3.jpg'
  ];
  
  return manualImages.map(img => 
    `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/${BACKGROUNDS_FOLDER}/${encodeURIComponent(img)}`
  );
}

// Initialize UI with fetched backgrounds
function initUI(urls) {
  console.log(`Initializing UI with ${urls.length} backgrounds from ${GITHUB_REPO}`);
  
  // Populate dropdown
  bgSelect.innerHTML = '<option value="" disabled selected>Select background...</option>';
  urls.forEach(url => {
    const opt = document.createElement('option');
    opt.value = url;
    opt.textContent = formatName(url);
    bgSelect.appendChild(opt);
  });

  // Create gallery
  galleryGrid.innerHTML = '';
  urls.forEach(url => {
    const card = document.createElement('div');
    card.className = 'card';
    card.title = `From ${GITHUB_REPO}: ${formatName(url)}`;

    const img = new Image();
    img.src = url;
    img.alt = `Background from ${GITHUB_REPO}: ${formatName(url)}`;
    img.loading = 'lazy';
    img.crossOrigin = 'anonymous';
    
    img.onerror = () => {
      console.error(`Failed to load image from ${url}`);
      img.style.display = 'none';
      card.innerHTML += `<div class="image-error">Image unavailable (${formatName(url)})</div>`;
    };

    const dl = document.createElement('button');
    dl.className = 'download-btn';
    dl.textContent = 'Download';
    dl.onclick = (e) => {
      e.stopPropagation();
      downloadImage(url, `${GITHUB_REPO}_${formatName(url)}.${url.split('.').pop()}`);
    };

    card.onclick = () => previewImage(url);
    card.append(img, dl);
    galleryGrid.appendChild(card);
  });
}

// Camera initialization
async function initCamera() {
  console.log('Initializing camera...');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'user' } 
    });
    currentStream = stream;
    webcam.srcObject = stream;
    updateCameraStatus('active', 'Camera active');
    snapBtn.disabled = false;

    webcam.onloadedmetadata = () => {
      canvas.width = webcam.videoWidth;
      canvas.height = webcam.videoHeight;
      startSegmentation();
    };
  } catch (err) {
    console.error('Camera initialization failed:', err);
    updateCameraStatus('error', `Camera error: ${err.message}`);
  }
}

// Background segmentation setup
function startSegmentation() {
  console.log('Starting background segmentation...');
  const selfie = new SelfieSegmentation({
    locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${file}`
  });
  
  selfie.setOptions({ modelSelection: 1 });
  selfie.onResults(onResults);

  function processFrame() {
    if (webcam.readyState >= webcam.HAVE_ENOUGH_DATA) {
      selfie.send({ image: webcam });
    }
    requestAnimationFrame(processFrame);
  }
  processFrame();
}

// Handle segmentation results
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

// Event Listeners
function setupEventListeners() {
  bgSelect.addEventListener('change', e => {
    if (e.target.value) {
      bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      bgImg.src = e.target.value;
      console.log(`Selected background: ${e.target.value}`);
    }
  });

  snapBtn.addEventListener('click', () => {
    downloadImage(canvas.toDataURL('image/png'), `${GITHUB_REPO}_virtual_background.png`);
  });

  fullscreen.addEventListener('click', e => {
    if (e.target === fullscreen || e.target === closeBtn) {
      fullscreen.style.display = 'none';
    }
  });

  document.getElementById('download-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    await downloadImage(previewImg.src, `${GITHUB_REPO}_${formatName(previewImg.src)}.${previewImg.src.split('.').pop()}`);
  });

  document.getElementById('newtab-btn').addEventListener('click', (e) => {
    e.preventDefault();
    window.open(previewImg.src, '_blank');
  });
}

// Helper Functions
function formatName(url) {
  return url.split('/').pop()
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function updateCameraStatus(cls, msg) {
  cameraStatus.textContent = msg;
  cameraStatus.className = 'camera-status ' + cls;
}

async function downloadImage(href, name) {
  console.log(`Downloading image from ${href}`);
  try {
    if (href.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = href;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }
    
    const response = await fetch(href);
    if (!response.ok) throw new Error('Failed to fetch image');
    
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
  } catch (error) {
    console.error('Download failed:', error);
    window.open(href, '_blank');
  }
}

function previewImage(src) {
  previewImg.src = src;
  fullscreen.style.display = 'flex';
  console.log(`Previewing image: ${src}`);
}

function showError(msg) {
  const div = document.createElement('div');
  div.className = 'error';
  div.innerHTML = `
    <p>${msg}</p>
    <p>Repository: ${GITHUB_USER}/${GITHUB_REPO}/${BACKGROUNDS_FOLDER}</p>
  `;
  galleryGrid.parentNode.insertBefore(div, galleryGrid);
}
