// ==== UNTUK index.html ==== //
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas?.getContext('2d'); // pakai optional chaining agar aman
const startCameraBtn = document.getElementById('startCamera');
const takePhotoBtn = document.getElementById('takePhoto');
const uploadImage = document.getElementById('uploadImage');

// Aktifkan kamera
if (startCameraBtn) {
  startCameraBtn.addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        video.srcObject = stream;
      })
      .catch(err => alert("Gagal mengakses kamera 😢"));
  });
}

// Ambil foto
if (takePhotoBtn) {
  takePhotoBtn.addEventListener('click', () => {
    if (!canvas || !ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const image = new Image();
    image.src = canvas.toDataURL('image/png');

    // Simpan ke localStorage untuk dipakai di canvas.html
    localStorage.setItem('capturedImage', image.src);

    alert("Foto berhasil diambil! Klik 'Lanjut ke Desain' untuk melanjutkan.");
  });
}

// Upload gambar
if (uploadImage) {
  uploadImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const imageData = event.target.result;
      localStorage.setItem('capturedImage', imageData);
      alert("Gambar berhasil diunggah! Klik 'Lanjut ke Desain'.");
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  });
}


// ==== UNTUK canvas.html ==== //
const designArea = document.getElementById('designArea');

/// Cek apakah ada gambar sebelumnya saat halaman dimuat
window.addEventListener('DOMContentLoaded', () => {
  const designArea = document.getElementById('designArea');
  const savedImage = localStorage.getItem('capturedImage');

  if (savedImage && designArea) {
    const img = new Image();
    img.onload = () => {
      makeDraggableImage(img); // masuk ke designArea dan bisa di-drag
    };
    img.src = savedImage;
  } else {
    alert("Belum ada gambar yang diambil atau diunggah.");
  }
});




// Fungsi agar gambar bisa digeser dengan nyaman
function makeDraggableImage(img) {
  img.classList.add('draggable');
  img.style.left = '10px';
  img.style.top = '10px';
  img.style.position = 'absolute';
  img.style.cursor = 'grab';
  img.style.userSelect = 'none';
  img.draggable = false;
  img.style.zIndex = 10;

  const designArea = document.getElementById('designArea');
  designArea.appendChild(img);

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  img.addEventListener('mousedown', (e) => {
    isDragging = true;
    img.style.cursor = 'grabbing';

    const imgRect = img.getBoundingClientRect();
    const areaRect = designArea.getBoundingClientRect();

    offsetX = e.clientX - imgRect.left;
    offsetY = e.clientY - imgRect.top;

    img.style.zIndex = 1000;

    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const areaRect = designArea.getBoundingClientRect();
      let newLeft = e.clientX - areaRect.left - offsetX;
      let newTop = e.clientY - areaRect.top - offsetY;

      // Batasi posisi ke dalam area desain
      newLeft = Math.max(0, Math.min(newLeft, designArea.clientWidth - img.offsetWidth));
      newTop = Math.max(0, Math.min(newTop, designArea.clientHeight - img.offsetHeight));

      img.style.left = `${newLeft}px`;
      img.style.top = `${newTop}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      img.style.cursor = 'grab';
      img.style.zIndex = 10;
    }
  });
}

