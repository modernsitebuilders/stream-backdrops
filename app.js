/***********************************************************************
 *  Virtual Background App - Auto-loads all images from backgrounds folder
 ***********************************************************************/

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
  try {
    // First try loading from GitHub
    let urls = await fetchBackgrounds();
    
    // If empty, try direct access method
    if (urls.length === 0) {
      urls = await fetchBackgroundsDirect();
    }

    if (urls.length) {
      initUI(urls);
      initCamera();
      setupEventListeners();
    } else {
      showError('No background images found in your repository. Please add PNG/JPG files to your backgrounds folder and ensure the repository is public.');
    }
  } catch (error) {
    console.error('Initialization error:', error);
    showError('Failed to load backgrounds. Please check: 1) Internet connection 2) Repository is public 3) Images exist in backgrounds folder');
  }
});

// Method 1: Fetch via GitHub API
async function fetchBackgrounds() {
  try {
    const res = await fetch('https://api.github.com/repos/davidmilesphilly/streams-backdrops/contents/backgrounds');
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    
    const files = await res.json();
    return files
      .filter(f => f.type === 'file' && /\.(png|jpe?g|webp)$/i.test(f.name))
      .map(f => `https://raw.githubusercontent.com/davidmilesphilly/streams-backdrops/main/backgrounds/${encodeURIComponent(f.name)}`);
  } catch (error) {
    console.log('GitHub API method failed, trying direct access');
    return [];
  }
}

// Method 2: Direct access fallback
async function fetchBackgroundsDirect() {
  try {
    // First get directory listing (GitHub serves this as HTML)
    const res = await fetch('https://github.com/davidmilesphilly/streams-backdrops/tree/main/backgrounds');
    const html = await res.text();
    
    // Parse HTML to find image files
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const links = Array.from(doc.querySelectorAll('a[href*="/backgrounds/"]'));
    
    return links
      .map(link => link.getAttribute('href'))
      .filter(href => /\.(png|jpe?g|webp)$/i.test(href))
      .map(href => `https://raw.githubusercontent.com${href.replace('/blob/', '/')}`);
  } catch (error) {
    console.error('Direct access method failed:', error);
    return [];
  }
}

// Initialize UI with fetched backgrounds
function initUI(urls) {
  // Clear existing
  bgSelect.innerHTML = '';
  galleryGrid.innerHTML = '';

  // Add default option
  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.disabled = true;
  defaultOpt.selected = true;
  defaultOpt.textContent = 'Select background...';
  bgSelect.appendChild(defaultOpt);

  // Add each image
  urls.forEach(url => {
    // Add to dropdown
    const opt = document.createElement('option');
    opt.value = url;
    opt.textContent = formatName(url);
    bgSelect.appendChild(opt);

    // Add to gallery
    const card = document.createElement('div');
    card.className = 'card';

    const img = new Image();
    img.src = url;
    img.alt = formatName(url);
    img.loading = 'lazy';
    img.crossOrigin = 'anonymous';
    
    img.onerror = () => {
      card.classList.add('image-error');
      card.innerHTML = `<div class="error-text">Failed to load: ${formatName(url)}</div>`;
    };

    const dl = document.createElement('button');
    dl.className = 'download-btn';
    dl.textContent = 'Download';
    dl.onclick = (e) => {
      e.stopPropagation();
      downloadImage(url);
    };

    card.onclick = () => previewImage(url);
    card.append(img, dl);
    galleryGrid.appendChild(card);
  });
}

// [Rest of your existing camera, segmentation, and helper functions...]
// Keep all the other functions exactly as shown in the previous version
// (initCamera, startSegmentation, onResults, setupEventListeners, 
// formatName, updateCameraStatus, downloadImage, previewImage, showError)
