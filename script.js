// ============ UNTUK index.html ============ //
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas?.getContext('2d');
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
      .catch(() => alert("Gagal mengakses kamera 😢"));
  });
}

// Ambil foto dan simpan ke localStorage
if (takePhotoBtn) {
  takePhotoBtn.addEventListener('click', () => {
    if (!canvas || !ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/png');
    const existing = JSON.parse(localStorage.getItem('capturedImages')) || [];
    existing.push(imageData);
    localStorage.setItem('capturedImages', JSON.stringify(existing));

    // Langsung pindah ke canvas.html
    window.location.href = "canvas.html";
  });
}

// Upload booth gambar
if (uploadImage) {
  uploadImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      const image = new Image();
      image.onload = () => {
        const boothData = {
          src: event.target.result,
          width: image.width,
          height: image.height
        };
        localStorage.setItem('boothImage', JSON.stringify(boothData));
        alert("Booth berhasil dimasukkan! Klik 'Lanjut ke Desain'.");
      };
      image.src = event.target.result;
    };

    if (file) reader.readAsDataURL(file);
  });
}



// ============ UNTUK canvas.html ============ //
window.addEventListener('DOMContentLoaded', () => {
  const designArea = document.getElementById('designArea');
  const canvas = document.getElementById('canvas');
  const ctx = canvas?.getContext('2d');

  // Tampilkan booth (jika ada)
  const boothDataRaw = localStorage.getItem('boothImage');
  if (boothDataRaw && canvas && ctx) {
    const boothData = JSON.parse(boothDataRaw);
    const img = new Image();
    img.onload = () => {
      canvas.width = boothData.width;
      canvas.height = boothData.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = boothData.src;
  }

  // Tampilkan semua hasil foto
  const imagesRaw = localStorage.getItem('capturedImages');
  if (imagesRaw && designArea) {
    const imageList = JSON.parse(imagesRaw);
    imageList.forEach((src) => {
      const img = new Image();
      img.onload = () => {
        makeDraggableImage(img);
      };
      img.src = src;
    });
  } else {
    // Kalau tidak ada foto, balik ke halaman utama
  }
});


// Fungsi agar gambar bisa digeser
function makeDraggableImage(img) {
  const designArea = document.getElementById('designArea');
  if (!designArea) return;

  img.classList.add('draggable');
  img.style.position = 'absolute';
  img.style.left = '10px';
  img.style.top = '10px';
  img.style.cursor = 'grab';
  img.style.userSelect = 'none';
  img.draggable = false;
  img.style.zIndex = 10;

  designArea.appendChild(img);

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  img.addEventListener('mousedown', (e) => {
    isDragging = true;
    img.style.cursor = 'grabbing';

    const rect = img.getBoundingClientRect();
    const areaRect = designArea.getBoundingClientRect();

    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    img.style.zIndex = 1000;
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging && designArea) {
      const areaRect = designArea.getBoundingClientRect();
      let newLeft = e.clientX - areaRect.left - offsetX;
      let newTop = e.clientY - areaRect.top - offsetY;

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


// Tombol download hasil desain
const downloadBtn = document.getElementById('downloadImage');
if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    const designArea = document.getElementById('designArea');
    if (!designArea) return;

    html2canvas(designArea).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'desain-ku.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  });
}
  document.getElementById("resetData").addEventListener("click", () => {
      const confirmReset = confirm("Yakin ingin menghapus semua foto dan booth?");
      if (confirmReset) {
        localStorage.removeItem("capturedImages");
        localStorage.removeItem("boothImage");
        alert("Semua data berhasil dihapus.");
        window.location.href = "index.html";
      }
    });

document.getElementById("resetData").addEventListener("click", () => {
      const confirmReset = confirm("Yakin ingin menghapus semua foto dan booth?");
      if (confirmReset) {
        localStorage.removeItem("capturedImages");
        localStorage.removeItem("boothImage");
        alert("Semua data berhasil dihapus.");
        window.location.href = "index.html";
      }
    });