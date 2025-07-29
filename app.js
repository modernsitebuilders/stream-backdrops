/***********************************************************************
 *  Virtual Background App – Fixed Version
 *  Now properly loads and displays backgrounds
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

// Improved image loader with retry logic
function loadImageWithRetry(url, retries = 3, delay = 1000) {
  return new Promise((resolve, reject) => {
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
    
    // Cache busting and CORS proxy
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    img.src = `${proxyUrl}&t=${Date.now()}`;
  });
}

async function listBackgrounds() {
  const repo = 'davidmilesphilly/stream-backdrops';
  try {
    const cached = localStorage.getItem('backgrounds');
    if (cached) return JSON.parse(cached);
    
    const api = `https://api.github.com/repos/${repo}/contents/backgrounds`;
    const res = await fetch(api);
    if (!res.ok) throw new Error('GitHub API request failed');
    
    const files = await res.json();
    const urls = files
      .filter(f => /\.(png|jpe?g|webp)$/i.test(f.name))
      .map(f => `https://raw.githubusercontent.com/${repo}/main/backgrounds/${encodeURIComponent(f.name)}`);
    
    localStorage.setItem('backgrounds', JSON.stringify(urls));
    setTimeout(() => localStorage.removeItem('backgrounds'), 3600000);
    
    return urls;
  } catch (err) {
    console.error("Failed to fetch backgrounds:", err);
    return [];
  }
}

function buildUI(urls) {
  bgSelect.innerHTML = '';
  galleryGrid.innerHTML = '';
  
  urls.forEach(url => {
    const name = formatName(url);

    // Add to dropdown
    const opt = document.createElement('option');
    opt.value = url;
    opt.textContent = name;
    bgSelect.appendChild(opt);

    // Create gallery card
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

  if (urls.length) {
    loadBackgroundImage(urls[0]);
    bgSelect.value = urls[0];
  }
}

async function loadBackgroundImage(url) {
  try {
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

// Rest of your existing functions (initCamera, startSegmentation, onSegment, etc.)
// ... [keep all other functions exactly as they were in your working version] ...

// Modified event listeners
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

bgSelect.addEventListener('change', async e => {
  await loadBackgroundImage(e.target.value);
});
