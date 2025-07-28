/***********************************************************************
 *  STREAM BACKDROPS – backgrounds.js
 ***********************************************************************/

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
  opt.value = `https://raw.githubusercontent.com/davidmilesphilly/stream-backdrops/main/backgrounds/${name}`;
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
  bgImg.crossOrigin = "Anonymous"; // Add this line to fix CORS issues 
  if (e.target.value) {
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
