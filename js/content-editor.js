// =============================================================================
// CONTENT-EDITOR.JS — Universal Secret Content Editor (Tap 10x)
// Works for: plain text, HTML paragraphs, and tables
// Data is saved as JSON to GitHub repository via API
// =============================================================================

const REPO = 'thaliban04/gate-puinter';
let currentEditEl = null;
let currentEditId = null;
let currentEditType = null; // 'text' | 'table'

// =============================================================================
// INIT: scan all .secret-editable elements after modules load
// =============================================================================
document.addEventListener('modulesLoaded', () => {
  document.querySelectorAll('.secret-editable').forEach(el => {
    initContentEditable(el);
  });

  // Wire up modal Save button
  document.getElementById('contentEditorDone')
    ?.addEventListener('click', finishContentEdit);
});

function initContentEditable(el) {
  const id    = el.getAttribute('data-editable-id');
  const type  = el.getAttribute('data-editable-type') || 'text'; // 'text' or 'table'

  // Try to load saved data from localStorage first (fast), then GitHub
  const cached = localStorage.getItem(`gate-content-${id}`);
  if (cached) {
    applyContent(el, id, type, JSON.parse(cached));
  } else {
    fetchContentFromGitHub(id).then(data => {
      if (data) {
        localStorage.setItem(`gate-content-${id}`, JSON.stringify(data));
        applyContent(el, id, type, data);
      }
    });
  }

  // Attach 10x tap counter
  let clickCount = 0;
  let lastClickTime = 0;

  el.addEventListener('click', (e) => {
    e.stopPropagation();
    const now = Date.now();
    if (now - lastClickTime > 500) clickCount = 0;
    clickCount++;
    lastClickTime = now;

    if (clickCount === 10) {
      clickCount = 0;
      openContentEditorModal(el, id, type);
    }
  });
}

// =============================================================================
// APPLY SAVED CONTENT TO DOM
// =============================================================================
function applyContent(el, id, type, data) {
  if (type === 'text') {
    // data = { html: "..." }
    const target = el.querySelector('[data-editable-target]') || el;
    if (data.html !== undefined) target.innerHTML = data.html;
  } else if (type === 'table') {
    // data = { headers: [...], rows: [[...], ...] }
    const table = el.querySelector('table');
    if (!table || !data.rows) return;
    renderTableFromData(table, data);
  }
}

function renderTableFromData(tableEl, data) {
  tableEl.innerHTML = '';

  // Render header row if headers exist
  if (data.headers && data.headers.length > 0) {
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    data.headers.forEach(h => {
      const th = document.createElement('th');
      th.textContent = h;
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    tableEl.appendChild(thead);
  }

  // Render body rows
  const tbody = document.createElement('tbody');
  (data.rows || []).forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  tableEl.appendChild(tbody);
}

// =============================================================================
// OPEN MODAL — build editor UI based on type
// =============================================================================
function openContentEditorModal(el, id, type) {
  let token = localStorage.getItem('gate-github-token');
  if (!token) {
    token = prompt('🔒 FITUR ADMIN RAHASIA 🔒\n\nMasukkan GitHub Access Token:');
    if (!token || !token.trim()) return;
    localStorage.setItem('gate-github-token', token.trim());
  }

  currentEditEl   = el;
  currentEditId   = id;
  currentEditType = type;

  const title  = el.getAttribute('data-editable-title') || 'Edit Konten';
  const modal  = document.getElementById('contentEditorModal');
  const body   = document.getElementById('contentEditorBody');
  const titleEl = document.getElementById('contentEditorTitle');

  titleEl.textContent = title;
  body.innerHTML = '';

  if (type === 'text') {
    buildTextEditor(body, el);
  } else if (type === 'table') {
    buildTableEditor(body, el, id);
  }

  modal.classList.add('show');
  document.body.classList.add('modal-open'); // lock scroll

  // Tampilkan notifikasi agar user tahu editor sudah terbuka
  showToast('🛠️ Editor Rahasia Terbuka!');

  // Re-init lucide icons inside modal
  if (window.lucide) lucide.createIcons();
}

function closeContentEditorModal() {
  document.getElementById('contentEditorModal').classList.remove('show');
  document.body.classList.remove('modal-open'); // unlock scroll
}

// =============================================================================
// TEXT EDITOR
// =============================================================================
function buildTextEditor(body, el) {
  const target = el.querySelector('[data-editable-target]') || el;
  const currentText = target.innerText || target.textContent || '';

  const label = document.createElement('div');
  label.className = 'content-editor-field-label';
  label.textContent = 'Isi Teks';

  const ta = document.createElement('textarea');
  ta.id = 'contentEditorTextarea';
  ta.className = 'content-richtext-area';
  ta.value = currentText.trim();
  ta.placeholder = 'Ketikkan konten di sini...';

  const hint = document.createElement('div');
  hint.className = 'text-editor-help';
  hint.textContent = 'Teks yang Anda ketik akan langsung menggantikan konten yang ada.';

  body.appendChild(label);
  body.appendChild(ta);
  body.appendChild(hint);
}

// =============================================================================
// TABLE EDITOR
// =============================================================================
function buildTableEditor(body, el, id) {
  const table = el.querySelector('table');

  // Read current data from table DOM
  let headers = [];
  let rows = [];

  if (table) {
    const headerRow = table.querySelector('thead tr') || table.querySelector('tr');
    if (headerRow && table.querySelector('thead')) {
      headers = Array.from(headerRow.querySelectorAll('th,td')).map(c => c.textContent.trim());
    }

    const bodyRows = table.querySelectorAll('tbody tr, tr:not(thead tr)');
    bodyRows.forEach(tr => {
      rows.push(Array.from(tr.querySelectorAll('td,th')).map(c => c.textContent.trim()));
    });
  }

  // If no headers, build from first row keys
  if (headers.length === 0 && rows.length > 0) {
    headers = rows[0].map((_, i) => `Kolom ${i + 1}`);
  }

  const controls = document.createElement('div');
  controls.className = 'table-editor-controls';
  controls.innerHTML = `
    <button class="tbl-ctrl-btn" id="tblAddRow"><i data-lucide="plus" style="width:14px;height:14px;"></i> Tambah Baris</button>
    <button class="tbl-ctrl-btn" id="tblAddCol"><i data-lucide="columns" style="width:14px;height:14px;"></i> Tambah Kolom</button>
    <button class="tbl-ctrl-btn danger" id="tblDelRow"><i data-lucide="trash-2" style="width:14px;height:14px;"></i> Hapus Baris Terakhir</button>
    <button class="tbl-ctrl-btn danger" id="tblDelCol"><i data-lucide="x-square" style="width:14px;height:14px;"></i> Hapus Kolom Terakhir</button>
  `;

  const wrap = document.createElement('div');
  wrap.className = 'table-editor-wrap';

  const editorTable = document.createElement('table');
  editorTable.className = 'table-editor';
  editorTable.id = 'inlineTableEditor';

  function buildEditorTable() {
    editorTable.innerHTML = '';

    // Header row
    const thead = document.createElement('thead');
    const htr = document.createElement('tr');
    headers.forEach((h, ci) => {
      const th = document.createElement('th');
      const inp = document.createElement('input');
      inp.value = h;
      inp.dataset.col = ci;
      inp.addEventListener('input', () => { headers[ci] = inp.value; });
      th.appendChild(inp);
      htr.appendChild(th);
    });
    thead.appendChild(htr);
    editorTable.appendChild(thead);

    // Body rows
    const tbody = document.createElement('tbody');
    rows.forEach((row, ri) => {
      const tr = document.createElement('tr');
      headers.forEach((_, ci) => {
        const td = document.createElement('td');
        const inp = document.createElement('input');
        inp.value = row[ci] !== undefined ? row[ci] : '';
        inp.addEventListener('input', () => { rows[ri][ci] = inp.value; });
        td.appendChild(inp);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    editorTable.appendChild(tbody);

    if (window.lucide) lucide.createIcons();
  }

  buildEditorTable();
  wrap.appendChild(editorTable);
  body.appendChild(controls);
  body.appendChild(wrap);

  if (window.lucide) lucide.createIcons();

  // Controls
  document.getElementById('tblAddRow').onclick = () => {
    rows.push(new Array(headers.length).fill(''));
    buildEditorTable();
  };
  document.getElementById('tblAddCol').onclick = () => {
    headers.push(`Kolom ${headers.length + 1}`);
    rows.forEach(r => r.push(''));
    buildEditorTable();
  };
  document.getElementById('tblDelRow').onclick = () => {
    if (rows.length > 1) { rows.pop(); buildEditorTable(); }
  };
  document.getElementById('tblDelCol').onclick = () => {
    if (headers.length > 1) {
      headers.pop();
      rows.forEach(r => r.pop());
      buildEditorTable();
    }
  };

  // Store reference for save
  window._tableEditorData = { headers, rows };
}

// =============================================================================
// SAVE CONTENT
// =============================================================================
async function finishContentEdit() {
  const btn = document.getElementById('contentEditorDone');
  btn.textContent = 'Menyimpan...';
  btn.disabled = true;

  let data = {};

  if (currentEditType === 'text') {
    const ta = document.getElementById('contentEditorTextarea');
    data = { html: ta.value };

    // Apply to DOM immediately
    const target = currentEditEl.querySelector('[data-editable-target]') || currentEditEl;
    target.innerHTML = ta.value;

  } else if (currentEditType === 'table') {
    // Collect final values from inputs
    const editorTable = document.getElementById('inlineTableEditor');
    const headers = Array.from(editorTable.querySelectorAll('thead input')).map(i => i.value);
    const rows = Array.from(editorTable.querySelectorAll('tbody tr')).map(tr =>
      Array.from(tr.querySelectorAll('input')).map(i => i.value)
    );
    data = { headers, rows };

    // Apply to DOM immediately
    const table = currentEditEl.querySelector('table');
    if (table) renderTableFromData(table, data);
  }

  // Save to localStorage
  localStorage.setItem(`gate-content-${currentEditId}`, JSON.stringify(data));
  closeContentEditorModal();

  // Upload to GitHub
  const success = await uploadContentToGitHub(currentEditId, data);
  btn.textContent = 'Selesai & Simpan';
  btn.disabled = false;

  if (success) {
    showToast('✅ Perubahan berhasil disimpan & tersinkronisasi!');
  } else {
    showToast('❌ Gagal upload ke GitHub. Data tersimpan lokal saja.');
  }
}

// =============================================================================
// GITHUB API
// =============================================================================
async function fetchContentFromGitHub(id) {
  try {
    const url = `https://api.github.com/repos/${REPO}/contents/data/content-${id}.json`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const file = await res.json();
    const str = decodeURIComponent(escape(atob(file.content.replace(/\n/g, ''))));
    return JSON.parse(str);
  } catch (e) { return null; }
}

async function uploadContentToGitHub(id, data) {
  const token = localStorage.getItem('gate-github-token');
  if (!token) return false;

  const path = `data/content-${id}.json`;
  const url  = `https://api.github.com/repos/${REPO}/contents/${path}`;
  const b64  = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));

  let sha = null;
  try {
    const getRes = await fetch(url, { headers: { 'Authorization': `token ${token}` } });
    if (getRes.ok) { const f = await getRes.json(); sha = f.sha; }
  } catch (e) {}

  const body = { message: `Content update: ${id}`, content: b64, branch: 'main' };
  if (sha) body.sha = sha;

  try {
    const putRes = await fetch(url, {
      method: 'PUT',
      headers: { 'Authorization': `token ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return putRes.ok;
  } catch (e) { return false; }
}

// =============================================================================
// TOAST NOTIFICATION
// =============================================================================
function showToast(msg) {
  let toast = document.getElementById('gate-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'gate-toast';
    toast.style.cssText = `
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      background: var(--card); border: 1px solid var(--border-med);
      color: var(--text); padding: 14px 24px; border-radius: 50px;
      font-size: 0.9rem; font-weight: 500; z-index: 99999;
      box-shadow: 0 8px 32px rgba(0,0,0,0.25);
      transition: opacity 0.3s ease; opacity: 0;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 3500);
}
