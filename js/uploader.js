// =============================================================================
// UPLOADER.JS — Fitur Rahasia: 10x Tap & Cropper Image Upload (GitHub API)
// =============================================================================

// Variabel Global untuk Cropper
let cropper = null;
let currentUploadId = null;
let currentUploaderEl = null;

// Variabel Global untuk Text Editor
let currentTextUploadId = null;

document.addEventListener('modulesLoaded', () => {
  // ======================================
  // 1. LOGIKA IMAGE UPLOADER
  // ======================================
  const uploaders = document.querySelectorAll('.secret-uploader');
  uploaders.forEach(el => {
    const id = el.getAttribute('data-upload-id');
    
    // Siapkan kanvas penutup (overlay) untuk menampilkan gambar jika ada
    let imgOverlay = el.querySelector('.upload-overlay');
    if (!imgOverlay) {
      imgOverlay = document.createElement('img');
      imgOverlay.className = 'upload-overlay';
      // Mencegah gambar tertarik/gepeng, kita pakai object-fit cover (kecuali untuk blueprint yang butuh contain agar tidak terpotong)
      const objectFit = (id === 'solution' || id.startsWith('doc-')) ? 'contain' : 'cover';
      imgOverlay.style.cssText = `position: absolute; top:0; left:0; width:100%; height:100%; object-fit:${objectFit}; z-index:10; opacity:0; background:var(--card); pointer-events:none; transition: opacity 0.3s ease;`;
      if (id !== 'hero') {
        imgOverlay.loading = 'lazy';
      }
      
      // Jika gambar error (tidak ditemukan di GitHub), biarkan transparan agar placeholder asli terlihat
      imgOverlay.onerror = function() { this.style.opacity = '0'; };
      // Jika gambar sukses diload, tampilkan (fade in)
      imgOverlay.onload = function() { this.style.opacity = '1'; };
      
      el.appendChild(imgOverlay);
    }

    // Coba load dari LocalStorage
    const localData = localStorage.getItem('gate-upload-' + id);
    if (localData) {
      imgOverlay.src = localData;
    } else {
      // Fetch dari GitHub public
      imgOverlay.src = `img/uploads/${id}.png`;
    }

    let clickCount = 0;
    let lastClickTime = 0;

    const handleTap = (e) => {
      e.preventDefault(); 
      e.stopPropagation();
      const currentTime = new Date().getTime();
      
      if (currentTime - lastClickTime > 500) clickCount = 0;
      
      clickCount++;
      lastClickTime = currentTime;

      if (clickCount === 10) {
        clickCount = 0;
        startUploadProcess(el, id);
      }
    };
    el.addEventListener('click', handleTap);
  });

  // Setup Modal Cropper
  document.getElementById('cropperCancel')?.addEventListener('click', closeCropperModal);
  document.getElementById('cropperDone')?.addEventListener('click', finishCropAndUpload);


  // ======================================
  // 2. LOGIKA TEXT EDITOR (Team Table)
  // ======================================
  const textEditors = document.querySelectorAll('.secret-text-editor');
  textEditors.forEach(el => {
    const id = el.getAttribute('data-text-id');

    // Coba load dari LocalStorage
    const localData = localStorage.getItem('gate-text-' + id);
    if (localData) {
      renderTeamTable(localData);
    } else {
      // Fetch dari public path
      fetch(`data/${id}.json`)
        .then(res => {
          if (!res.ok) throw new Error('Not found');
          return res.text();
        })
        .then(textData => {
          renderTeamTable(textData);
          localStorage.setItem('gate-text-' + id, textData);
        }).catch(e => {
          console.log("No remote team data found yet.");
        });
    }

    let clickCount = 0;
    let lastClickTime = 0;

    const handleTap = (e) => {
      e.preventDefault(); 
      e.stopPropagation();
      const currentTime = new Date().getTime();
      if (currentTime - lastClickTime > 500) clickCount = 0;
      clickCount++;
      lastClickTime = currentTime;

      if (clickCount === 10) {
        clickCount = 0;
        openTextEditorModal(id);
      }
    };
    el.addEventListener('click', handleTap);
  });

  // Setup Modal Text Editor
  document.getElementById('textEditorCancel')?.addEventListener('click', closeTextEditorModal);
  document.getElementById('textEditorDone')?.addEventListener('click', finishTextEditorAndUpload);
});

// =============================================================================
// GITHUB UPLOAD ENGINE
// =============================================================================

function getGitHubToken() {
  let token = localStorage.getItem('gate-github-token');
  if (!token) return null;
  try {
    let decoded = atob(token);
    if (decoded.match(/^(ghp_|github_pat_|gho_|ghu_|ghs_|ghr_)/)) return decoded;
  } catch(e) {}
  return token;
}

function setGitHubToken(token) {
  localStorage.setItem('gate-github-token', btoa(token.trim()));
}

async function uploadToGitHub(id, base64Data) {
  const token = getGitHubToken();
  if (!token) return false;
  
  // Ekstrak base64 murni tanpa prefix
  const b64 = base64Data.split(',')[1];
  const path = `img/uploads/${id}.png`;
  const url = `https://api.github.com/repos/thaliban04/gate-puinter/contents/${path}`;
  
  let sha = null;
  try {
    const getRes = await fetch(url, { headers: { 'Authorization': `token ${token}` } });
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
      headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return putRes.ok;
  } catch(e) { return false; }
}

async function uploadTextToGitHub(id, textContent) {
  const token = getGitHubToken();
  if (!token) return false;
  
  // Encode string ke base64 (UTF-8 safe)
  const b64 = btoa(unescape(encodeURIComponent(textContent)));
  const path = `data/${id}.json`;
  const url = `https://api.github.com/repos/thaliban04/gate-puinter/contents/${path}`;
  
  let sha = null;
  try {
    const getRes = await fetch(url, { headers: { 'Authorization': `token ${token}` } });
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    }
  } catch(e) {}
  
  const body = {
    message: `Auto-upload text: ${id}.json via Text Editor UI`,
    content: b64,
    branch: 'main'
  };
  if (sha) body.sha = sha;
  
  try {
    const putRes = await fetch(url, {
      method: 'PUT',
      headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return putRes.ok;
  } catch(e) { return false; }
}

// =============================================================================
// IMAGE CROPPER LOGIC
// =============================================================================
async function startUploadProcess(el, id) {
  let token = getGitHubToken();
  if (!token) {
    token = prompt("🔒 FITUR ADMIN RAHASIA 🔒\n\nMasukkan 'GitHub Access Token':");
    if (!token || token.trim() === "") return;
    setGitHubToken(token);
  } else {
    setGitHubToken(token); // Ensure it is stored as base64
  }
  
  currentUploadId = id;
  currentUploaderEl = el;

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { openCropperModal(ev.target.result, el); };
    reader.readAsDataURL(file);
  };
  input.click();
}

function openCropperModal(imageSrc, el) {
  const modal = document.getElementById('cropperModal');
  const imageElement = document.getElementById('cropperImage');
  imageElement.src = imageSrc;
  modal.classList.add('show');
  document.body.classList.add('modal-open');

  showToast('🖼️ Editor Gambar Terbuka!');

  if (cropper) cropper.destroy();

  const styles = window.getComputedStyle(el);
  const isCircle = styles.borderRadius === '50%';
  const rect = el.getBoundingClientRect();
  const aspectRatio = isCircle ? 1 : (rect.width / rect.height);

  cropper = new Cropper(imageElement, {
    aspectRatio: aspectRatio,
    viewMode: 1, dragMode: 'move', background: false, autoCropArea: 1,
    responsive: true, restore: false, guides: true, center: true, highlight: false,
    cropBoxMovable: true, cropBoxResizable: true, toggleDragModeOnDblclick: false,
  });
}

function closeCropperModal() {
  document.getElementById('cropperModal').classList.remove('show');
  document.body.classList.remove('modal-open');
  if (cropper) { cropper.destroy(); cropper = null; }
}

async function finishCropAndUpload() {
  if (!cropper) return;
  const canvas = cropper.getCroppedCanvas({
    maxWidth: 1024, maxHeight: 1024, fillColor: '#fff',
    imageSmoothingEnabled: true, imageSmoothingQuality: 'high',
  });
  // Menggunakan webp untuk ukuran yang jauh lebih kecil (mencegah quota exceeded)
  const b64 = canvas.toDataURL('image/webp', 0.8);
  closeCropperModal();

  try {
    localStorage.setItem('gate-upload-' + currentUploadId, b64);
  } catch (e) {
    console.warn("LocalStorage penuh, membersihkan cache gambar lama...");
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('gate-upload-')) localStorage.removeItem(key);
    });
    try {
      localStorage.setItem('gate-upload-' + currentUploadId, b64);
    } catch(err) {
      console.error("Gagal menyimpan ke LocalStorage setelah dibersihkan", err);
    }
  }
  let imgOverlay = currentUploaderEl.querySelector('.upload-overlay');
  if(imgOverlay) { imgOverlay.src = b64; imgOverlay.style.display = 'block'; }
  
  currentUploaderEl.style.opacity = '0.5';
  const success = await uploadToGitHub(currentUploadId, b64);
  currentUploaderEl.style.opacity = '1';
  
  if (success) alert("✅ Gambar berhasil tersinkronisasi ke GitHub!");
  else alert("❌ Gagal mengunggah ke GitHub. Cek token Anda.");
}

// =============================================================================
// TEXT EDITOR LOGIC (TEAM TABLE)
// =============================================================================
function renderTeamTable(jsonStr) {
  try {
    const arr = JSON.parse(jsonStr);
    const tbody = document.getElementById('teamTableBody');
    if (!tbody || !Array.isArray(arr)) return;
    
    tbody.innerHTML = '';
    arr.forEach(item => {
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      const td2 = document.createElement('td');
      td1.textContent = item.nama || 'Unknown';
      td2.textContent = item.nrp || '-';
      tr.appendChild(td1);
      tr.appendChild(td2);
      tbody.appendChild(tr);
    });
  } catch(e) {
    console.error("Gagal merender tabel:", e);
  }
}

function openTextEditorModal(id) {
  let token = getGitHubToken();
  if (!token) {
    token = prompt("🔒 FITUR ADMIN RAHASIA 🔒\n\nMasukkan 'GitHub Access Token':");
    if (!token || token.trim() === "") return;
    setGitHubToken(token);
  }

  currentTextUploadId = id;
  const modal = document.getElementById('textEditorModal');
  const textarea = document.getElementById('textEditorInput');
  
  // Convert JSON to text representation
  const localData = localStorage.getItem('gate-text-' + id);
  if (localData) {
    try {
      const arr = JSON.parse(localData);
      textarea.value = arr.map(item => `${item.nama} - ${item.nrp}`).join('\n');
    } catch(e) { textarea.value = ''; }
  } else {
    textarea.value = '';
  }
  
  modal.classList.add('show');
  document.body.classList.add('modal-open');

  showToast('📝 Editor Data Kelompok Terbuka!');
}

function closeTextEditorModal() {
  document.getElementById('textEditorModal').classList.remove('show');
  document.body.classList.remove('modal-open');
}

async function finishTextEditorAndUpload() {
  const textarea = document.getElementById('textEditorInput');
  const lines = textarea.value.split('\n').map(l => l.trim()).filter(l => l);
  
  const arr = lines.map(line => {
    // Pisahkan berdasarkan tanda hubung (dash)
    const parts = line.split('-');
    return {
      nama: parts[0] ? parts[0].trim() : 'Tanpa Nama',
      nrp: parts[1] ? parts[1].trim() : '-'
    };
  });
  
  const jsonStr = JSON.stringify(arr, null, 2);
  
  // 1. Instant Render & Save Local
  renderTeamTable(jsonStr);
  localStorage.setItem('gate-text-' + currentTextUploadId, jsonStr);
  closeTextEditorModal();
  
  // 2. Upload to GitHub
  const success = await uploadTextToGitHub(currentTextUploadId, jsonStr);
  if (success) {
    alert("✅ Data kelompok berhasil diperbarui dan tersinkronisasi ke GitHub!");
  } else {
    alert("❌ Gagal mengunggah data ke GitHub. Cek token Anda.");
  }
}
