// =============================================================================
// UPLOADER.JS — Fitur Rahasia: 10x Tap & Cropper Image Upload (GitHub API)
// =============================================================================

// Variabel Global untuk Cropper
let cropper = null;
let currentUploadId = null;
let currentUploaderEl = null;

document.addEventListener('modulesLoaded', () => {
  const uploaders = document.querySelectorAll('.secret-uploader');

  uploaders.forEach(el => {
    const id = el.getAttribute('data-upload-id');
    
    // Siapkan kanvas penutup (overlay) untuk menampilkan gambar jika ada
    let imgOverlay = el.querySelector('.upload-overlay');
    if (!imgOverlay) {
      imgOverlay = document.createElement('img');
      imgOverlay.className = 'upload-overlay';
      // Mencegah gambar tertarik/gepeng, kita pakai object-fit cover
      imgOverlay.style.cssText = 'position: absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; z-index:10; display:none; background:var(--card); pointer-events:none;';
      
      // Jika gambar error (tidak ditemukan di GitHub), hilangkan overlay agar placeholder asli terlihat
      imgOverlay.onerror = function() { this.style.display = 'none'; };
      // Jika gambar sukses diload, tampilkan
      imgOverlay.onload = function() { this.style.display = 'block'; };
      
      el.appendChild(imgOverlay);
    }

    // 1. Coba load dari LocalStorage untuk instant preview (sangat cepat)
    const localData = localStorage.getItem('gate-upload-' + id);
    if (localData) {
      imgOverlay.src = localData;
    } else {
      // 2. Jika tidak ada di lokal, coba ambil dari GitHub public URL
      imgOverlay.src = `img/uploads/${id}.png?v=${Date.now()}`;
    }

    // ======================================
    // LOGIKA 10X TAP
    // ======================================
    let clickCount = 0;
    let lastClickTime = 0;

    const handleTap = (e) => {
      // Hanya izinkan tap/klik secara langsung (mencegah double trigger di mobile)
      e.preventDefault(); 
      e.stopPropagation();

      const currentTime = new Date().getTime();
      
      // Reset hitungan jika jeda antar tap lebih dari 500ms (setengah detik)
      if (currentTime - lastClickTime > 500) {
        clickCount = 0;
      }
      
      clickCount++;
      lastClickTime = currentTime;

      if (clickCount === 10) {
        clickCount = 0; // Reset setelah berhasil
        startUploadProcess(el, id);
      }
    };

    // Tambahkan event pendeteksi klik/tap
    // Kita gunakan onclick agar kompatibel di Desktop & Mobile
    el.addEventListener('click', handleTap);
  });

  // Setup Modal Tombol
  document.getElementById('cropperCancel').addEventListener('click', closeCropperModal);
  document.getElementById('cropperDone').addEventListener('click', finishCropAndUpload);
});

// =============================================================================
// GITHUB UPLOAD ENGINE
// =============================================================================
async function uploadToGitHub(id, base64Data) {
  const token = localStorage.getItem('gate-github-token');
  if (!token) return false;
  
  // Ekstrak base64 murni tanpa prefix
  const b64 = base64Data.split(',')[1];
  const path = `img/uploads/${id}.png`;
  const url = `https://api.github.com/repos/thaliban04/gate-puinter/contents/${path}`;
  
  let sha = null;
  try {
    const getRes = await fetch(url, {
      headers: { 'Authorization': `token ${token}` }
    });
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    }
  } catch(e) {}
  
  const body = {
    message: `Auto-upload image: ${id}.png via Cropper UI`,
    content: b64,
    branch: 'main'
  };
  if (sha) body.sha = sha;
  
  try {
    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    return putRes.ok;
  } catch(e) {
    return false;
  }
}

// =============================================================================
// ALUR UTAMA: BUKA INPUT FILE -> BUKA MODAL CROPPER -> UPLOAD
// =============================================================================
async function startUploadProcess(el, id) {
  // 1. Minta Token GitHub
  let token = localStorage.getItem('gate-github-token');
  if (!token) {
    token = prompt("🔒 FITUR ADMIN RAHASIA (Mode Editor) 🔒\n\nMasukkan 'GitHub Access Token' Anda untuk mengaktifkan fitur ini:");
    if (!token || token.trim() === "") return;
    localStorage.setItem('gate-github-token', token.trim());
  }
  
  currentUploadId = id;
  currentUploaderEl = el;

  // 2. Buat tombol input file
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Buka gambar dan tampilkan di modal Cropper
    const reader = new FileReader();
    reader.onload = (ev) => {
      openCropperModal(ev.target.result, el);
    };
    reader.readAsDataURL(file);
  };
  
  input.click();
}

// =============================================================================
// CROPPER MODAL LOGIC
// =============================================================================
function openCropperModal(imageSrc, el) {
  const modal = document.getElementById('cropperModal');
  const imageElement = document.getElementById('cropperImage');
  
  imageElement.src = imageSrc;
  modal.classList.add('show');

  // Hapus cropper lama jika ada
  if (cropper) {
    cropper.destroy();
  }

  // Tentukan rasio crop berdasarkan bentuk elemen target
  // Jika target berbentuk bundar (border-radius: 50%), kita set rasio 1:1
  const styles = window.getComputedStyle(el);
  const isCircle = styles.borderRadius === '50%';
  
  // Hitung rasio aspek (Width / Height) dari kotak asli agar tidak gepeng
  const rect = el.getBoundingClientRect();
  const aspectRatio = isCircle ? 1 : (rect.width / rect.height);

  // Inisialisasi Mesin Cropper.js
  cropper = new Cropper(imageElement, {
    aspectRatio: aspectRatio,
    viewMode: 1,      // Batasi crop box di dalam ukuran kanvas
    dragMode: 'move', // Mengizinkan pengguna menggeser (pan) gambar
    background: false,
    autoCropArea: 1,  // Penuhi seluruh area
    responsive: true,
    restore: false,
    guides: true,
    center: true,
    highlight: false,
    cropBoxMovable: true,
    cropBoxResizable: true,
    toggleDragModeOnDblclick: false,
  });
}

function closeCropperModal() {
  const modal = document.getElementById('cropperModal');
  modal.classList.remove('show');
  if (cropper) {
    cropper.destroy();
    cropper = null;
  }
}

async function finishCropAndUpload() {
  if (!cropper) return;
  
  // Ambil hasil crop menjadi gambar Canvas
  const canvas = cropper.getCroppedCanvas({
    // Batasi ukuran maksimal agar file tidak membengkak
    maxWidth: 1024,
    maxHeight: 1024,
    fillColor: '#fff',
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high',
  });

  // Konversi kanvas ke Base64 (PNG)
  const b64 = canvas.toDataURL('image/png');
  closeCropperModal();

  // 1. INSTANT PREVIEW (Tampilkan langsung di halaman)
  localStorage.setItem('gate-upload-' + currentUploadId, b64);
  let imgOverlay = currentUploaderEl.querySelector('.upload-overlay');
  if(imgOverlay) {
    imgOverlay.src = b64;
    imgOverlay.style.display = 'block';
  }
  
  // 2. UPLOAD KE GITHUB
  currentUploaderEl.style.opacity = '0.5';
  const success = await uploadToGitHub(currentUploadId, b64);
  currentUploaderEl.style.opacity = '1';
  
  if (success) {
    alert("✅ Gambar berhasil di-crop dan tersinkronisasi ke GitHub!\nPerubahan akan terlihat oleh publik dalam ~1 menit.");
  } else {
    alert("❌ Gagal mengunggah ke GitHub. Token mungkin salah atau kadaluarsa.");
  }
}
