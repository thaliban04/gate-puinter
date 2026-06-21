// =============================================================================
// UPLOADER.JS — Fitur Rahasia: Long-Press Image Upload (GitHub API)
// =============================================================================

document.addEventListener('modulesLoaded', () => {
  const uploaders = document.querySelectorAll('.secret-uploader');

  uploaders.forEach(el => {
    const id = el.getAttribute('data-upload-id');
    
    // Siapkan kanvas penutup (overlay) untuk menampilkan gambar jika ada
    let imgOverlay = el.querySelector('.upload-overlay');
    if (!imgOverlay) {
      imgOverlay = document.createElement('img');
      imgOverlay.className = 'upload-overlay';
      imgOverlay.style.cssText = 'position: absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; z-index:10; display:none; background:var(--card);';
      
      // Jika gambar error (tidak ditemukan di GitHub), hilangkan overlay agar placeholder asli terlihat
      imgOverlay.onerror = function() { this.style.display = 'none'; };
      // Jika gambar sukses diload, tampilkan menutupi placeholder
      imgOverlay.onload = function() { this.style.display = 'block'; };
      
      el.appendChild(imgOverlay);
    }

    // 1. Coba load dari LocalStorage untuk instant preview (sangat cepat)
    const localData = localStorage.getItem('gate-upload-' + id);
    if (localData) {
      imgOverlay.src = localData;
    } else {
      // 2. Jika tidak ada di lokal, coba ambil dari GitHub public URL
      // (Ditambahkan cache-buster agar selalu memuat gambar terbaru setelah diupload)
      imgOverlay.src = `img/uploads/${id}.png?v=${Date.now()}`;
    }

    // ======================================
    // LOGIKA LONG PRESS (2 DETIK)
    // ======================================
    let pressTimer;

    const startTimer = (e) => {
      // Mencegah context menu muncul di mobile saat tahan lama
      if(e.type === 'touchstart') {
        // e.preventDefault(); // Kadang mengganggu scroll, lebih baik pakai touch-action CSS
      }
      pressTimer = window.setTimeout(() => startUploadProcess(el, id), 2000);
    };

    const cancelTimer = () => {
      clearTimeout(pressTimer);
    };

    // Event Desktop
    el.addEventListener('mousedown', startTimer);
    el.addEventListener('mouseup', cancelTimer);
    el.addEventListener('mouseleave', cancelTimer);

    // Event Mobile
    el.addEventListener('touchstart', startTimer, {passive: true});
    el.addEventListener('touchend', cancelTimer);
    el.addEventListener('touchcancel', cancelTimer);
  });
});

async function uploadToGitHub(id, base64Data) {
  const token = localStorage.getItem('gate-github-token');
  if (!token) return false;
  
  // Ekstrak base64 murni tanpa prefix (data:image/png;base64,...)
  const b64 = base64Data.split(',')[1];
  const path = `img/uploads/${id}.png`;
  const url = `https://api.github.com/repos/thaliban04/gate-puinter/contents/${path}`;
  
  // 1. Cek apakah file sudah ada di repo (Dapatkan SHA-nya untuk menimpa file)
  let sha = null;
  try {
    const getRes = await fetch(url, {
      headers: { 'Authorization': `token ${token}` }
    });
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    }
  } catch(e) {
    console.log("File belum ada, akan membuat file baru.");
  }
  
  // 2. Lakukan Upload / Update (PUT)
  const body = {
    message: `Auto-upload image: ${id}.png via Web UI`,
    content: b64,
    branch: 'main'
  };
  if (sha) body.sha = sha; // Mutlak wajib jika file sudah ada sebelumnya
  
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

async function startUploadProcess(el, id) {
  // Minta Token GitHub jika perangkat belum menyimpannya
  let token = localStorage.getItem('gate-github-token');
  if (!token) {
    token = prompt("🔒 FITUR ADMIN RAHASIA 🔒\n\nMasukkan 'GitHub Access Token' Anda untuk memberikan izin sinkronisasi Live ke Repositori:");
    if (!token || token.trim() === "") return;
    localStorage.setItem('gate-github-token', token.trim());
  }
  
  // Buat tombol input file bayangan (tersembunyi)
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  
  // Saat file dipilih dari galeri/komputer
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Batasi ukuran maksimal 5MB (Rekomendasi GitHub API)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar terlalu besar! Maksimal 5MB agar tidak membebani website.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const b64 = ev.target.result;
      
      // 1. INSTANT PREVIEW (Simpan di LocalStorage)
      // Ini membuat gambar langsung terlihat di layar Anda tanpa jeda
      localStorage.setItem('gate-upload-' + id, b64);
      let imgOverlay = el.querySelector('.upload-overlay');
      imgOverlay.src = b64;
      
      // 2. UPLOAD KE GITHUB (Sinkronisasi Global)
      el.style.opacity = '0.5'; // Efek loading
      const success = await uploadToGitHub(id, b64);
      el.style.opacity = '1';
      
      if (success) {
        alert("✅ Sinkronisasi Sukses!\n\nGambar telah diunggah ke GitHub. Orang lain akan dapat melihat gambar ini dalam 1-2 menit ke depan setelah GitHub memperbarui server.");
      } else {
        alert("❌ Gagal menembus repositori GitHub.\nPastikan Token Anda masih valid dan memiliki izin 'repo' atau 'contents:write'.");
        if (confirm("Apakah Anda ingin mereset/menghapus Token yang tersimpan di perangkat ini?")) {
           localStorage.removeItem('gate-github-token');
        }
      }
    };
    // Ubah file gambar menjadi teks Base64
    reader.readAsDataURL(file);
  };
  
  // Munculkan jendela pemilihan file
  input.click();
}
