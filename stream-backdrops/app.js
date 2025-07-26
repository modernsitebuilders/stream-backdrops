// 1. Populate <select> with backgrounds
const bgSelect = document.getElementById('bgSelect');
['office.jpg', 'beach.jpg', 'space.jpg'].forEach(name => {
  const opt = document.createElement('option');
  opt.value = `backgrounds/${name}`;
  opt.textContent = name.split('.')[0];
  bgSelect.appendChild(opt);
});

// 2. Start webcam
const webcam = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => { webcam.srcObject = stream; });

// 3. MediaPipe segmentation
const selfieSegmentation = new SelfieSegmentation({ locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${f}` });
selfieSegmentation.setOptions({ modelSelection: 1 });
selfieSegmentation.onResults(onResults);
webcam.onloadedmetadata = () => {
  canvas.width = webcam.videoWidth;
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
  // Draw background
  ctx.globalCompositeOperation = 'source-over';
  if (bgImg.src) ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  else {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  // Mask person on top
  ctx.globalCompositeOperation = 'source-in';
  ctx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'source-over';
  ctx.drawImage(webcam, 0, 0, canvas.width, canvas.height);
}

// 4. Download
document.getElementById('snapBtn').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'backdrop.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});