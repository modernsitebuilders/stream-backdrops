// 1. Populate <select> with the four faux images
const bgSelect = document.getElementById('bgSelect');
const fauxImages = ['art_gallery_interior.jpg', 'art_gallery_interior_black_and_white.jpg', 'contemporary-office-layout.jpg', 'digital-architecture-visualization.jpg'];
fauxImages.forEach(name => {
  const opt = document.createElement('option');
  opt.value = `backgrounds/${name}`;
  opt.textContent = name.split('.')[0];
  bgSelect.appendChild(opt);
});

// 2. Start webcam
const webcam  = document.getElementById('webcam');
const canvas  = document.getElementById('canvas');
const ctx     = canvas.getContext('2d');

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => { webcam.srcObject = stream; });

// 3. MediaPipe Selfie Segmentation
import 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/selfie_segmentation.js';
const selfieSegmentation = new SelfieSegmentation({ locateFile: f =>
  `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${f}` });
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

// 4. Download snapshot
document.getElementById('snapBtn').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'backdrop.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// 5. Auto-populate gallery from GitHub
fetch('https://api.github.com/repos/davidmilesphilly/stream-backdrops/contents/backgrounds')
  .then(r => r.json())
  .then(list => list.filter(f => /\.(jpe?g|png)$/i.test(f.name)))
  .then(files => {
    const grid = document.getElementById('gallery-grid');
    files.forEach(f => {
      const img = document.createElement('img');
      img.src   = f.download_url;
      img.alt   = f.name.replace(/\.\w+$/, '').replace(/[-_]/g, ' ');
      img.loading = 'lazy';
      grid.appendChild(img);
    });
  });