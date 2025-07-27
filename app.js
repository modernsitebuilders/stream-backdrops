/***********************************************************************
 *  STREAM BACKDROPS – backgrounds.js
 ***********************************************************************/

const USE_WORKER = true;
const CF_WORKER  = 'https://dl.streambackdrops.workers.dev';

const bgSelect = document.getElementById('bgSelect');
const webcam   = document.getElementById('webcam');
const canvas   = document.getElementById('canvas');
const ctx      = canvas.getContext('2d');

const Images = [
  'art_gallery_interior.jpg',
  'art_gallery_interior_black_and_white.jpg',
  'contemporary-office-layout.jpg',
  'digital-architecture-visualization.jpg'
];

Images.forEach(name => {
  const opt = document.createElement('option');
  opt.value = USE_WORKER
    ? `${CF_WORKER}/${name}`
    : `https://raw.githubusercontent.com/davidmilesphilly/stream-backdrops/main/backgrounds/${name}`;
  opt.textContent = name.split('.')[0].replace(/[-_]/g, ' ');
  bgSelect.appendChild(opt);
});

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => { webcam.srcObject = stream; });

const selfieSegmentation = new SelfieSegmentation({
  locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${file}`
});
selfieSegmentation.setOptions({ modelSelection: 1 });
selfieSegmentation.onResults(onResults);

webcam.onloadedmetadata = () => {
  canvas.width  = webcam.videoWidth;
  canvas.height = webcam.videoHeight;
  requestAnimationFrame(loop);
};

function loop() {
  selfieSegmentation.send({ image: webcam });
  requestAnimationFrame(loop);
}

let bgImg = new Image();
bgSelect.addEventListener('change', e => {
  bgImg.src = e.target.value;
});

function onResults(results) {
  ctx.globalCompositeOperation = 'source-over';
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

document.getElementById('snapBtn')?.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'backdrop.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

fetch('https://api.github.com/repos/davidmilesphilly/stream-backdrops/contents/backgrounds')
  .then(r => r.json())
  .then(list => list.filter(f => /\.(jpe?g|png)$/i.test(f.name)))
  .then(files => {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
    grid.style.gap = '1rem';

    files.forEach(f => {
      const card = document.createElement('div');
      card.style.position = 'relative';

      const img = document.createElement('img');
      img.src = f.download_url;
      img.alt = f.name.replace(/\.\w+$/, '').replace(/[-_]/g, ' ');
      img.loading = 'lazy';
      img.style.width = '100%';
      img.style.borderRadius = '8px';
      img.onclick = () => window.open(f.download_url, '_blank');

      const btn = document.createElement('a');
      btn.href        = USE_WORKER
        ? `${CF_WORKER}/${f.name}`
        : f.download_url;
      btn.download    = f.name;
      btn.textContent = 'Download';
      btn.className   = 'download-btn';
      btn.style.cssText = `
        position:absolute; top:8px; right:8px;
        background:#0078ff; color:#fff; padding:6px 10px;
        border-radius:4px; font-size:.75rem; text-decoration:none;
      `;

      card.append(img, btn);
      grid.appendChild(card);
    });
  });
