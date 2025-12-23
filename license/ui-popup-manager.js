ui-popup-manager.js

// Popup utama

// ==================== POPUP SYSTEM (DIPERBAIKI) ====================
OfflineLicenseSystem.prototype.showActivationPopup = function() {
    this.removeExistingPopup();
    
    var overlay = this.createOverlay();
    
    // Cek eligibility untuk demo terlebih dahulu
    var eligibility = this.checkDemoEligibility();
    var demoButtonHTML = '';
    
    if (eligibility.eligible) {
        demoButtonHTML = [
            '<button id="demoModeBtn" class="btn-demo-mode">',
            '    <i class="bi bi-play-circle"></i>',
            '    <span>COBA DEMO (15 MENIT)</span>',
            '</button>',
            '',
            '<div class="divider">',
            '    <span>ATAU</span>',
            '</div>'
        ].join('');
    } else {
        demoButtonHTML = [
            '<div class="demo-not-eligible alert alert-warning">',
            '    <i class="bi bi-exclamation-triangle"></i>',
            '    ' + eligibility.message,
            '</div>'
        ].join('');
    }
    
    overlay.innerHTML = [
        '<div class="offline-license-popup">',
        '    <div class="popup-header">',
        '        <div class="header-icon">',
        '            <i class="bi bi-shield-lock"></i>',
        '        </div>',
        '        <h2>AKTIVASI LISENSI OFFLINE</h2>',
        '        <p class="subtitle">Masukkan kode lisensi yang diberikan admin</p>',
        '    </div>',
        '    ',
        '    <div class="popup-body">',
        '        <div class="activation-card">',
        '            <div class="status-indicator inactive">',
        '                <div class="status-dot"></div>',
        '                <span>STATUS: BELUM AKTIF</span>',
        '            </div>',
        '            ',
        '            <div class="license-input-section">',
        '                <div class="input-group">',
        '                    <div class="input-label">',
        '                        <i class="bi bi-key-fill"></i>',
        '                        KODE LISENSI',
        '                    </div>',
        '                    <input ',
        '                        type="text" ',
        '                        id="offlineLicenseKey"',
        '                        placeholder="Contoh: RH-MTV-1Q2W3E"',
        '                        class="license-input"',
        '                        autocomplete="off"',
        '                        maxlength="14"',
        '                        autofocus',
        '                    />',
        '                    <div class="input-hint">',
        '                        Format: RH-MTV-XXXXXX (6 karakter/huruf)',
        '                    </div>',
        '                </div>',
        '                ',
        '                <div class="package-preview" id="packagePreview">',
        '                    <div class="preview-placeholder">',
        '                        <i class="bi bi-box"></i>',
        '                        <p>Paket akan terdeteksi otomatis</p>',
        '                    </div>',
        '                </div>',
        '            </div>',
        '            ',
        '            <div class="action-section">',
        '                <button id="activateOfflineBtn" class="btn-activate-large">',
        '                    <i class="bi bi-check-circle"></i>',
        '                    <span>AKTIVASI LISENSI</span>',
        '                </button>',
        '                ',
        '                <div class="divider">',
        '                    <span>ATAU</span>',
        '                </div>',
        '                ',
        demoButtonHTML,
        '                ',
        '                <button id="contactAdminBtn" class="btn-contact">',
        '                    <i class="bi bi-whatsapp"></i>',
        '                    <span>HUBUNGI ADMIN</span>',
        '                </button>',
        '                ',
        '                <button id="enterAdminPanelBtn" class="btn-admin-panel">',
        '                    <i class="bi bi-person-badge"></i>',
        '                    <span>PANEL ADMIN</span>',
        '                </button>',
        '            </div>',
        '            ',
        '            <div class="info-section">',
        '                <div class="info-box">',
        '                    <h4><i class="bi bi-info-circle"></i> CARA MENDAPATKAN KODE:</h4>',
        '                    <ol>',
        '                        <li>Hubungi admin via WhatsApp</li>',
        '                        <li>Pilih paket yang diinginkan</li>',
        '                        <li>Lakukan pembayaran</li>',
        '                        <li>Admin akan kirim kode lisensi</li>',
        '                        <li>Masukkan kode di atas</li>',
        '                    </ol>',
        '                </div>',
        '                ',
        '                <div class="device-info">',
        '                    <p><strong>ID Perangkat Anda:</strong></p>',
        '                    <code class="device-id">' + this.deviceId + '</code>',
        '                    <button onclick="copyToClipboard(\'' + this.deviceId + '\')" class="btn-copy">',
        '                        <i class="bi bi-copy"></i> Salin ID',
        '                    </button>',
        '                </div>',
        '                ',
        '                <div class="contact-details">',
        '                    <p><i class="bi bi-whatsapp"></i> <strong>Admin:</strong> 089609745090</p>',
        '                    <p><i class="bi bi-envelope"></i> <strong>Email:</strong> mahallahtv@gmail.com</p>',
        '                </div>',
        '            </div>',
        '        </div>',
        '    </div>',
        '</div>'
    ].join('');
    
    document.body.appendChild(overlay);
    
    this.setupActivationEvents(overlay);
    this.setupPackagePreview();
    this.darkenBackground();
    
    // Adjust height setelah render
    var self = this;
    setTimeout(function() {
        self.adjustPopupHeight();
    }, 100);
};


// ==================== FUNGSI BARU: SHOW EXPIRED POPUP ====================
OfflineLicenseSystem.prototype.showExpiredPopup = function() {
    this.removeExistingPopup();
    
    var overlay = this.createOverlay();
    overlay.style.pointerEvents = 'auto';
    
    overlay.innerHTML = [
        '<div class="offline-license-popup expired">',
        '    <div class="popup-header expired">',
        '        <div class="header-icon">',
        '            <i class="bi bi-exclamation-triangle-fill"></i>',
        '        </div>',
        '        <h2>LISENSI KADALUARSA</h2>',
        '        <p class="subtitle">Aplikasi terkunci hingga diperpanjang</p>',
        '    </div>',
        '    ',
        '    <div class="popup-body">',
        '        <div class="expired-warning-card">',
        '            <div class="warning-icon">',
        '                <i class="bi bi-lock-fill"></i>',
        '            </div>',
        '            ',
        '            <h3>MASA AKTIF TELAH BERAKHIR</h3>',
        '            ',
        '            <div class="warning-message">',
        '                <p>Aplikasi tidak dapat digunakan karena lisensi telah habis masa berlakunya.</p>',
        '                <p>Untuk melanjutkan penggunaan, silahkan perpanjang lisensi.</p>',
        '            </div>',
        '            ',
        '            <div class="package-comparison">',
        '                <h4><i class="bi bi-gift"></i> PAKET TERSEDIA:</h4>',
        '                <div class="packages-grid">',
        '                    <div class="package-card basic">',
        '                        <h5>DASAR</h5>',
        '                        <div class="price">Rp 340.000</div>',
        '                        <div class="duration">1 TAHUN</div>',
        '                        <ul>',
        '                            <li>2 Gambar</li>',
        '                            <li>Iklan terbatas</li>',
        '                            <li>Audio terbatas</li>',
        '                        </ul>',
        '                    </div>',
        '                    ',
        '                    <div class="package-card premium">',
        '                        <div class="popular-badge">POPULER</div>',
        '                        <h5>PREMIUM</h5>',
        '                        <div class="price">Rp 570.000</div>',
        '                        <div class="duration">1 TAHUN</div>',
        '                        <ul>',
        '                            <li>5 Gambar</li>',
        '                            <li>Tanpa iklan</li>',
        '                            <li>Audio lengkap</li>',
        '                        </ul>',
        '                    </div>',
        '                    ',
        '                    <div class="package-card vip">',
        '                        <div class="vip-badge">VIP</div>',
        '                        <h5>VIP</h5>',
        '                        <div class="price">Rp 1.420.000</div>',
        '                        <div class="duration">SEUMUR HIDUP</div>',
        '                        <ul>',
        '                            <li>7 Gambar</li>',
        '                            <li>Semua fitur</li>',
        '                            <li>+ STB & Kabel HDMI</li>',
        '                        </ul>',
        '                    </div>',
        '                </div>',
        '            </div>',
        '            ',
        '            <div class="contact-actions">',
        '                <a href="https://wa.me/6289609745090?text=Halo%20Admin,%20saya%20ingin%20perpanjang%20lisensi%20Adzan%20App.%20ID%20Perangkat:%20' + encodeURIComponent(this.deviceId) + '" ',
        '                   target="_blank" class="btn-whatsapp">',
        '                    <i class="bi bi-whatsapp"></i> HUBUNGI ADMIN VIA WHATSAPP',
        '                </a>',
        '                ',
        '                <button onclick="copyToClipboard(\'' + this.deviceId + '\')" class="btn-copy-id">',
        '                    <i class="bi bi-copy"></i> SALIN ID PERANGKAT',
        '                </button>',
        '                ',
        '                <button id="tryDemoAgainBtn" class="btn-demo-again">',
        '                    <i class="bi bi-play-circle"></i> COBA DEMO LAGI (15 MENIT)',
        '                </button>',
        '            </div>',
        '        </div>',
        '    </div>',
        '    ',
        '    <div class="popup-footer">',
        '        <div class="cannot-close-warning">',
        '            <i class="bi bi-shield-exclamation"></i>',
        '            APLIKASI TERKUNCI SAMPAI LISENSI DIPERPANJANG',
        '        </div>',
        '    </div>',
        '</div>'
    ].join('');
    
    document.body.appendChild(overlay);
    
    var self = this;
    
    // Event listener untuk demo again
    document.getElementById('tryDemoAgainBtn').addEventListener('click', function() {
        self.activateDemoMode();
        self.removePopup(overlay);
    });
    
    this.disableAppInteractions();
    
    // Adjust height setelah render
    setTimeout(function() {
        self.adjustPopupHeight();
    }, 100);
};

// ==================== TAMBAHKAN FUNGSI SHOW DEMO INFO ====================
OfflineLicenseSystem.prototype.showDemoInfoPopup = function() {
    this.removeExistingPopup();
    
    var overlay = this.createOverlay();
    
    overlay.innerHTML = [
        '<div class="offline-license-popup">',
        '    <div class="popup-header">',
        '        <h2>MODE DEMO AKTIF</h2>',
        '        <p class="subtitle">Semua fitur terbuka selama 15 menit</p>',
        '    </div>',
        '    ',
        '    <div class="popup-body">',
        '        <div class="license-details-card">',
        '            <div class="status-indicator active">',
        '                <div class="status-dot"></div>',
        '                <span>STATUS: MODE DEMO</span>',
        '            </div>',
        '            ',
        '            <div class="demo-features">',
        '                <h4><i class="bi bi-stars"></i> Fitur yang Aktif:</h4>',
        '                <ul>',
        '                    <li class="feature-active">',
        '                        <i class="bi bi-images"></i> Slide Gambar: 7 gambar maksimal',
        '                    </li>',
        '                    <li class="feature-active">',
        '                        <i class="bi bi-music-note-beamed"></i> Audio: Lengkap (Shalawat & Adzan)',
        '                    </li>',
        '                    <li class="feature-active">',
        '                        <i class="bi bi-megaphone"></i> Iklan: Tidak ada iklan',
        '                    </li>',
        '                    <li class="feature-active">',
        '                        <i class="bi bi-sliders"></i> Pengaturan: Semua tombol tersedia',
        '                    </li>',
        '                    <li class="feature-active">',
        '                        <i class="bi bi-clock"></i> Waktu Adzan: Semua pengaturan terbuka',
        '                    </li>',
        '                    <li class="feature-active">',
        '                        <i class="bi bi-display"></i> Semua Slide: Terbuka lengkap',
        '                    </li>',
        '                </ul>',
        '            </div>',
        '            ',
        '            <div class="demo-warning">',
        '                <h4><i class="bi bi-exclamation-triangle"></i> Perhatian:</h4>',
        '                <p>Mode demo akan berakhir dalam 15 menit. Setelah itu, Anda perlu mengaktifkan lisensi untuk melanjutkan penggunaan.</p>',
        '            </div>',
        '            ',
        '            <div class="action-buttons">',
        '                <button id="activateNowBtn" class="btn-activate-large">',
        '                    <i class="bi bi-key-fill"></i> AKTIVASI LISENSI SEKARANG',
        '                </button>',
        '                <button id="closeDemoInfoBtn" class="btn-close">',
        '                    <i class="bi bi-check-lg"></i> LANJUTKAN DEMO',
        '                </button>',
        '            </div>',
        '        </div>',
        '    </div>',
        '    ',
        '    <div class="popup-footer">',
        '        <div class="demo-timer">',
        '            <i class="bi bi-clock"></i>',
        '            <span>Waktu tersisa: <span id="demoTimeRemaining">15:00</span></span>',
        '        </div>',
        '    </div>',
        '</div>'
    ].join('');
    
    document.body.appendChild(overlay);
    
    var self = this;
    
    // Hitung waktu tersisa
    var expiryDate = new Date(this.currentLicense.expiry);
    var now = new Date();
    var timeRemaining = Math.floor((expiryDate - now) / 1000); // dalam detik
    
    function updateTimer() {
        var minutes = Math.floor(timeRemaining / 60);
        var seconds = timeRemaining % 60;
        var timeString = minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
        
        var timerElement = document.getElementById('demoTimeRemaining');
        if (timerElement) {
            timerElement.textContent = timeString;
        }
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            self.showExpiredPopup();
        }
        
        timeRemaining--;
    }
    
    var timerInterval = setInterval(updateTimer, 1000);
    updateTimer(); // Panggil sekali untuk inisialisasi
    
    document.getElementById('activateNowBtn').addEventListener('click', function() {
        clearInterval(timerInterval);
        self.removePopup(overlay);
        self.showActivationPopup();
    });
    
    document.getElementById('closeDemoInfoBtn').addEventListener('click', function() {
        clearInterval(timerInterval);
        self.removePopup(overlay);
    });
};

// ==================== FUNGSI BARU: PANEL ADMIN ONLINE ====================
OfflineLicenseSystem.prototype.showAdminPanel = function(password) {
    if (password !== 'admin123') {
      this.showToast('Password admin salah!', 'error');
      return;
    }
    
    this.removeExistingPopup();
    var overlay = this.createOverlay();
    
    // Generate license list HTML
    var generatedLicenses = JSON.parse(localStorage.getItem('generated_licenses') || '[]');
    var licenseListHTML = '';
    
    if (generatedLicenses.length > 0) {
      licenseListHTML = '<table class="admin-table">' +
        '<thead>' +
          '<tr>' +
            '<th>Kode</th>' +
            '<th>Paket</th>' +
            '<th>Device ID</th>' +
            '<th>Customer</th>' +
            '<th>Tanggal</th>' +
            '<th>Status</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>';
      
      for (var i = 0; i < generatedLicenses.length; i++) {
        var license = generatedLicenses[i];
        var isCurrentDevice = (license.deviceId === this.deviceId) ? 'current-device' : '';
        
        licenseListHTML += '<tr class="' + isCurrentDevice + '">' +
          '<td><code>' + license.code + '</code></td>' +
          '<td>' + (license.package || 'N/A') + '</td>' +
          '<td>' + (license.deviceId || 'N/A') + '</td>' +
          '<td>' + (license.customerName || 'N/A') + '</td>' +
          '<td>' + new Date(license.generatedAt).toLocaleDateString('id-ID') + '</td>' +
          '<td><span class="status-badge ' + license.status + '">' + license.status.toUpperCase() + '</span></td>' +
        '</tr>';
      }
      
      licenseListHTML += '</tbody></table>';
    } else {
      licenseListHTML = '<div class="empty-state">' +
        '<i class="bi bi-inbox"></i>' +
        '<p>Belum ada kode lisensi yang digenerate</p>' +
      '</div>';
    }
    
    overlay.innerHTML = [
      '<div class="offline-license-popup admin">',
      '    <div class="popup-header">',
      '        <h2>PANEL ADMIN LISENSI ONLINE</h2>',
      '        <p class="subtitle">Generate, Sync, dan Kelola Kode Lisensi</p>',
      '    </div>',
      '    ',
      '    <div class="popup-body">',
      '        <div class="admin-panel">',
      '            <div class="admin-section">',
      '                <h4><i class="bi bi-plus-circle"></i> Generate Kode Baru</h4>',
      '                <div class="admin-form">',
      '                    <div class="form-group">',
      '                        <label><i class="bi bi-box"></i> Pilih Paket</label>',
      '                        <select id="adminPackageSelect" class="admin-select">',
      '                            <option value="trial">Uji Coba (2 hari)</option>',
      '                            <option value="basic">Dasar (1 tahun)</option>',
      '                            <option value="premium">Premium (1 tahun)</option>',
      '                            <option value="vip">VIP (Seumur Hidup)</option>',
      '                        </select>',
      '                    </div>',
      '                    ',
      '                    <div class="form-group">',
      '                        <label><i class="bi bi-laptop"></i> ID Perangkat</label>',
      '                        <input type="text" id="adminDeviceId" class="admin-input" value="' + this.deviceId + '" readonly>',
      '                    </div>',
      '                    ',
      '                    <div class="form-group">',
      '                        <label><i class="bi bi-person"></i> Nama Customer</label>',
      '                        <input type="text" id="adminCustomerName" class="admin-input" placeholder="Nama customer">',
      '                    </div>',
      '                    ',
      '                    <button id="generateLicenseBtn" class="btn-admin-generate">',
      '                        <i class="bi bi-magic"></i> GENERATE KODE LISENSI',
      '                    </button>',
      '                </div>',
      '            </div>',
      '            ',
      '            <div class="admin-section">',
      '                <h4><i class="bi bi-cloud-upload"></i> Konfigurasi Server</h4>',
      '                <div class="admin-form">',
      '                    <div class="form-group">',
      '                        <label><i class="bi bi-link"></i> Server URL (Google Apps Script)</label>',
      '                        <input type="text" id="serverUrl" class="admin-input" placeholder="https://script.google.com/macros/s/.../exec">',
      '                    </div>',
      '                    ',
      '                    <div class="form-group">',
      '                        <label><i class="bi bi-toggle-on"></i> Mode Online</label>',
      '                        <div style="display: flex; align-items: center; gap: 10px;">',
      '                            <input type="checkbox" id="onlineMode" style="transform: scale(1.2);">',
      '                            <span>Aktifkan validasi online</span>',
      '                        </div>',
      '                    </div>',
      '                    ',
      '                    <div class="admin-actions" style="margin-top: 15px;">',
      '                        <button id="testServerBtn" class="btn-admin-secondary">',
      '                            <i class="bi bi-wifi"></i> Test Koneksi',
      '                        </button>',
      '                        <button id="saveServerConfigBtn" class="btn-admin-generate">',
      '                            <i class="bi bi-save"></i> Simpan Konfigurasi',
      '                        </button>',
      '                    </div>',
      '                </div>',
      '            </div>',
      '            ',
      '            <div class="admin-section">',
      '                <h4><i class="bi bi-list-check"></i> Kode yang Telah Digenerate</h4>',
      '                <div class="license-list">',
      licenseListHTML,
      '                </div>',
      '                <div class="admin-actions">',
      '                    <button id="syncToServerBtn" class="btn-admin-generate">',
      '                        <i class="bi bi-cloud-upload"></i> Sync ke Server',
      '                    </button>',
      '                    <button id="importFromServerBtn" class="btn-admin-secondary">',
      '                        <i class="bi bi-cloud-download"></i> Import dari Server',
      '                    </button>',
      '                    <button id="exportLicensesBtn" class="btn-admin-secondary">',
      '                        <i class="bi bi-download"></i> Export ke CSV',
      '                    </button>',
      '                    <button id="clearLicensesBtn" class="btn-admin-danger">',
      '                        <i class="bi bi-trash"></i> Hapus Semua',
      '                    </button>',
      '                </div>',
      '            </div>',
      '            ',
      '            <div class="admin-section">',
      '                <h4><i class="bi bi-gear"></i> Pengaturan Sistem</h4>',
      '                <div class="system-settings">',
      '                    <div class="setting-item">',
      '                        <label><i class="bi bi-shield-check"></i> Valid License Keys</label>',
      '                        <div class="setting-value">' + Object.keys(this.validLicenseKeys).length + ' kode aktif</div>',
      '                    </div>',
      '                    ',
      '                    <div class="setting-item">',
      '                        <label><i class="bi bi-device-ssd"></i> Device ID Aktif</label>',
      '                        <div class="setting-value">' + this.deviceId + '</div>',
      '                    </div>',
      '                    ',
      '                    <div class="setting-item">',
      '                        <label><i class="bi bi-clock-history"></i> Lisensi Saat Ini</label>',
      '                        <div class="setting-value">' + (this.currentLicense ? this.currentLicense.package : 'Tidak ada') + '</div>',
      '                    </div>',
      '                    ',
      '                    <div class="setting-item">',
      '                        <label><i class="bi bi-cloud"></i> Status Server</label>',
      '                        <div class="setting-value" id="serverStatusDisplay">' + (this.isOnline ? 'ONLINE' : 'OFFLINE') + '</div>',
      '                    </div>',
      '                </div>',
      '            </div>',
      '            ',
      '            <button id="closeAdminPanelBtn" class="btn-admin-close">',
      '                <i class="bi bi-x-lg"></i> TUTUP PANEL',
      '            </button>',
      '            <div class="admin-info">',
      '                <p><i class="bi bi-info-circle"></i> Panel Admin - Hanya untuk penggunaan internal</p>',
      '            </div>',
      '        </div>',
      '    </div>',
      '    ',
      '</div>'
    ].join('');
    
    document.body.appendChild(overlay);
    this.darkenBackground();
    
    var self = this;
    
    // Load server config
    var config = JSON.parse(localStorage.getItem(this.serverConfigKey) || '{"url":"","enabled":false}');
    document.getElementById('serverUrl').value = config.url || '';
    document.getElementById('onlineMode').checked = config.enabled || false;
    
    // Event Listeners untuk Admin Panel Online
    document.getElementById('generateLicenseBtn').addEventListener('click', function() {
      var packageType = document.getElementById('adminPackageSelect').value;
      var deviceId = document.getElementById('adminDeviceId').value || 'N/A';
      var customerName = document.getElementById('adminCustomerName').value || 'Anonymous';
      
      if (!customerName.trim()) {
        self.showToast('Masukkan nama customer!', 'error');
        return;
      }
      
      var licenseCode = self.generateLicenseCode(packageType, deviceId, customerName);
      
      // Tampilkan popup hasil
      self.showLicenseResultPopup(licenseCode, packageType, customerName, deviceId);
    });
    
    // Test server connection
    document.getElementById('testServerBtn').addEventListener('click', function() {
      var url = document.getElementById('serverUrl').value;
      if (!url) {
        self.showToast('Masukkan URL server terlebih dahulu', 'error');
        return;
      }
      
      self.testServerConnection(function(success, message) {
        if (success) {
          self.showToast('Koneksi server berhasil!', 'success');
          document.getElementById('serverStatusDisplay').textContent = 'ONLINE';
          document.getElementById('serverStatusDisplay').style.color = '#28a745';
        } else {
          self.showToast('Koneksi gagal: ' + message, 'error');
          document.getElementById('serverStatusDisplay').textContent = 'OFFLINE';
          document.getElementById('serverStatusDisplay').style.color = '#dc3545';
        }
      });
    });
    
    // Save server config
    document.getElementById('saveServerConfigBtn').addEventListener('click', function() {
      var url = document.getElementById('serverUrl').value;
      var enabled = document.getElementById('onlineMode').checked;
      
      if (!url && enabled) {
        self.showToast('URL server harus diisi untuk mode online', 'error');
        return;
      }
      
      self.saveServerConfig(url, enabled);
      self.showToast('Konfigurasi server disimpan', 'success');
      document.getElementById('serverStatusDisplay').textContent = enabled ? 'ONLINE' : 'OFFLINE';
      document.getElementById('serverStatusDisplay').style.color = enabled ? '#28a745' : '#dc3545';
    });
    
    // Sync to server
    document.getElementById('syncToServerBtn').addEventListener('click', function() {
      var generatedLicenses = JSON.parse(localStorage.getItem('generated_licenses') || '[]');
      
      if (generatedLicenses.length === 0) {
        self.showToast('Tidak ada data lisensi untuk disync', 'warning');
        return;
      }
      
      self.syncToServer(generatedLicenses, function(success, message) {
        if (success) {
          self.showToast(message, 'success');
        } else {
          self.showToast('Sync gagal: ' + message, 'error');
        }
      });
    });
    
    // Import from server
    document.getElementById('importFromServerBtn').addEventListener('click', function() {
      self.importFromServer(function(data, error) {
        if (error) {
          self.showToast('Import gagal: ' + error, 'error');
          return;
        }
        
        if (data && data.length > 0) {
          // Update validLicenseKeys dengan data dari server
          for (var i = 0; i < data.length; i++) {
            var license = data[i];
            if (license.status === 'active' || license.status === 'pending') {
              self.validLicenseKeys[license.LicenseKey] = {
                package: license.Package,
                expiryDays: license.Package === 'vip' ? 9999 : 365,
                created: license.CreatedDate || new Date().toISOString().split('T')[0]
              };
            }
          }
          
          // Save validLicenseKeys
          self.saveValidLicenseKeys();
          
          // Update generated_licenses
          var formattedLicenses = data.map(function(item) {
            return {
              code: item.LicenseKey,
              package: item.Package,
              deviceId: item.DeviceId,
              customerName: item.CustomerName,
              created: item.CreatedDate,
              expiry: item.ExpiryDate,
              status: item.Status,
              activatedAt: item.ActivatedAt,
              generatedAt: item.CreatedDate || new Date().toISOString()
            };
          });
          
          localStorage.setItem('generated_licenses', JSON.stringify(formattedLicenses));
          
          self.showToast('Berhasil import ' + data.length + ' lisensi dari server', 'success');
          
          // Refresh admin panel
          setTimeout(function() {
            self.showAdminPanel('admin123');
          }, 1000);
        }
      });
    });
    
    // Event listener untuk export
    document.getElementById('exportLicensesBtn').addEventListener('click', function() {
        self.exportLicensesToCSV();
    });
    
    // Event listener untuk clear
    document.getElementById('clearLicensesBtn').addEventListener('click', function() {
        if (confirm('Hapus semua data lisensi yang telah digenerate?')) {
            localStorage.removeItem('generated_licenses');
            self.showToast('Data lisensi berhasil dihapus', 'success');
            setTimeout(function() {
                self.showAdminPanel('admin123'); // Refresh panel
            }, 1000);
        }
    });
    
    // Event listener untuk close
    document.getElementById('closeAdminPanelBtn').addEventListener('click', function() {
        self.switchPopup(self.showActivationPopup);
    });

    
    // Adjust height setelah render
    setTimeout(function() {
        self.adjustPopupHeight();
    }, 100);
};


// ==================== FUNGSI BARU: SHOW LICENSE RESULT POPUP ====================
OfflineLicenseSystem.prototype.showLicenseResultPopup = function(licenseCode, packageType, customerName, deviceId) {
    this.removeExistingPopup();
    
    var overlay = this.createOverlay();
    var packageData = this.licensePackages[packageType];
    
    overlay.innerHTML = [
      '<div class="offline-license-popup">',
      '    <div class="popup-header">',
      '        <button class="close-popup-btn" onclick="window.location.reload()" style="position: absolute; top: 15px; right: 15px; background: none; border: none; color: white; font-size: 24px; cursor: pointer;">',
      '            <i class="bi bi-x-lg"></i>',
      '        </button>',
      '        <h2>KODE LISENSI BERHASIL DIGENERATE</h2>',
      '        <p class="subtitle">' + packageData.name + ' - ' + customerName + '</p>',
      '    </div>',
      '    ',
      '    <div class="popup-body">',
      '        <div class="license-result-popup">',
      '            <div class="result-icon">',
      '                <i class="bi bi-check-circle"></i>',
      '            </div>',
      '            ',
      '            <div class="result-details">',
      '                <div class="result-item">',
      '                    <label>Kode Lisensi:</label>',
      '                    <div class="result-value license-code">' + licenseCode + '</div>',
      '                </div>',
      '                ',
      '                <div class="result-item">',
      '                    <label>Paket:</label>',
      '                    <div class="result-value">' + packageData.name + '</div>',
      '                </div>',
      '                ',
      '                <div class="result-item">',
      '                    <label>Customer:</label>',
      '                    <div class="result-value">' + customerName + '</div>',
      '                </div>',
      '                ',
      '                <div class="result-item">',
      '                    <label>Device ID:</label>',
      '                    <div class="result-value">' + deviceId + '</div>',
      '                </div>',
      '                ',
      '                <div class="result-item">',
      '                    <label>Status:</label>',
      '                    <div class="result-value"><span class="status-badge pending">PENDING</span></div>',
      '                </div>',
      '            </div>',
      '            ',
      '            <div class="result-actions">',
      '                <button onclick="copyToClipboard(\'' + licenseCode + '\')" class="btn-copy-admin">',
      '                    <i class="bi bi-copy"></i> Salin Kode',
      '                </button>',
      '                <button onclick="window.open(\'https://wa.me/6289609745090?text=Kode%20Lisensi:%20' + encodeURIComponent(licenseCode) + '%0APaket:%20' + encodeURIComponent(packageData.name) + '%0ACustomer:%20' + encodeURIComponent(customerName) + '\', \'_blank\')" class="btn-whatsapp-admin">',
      '                    <i class="bi bi-whatsapp"></i> Kirim via WhatsApp',
      '                </button>',
      '            </div>',
      '            ',
      '            <div class="result-note">',
      '                <p><i class="bi bi-info-circle"></i> Kode ini telah tersimpan di database lokal dan siap digunakan.</p>',
      '                <p>Klik tombol "Sync ke Server" di Panel Admin untuk menyimpan ke database online.</p>',
      '            </div>',
      '        </div>',
      '    </div>',
      '    ',
      '    <div class="popup-footer">',
      '        <button class="btn-close" onclick="window.location.reload()">',
      '            <i class="bi bi-check-lg"></i> TUTUP & RELOAD',
      '        </button>',
      '    </div>',
      '</div>'
    ].join('');
    
    document.body.appendChild(overlay);
    this.darkenBackground();
  };



// Fungsi UI helper
// ==================== HELPER FUNCTIONS ====================
OfflineLicenseSystem.prototype.createOverlay = function() {
    var overlay = document.createElement('div');
    overlay.id = 'offlineLicenseOverlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.92)';
    overlay.style.zIndex = '99999';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'flex-start';
    overlay.style.justifyContent = 'center';
    overlay.style.padding = '20px';
    overlay.style.animation = 'fadeIn 0.4s ease';
    overlay.style.overflowY = 'auto';
    overlay.style.overflowX = 'hidden';
    return overlay;
};

OfflineLicenseSystem.prototype.removeExistingPopup = function() {
    var existing = document.getElementById('offlineLicenseOverlay');
    if (existing && existing.parentNode) {
        existing.parentNode.removeChild(existing);
    }
    this.restoreBackground();
};

OfflineLicenseSystem.prototype.setupActivationEvents = function(overlay) {
    var self = this;
    var activateBtn = overlay.querySelector('#activateOfflineBtn');
    var licenseInput = overlay.querySelector('#offlineLicenseKey');
    
    if (!activateBtn || !licenseInput) {
        console.error('Element not found for activation events');
        return;
    }
    
    // Event untuk fokus pada input
    licenseInput.addEventListener('focus', function() {
        self.toggleFocusedInputMode(true, overlay);
    });
    
    // Event untuk klik di dalam input group (jika user klik area sekitar input)
    var inputGroup = overlay.querySelector('.input-group');
    if (inputGroup) {
        inputGroup.addEventListener('click', function(e) {
            if (e.target !== licenseInput && !licenseInput.matches(':focus')) {
                licenseInput.focus();
            }
        });
    }
    
    activateBtn.addEventListener('click', function() {
        self.processActivation(overlay, activateBtn, licenseInput);
    });
    
    licenseInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            self.processActivation(overlay, activateBtn, licenseInput);
        }
    });
    
    // CEK ELEMEN SEBELUM MENAMBAHKAN EVENT LISTENER
    var demoModeBtn = overlay.querySelector('#demoModeBtn');
    if (demoModeBtn) {
        demoModeBtn.addEventListener('click', function() {
            self.activateDemoMode();
            self.removePopup(overlay);
        });
    }
    
    var contactAdminBtn = overlay.querySelector('#contactAdminBtn');
    if (contactAdminBtn) {
        contactAdminBtn.addEventListener('click', function() {
            window.open('https://wa.me/6289609745090?text=Halo%20Admin,%20saya%20ingin%20membeli%20lisensi%20Adzan%20App.%20ID%20Perangkat:%20' + encodeURIComponent(self.deviceId), '_blank');
        });
    }
    
    // Event listener untuk panel admin
    var enterAdminPanelBtn = overlay.querySelector('#enterAdminPanelBtn');
    if (enterAdminPanelBtn) {
        enterAdminPanelBtn.addEventListener('click', function() {
            var password = prompt('Masukkan password admin:');
            if (password) {
                self.showAdminPanel(password);
            }
        });
    }

    
    // Setup package preview
    this.setupPackagePreview();
};

OfflineLicenseSystem.prototype.processActivation = function(overlay, activateBtn, licenseInput) {
    var self = this;
    var licenseKey = licenseInput.value.trim();
    
    if (!licenseKey) {
      this.showToast('Masukkan kode lisensi', 'error');
      licenseInput.focus();
      return;
    }
    
    activateBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> MEMPROSES...';
    activateBtn.disabled = true;
    
    // Cek validasi online terlebih dahulu
    if (this.isOnline && this.serverUrl) {
      this.validateLicenseOnline(licenseKey, function(onlineResult) {
        if (onlineResult && onlineResult.success) {
          // Kode valid di server, proses aktivasi
          self.completeActivation(overlay, activateBtn, licenseInput, licenseKey, onlineResult.data);
        } else {
          // Kode tidak valid di server, coba offline
          self.processActivationOffline(overlay, activateBtn, licenseInput, licenseKey);
        }
      });
    } else {
      // Mode offline, gunakan validasi lokal
      this.processActivationOffline(overlay, activateBtn, licenseInput, licenseKey);
    }
  };

OfflineLicenseSystem.prototype.removePopup = function(overlay) {
    if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
    }
    this.restoreBackground();
};

OfflineLicenseSystem.prototype.switchPopup = function(nextPopupFn) {
    this.removeExistingPopup();
    var self = this;
    setTimeout(function() {
        nextPopupFn.call(self);
    }, 50);
};



// Mode input fokus
// ==================== FUNGSI BARU: TOGGLE FOCUSED INPUT MODE ====================
OfflineLicenseSystem.prototype.toggleFocusedInputMode = function(enable, overlay) {
    var popup = overlay.querySelector('.offline-license-popup');
    var licenseInput = overlay.querySelector('#offlineLicenseKey');
    var inputGroup = overlay.querySelector('.input-group');
    var packagePreview = overlay.querySelector('#packagePreview');
    
    if (!popup || !inputGroup) return;
    
    if (enable) {
        // Masuk ke mode fokus
        popup.classList.add('focused-input-mode');
        
        // Tampilkan preview jika ada konten
        if (packagePreview && packagePreview.innerHTML.trim()) {
            packagePreview.style.display = 'block';
            packagePreview.style.visibility = 'visible';
            packagePreview.style.opacity = '1';
        }
        
        // Buat tombol close
        var closeBtn = document.createElement('button');
        closeBtn.className = 'close-focused-btn';
        closeBtn.innerHTML = '<i class="bi bi-x-lg"></i>';
        closeBtn.addEventListener('click', function() {
            this.toggleFocusedInputMode(false, overlay);
        }.bind(this));
        
        popup.appendChild(closeBtn);
        
        // Buat tombol validasi di dalam input
        var validationIcons = document.createElement('div');
        validationIcons.className = 'input-validation-icons';
        
        var validIcon = document.createElement('button');
        validIcon.className = 'validation-icon valid disabled';
        validIcon.innerHTML = '<i class="bi bi-check-lg"></i>';
        validIcon.title = 'Kode valid - Klik untuk aktivasi';
        validIcon.addEventListener('click', function() {
            if (!validIcon.classList.contains('disabled')) {
                this.processActivation(overlay, overlay.querySelector('#activateOfflineBtn'), licenseInput);
            }
        }.bind(this));
        
        var invalidIcon = document.createElement('button');
        invalidIcon.className = 'validation-icon invalid disabled';
        invalidIcon.innerHTML = '<i class="bi bi-x-lg"></i>';
        invalidIcon.title = 'Kode tidak valid';
        invalidIcon.addEventListener('click', function() {
            this.showToast('Kode lisensi tidak valid', 'error');
            licenseInput.focus();
        }.bind(this));
        
        validationIcons.appendChild(validIcon);
        validationIcons.appendChild(invalidIcon);
        inputGroup.appendChild(validationIcons);
        
        // Setup real-time validation
        this.setupRealTimeValidation(licenseInput, validIcon, invalidIcon);
        
        // Update preview berdasarkan nilai saat ini
        if (licenseInput.value) {
            licenseInput.dispatchEvent(new Event('input'));
        }
        
        // Fokuskan input
        setTimeout(function() {
            licenseInput.focus();
            licenseInput.select();
        }, 300);
        
    } else {
        // Keluar dari mode fokus
        popup.classList.remove('focused-input-mode');
        
        // Hapus tombol close
        var closeBtn = popup.querySelector('.close-focused-btn');
        if (closeBtn) {
            closeBtn.remove();
        }
        
        // Hapus tombol validasi
        var validationIcons = inputGroup.querySelector('.input-validation-icons');
        if (validationIcons) {
            validationIcons.remove();
        }
        
        // Reset fokus
        licenseInput.blur();
    }
};

// ==================== FUNGSI BARU: SETUP REAL-TIME VALIDATION ====================
OfflineLicenseSystem.prototype.setupRealTimeValidation = function(licenseInput, validIcon, invalidIcon) {
    var self = this;
    
    licenseInput.addEventListener('input', function() {
      var key = this.value.toUpperCase().trim();
      
      // Reset kedua tombol
      validIcon.style.display = 'none';
      invalidIcon.style.display = 'none';
      
      // Trigger update package preview
      if (typeof self.updatePackagePreview === 'function') {
        self.updatePackagePreview(key);
      }
      
      if (!key) {
        return;
      }
      
      // Cek format
      if (!self.isValidLicenseFormat(key)) {
        invalidIcon.style.display = 'flex';
        validIcon.style.display = 'none';
        return;
      }
      
      // Cek validasi online jika mode online aktif
      if (self.isOnline && self.serverUrl) {
        self.validateLicenseOnline(key, function(onlineResult) {
          if (onlineResult) {
            if (onlineResult.success) {
              // Kode valid
              validIcon.style.display = 'flex';
              invalidIcon.style.display = 'none';
            } else {
              // Kode tidak valid
              invalidIcon.style.display = 'flex';
              validIcon.style.display = 'none';
            }
          } else {
            // Fallback ke validasi offline
            self.checkLicenseOffline(key, validIcon, invalidIcon);
          }
        });
      } else {
        // Mode offline, gunakan validasi lokal
        self.checkLicenseOffline(key, validIcon, invalidIcon);
      }
    });
    
    // Juga cek saat ini
    if (licenseInput.value) {
      licenseInput.dispatchEvent(new Event('input'));
    }
  };


  OfflineLicenseSystem.prototype.setupPackagePreview = function() {
    var self = this;
    var licenseInput = document.getElementById('offlineLicenseKey');
    
    if (!licenseInput) return;
    
    // Setup auto-format
    this.setupLicenseInputAutoFormat();
    
    // Setup event listener untuk input
    licenseInput.addEventListener('input', function(e) {
      var key = e.target.value.toUpperCase().trim();
      self.updatePackagePreview(key);
    });
  };


// ==================== FUNGSI BARU: UPDATE PACKAGE PREVIEW DENGAN VALIDASI ONLINE ====================
OfflineLicenseSystem.prototype.updatePackagePreview = function(key) {
    var packagePreview = document.getElementById('packagePreview');
    if (!packagePreview) return;
    
    // Format key untuk validasi
    var formattedKey = this.formatLicenseKeyInput(key);
    
    if (!key) {
      packagePreview.innerHTML = [
        '<div class="preview-placeholder">',
        '    <i class="bi bi-box"></i>',
        '    <p>Paket akan terdeteksi otomatis</p>',
        '</div>'
      ].join('');
      return;
    }
    
    var self = this;
    
    // Cek validasi online jika mode online aktif
    if (this.isOnline && this.serverUrl) {
      this.validateLicenseOnline(formattedKey, function(onlineResult) {
        if (onlineResult) {
          if (onlineResult.success) {
            // Kode valid di server
            var licenseInfo = onlineResult.data;
            var packageData = self.licensePackages[licenseInfo.package];
            
            packagePreview.innerHTML = [
              '<div class="package-detected ' + licenseInfo.package + '">',
              '    <div class="package-icon">',
              '        <i class="bi bi-shield-check"></i>',
              '    </div>',
              '    <div class="package-info">',
              '        <h4>' + packageData.name + ' (Online)</h4>',
              '        <p>Status: ' + (licenseInfo.status || 'Pending') + '</p>',
              '        <div class="package-features">',
              '            <span><i class="bi bi-images"></i> ' + packageData.features.maxImages + ' gambar</span>',
              '            <span><i class="bi ' + (packageData.features.hiddenAudio.length === 0 ? 'bi-check-lg' : 'bi-x-lg') + '"></i> Audio</span>',
              '            <span><i class="bi ' + (packageData.features.ads.enabled ? 'bi-x-lg' : 'bi-check-lg') + '"></i> Iklan</span>',
              '        </div>',
              '    </div>',
              '</div>'
            ].join('');
          } else {
            // Kode tidak valid di server
            var errorMessage = onlineResult.message;
            var errorCode = onlineResult.code;
            
            var icon = 'bi-exclamation-circle';
            var title = 'Kode Tidak Valid';
            
            if (errorCode === 'USED') {
              icon = 'bi-person-x';
              title = 'Kode Terpakai';
            } else if (errorCode === 'EXPIRED') {
              icon = 'bi-calendar-x';
              title = 'Kode Kadaluarsa';
            }
            
            packagePreview.innerHTML = [
              '<div class="package-invalid">',
              '    <div class="package-icon">',
              '        <i class="bi ' + icon + '"></i>',
              '    </div>',
              '    <div class="package-info">',
              '        <h4>' + title + '</h4>',
              '        <p>' + errorMessage + '</p>',
              '    </div>',
              '</div>'
            ].join('');
          }
        } else {
          // Fallback ke validasi offline
          self.updatePackagePreviewOffline(key, packagePreview);
        }
      });
    } else {
      // Mode offline, gunakan validasi lokal
      this.updatePackagePreviewOffline(key, packagePreview);
    }
  };


// Utility UI
// ==================== FUNGSI BARU: ADJUST POPUP HEIGHT ====================
OfflineLicenseSystem.prototype.adjustPopupHeight = function() {
    var popup = document.querySelector('.offline-license-popup');
    if (!popup) return;
    
    var viewportHeight = window.innerHeight;
    var popupHeight = popup.offsetHeight;
    var maxHeight = viewportHeight * 0.9;
    
    if (popupHeight > maxHeight) {
        popup.style.maxHeight = maxHeight + 'px';
        
        var body = popup.querySelector('.popup-body');
        if (body) {
            var header = popup.querySelector('.popup-header');
            var footer = popup.querySelector('.popup-footer');
            var headerHeight = header ? header.offsetHeight : 0;
            var footerHeight = footer ? footer.offsetHeight : 0;
            
            body.style.maxHeight = (maxHeight - headerHeight - footerHeight - 40) + 'px';
            body.style.overflowY = 'auto';
        }
    } else {
        popup.style.maxHeight = 'none';
        
        var body = popup.querySelector('.popup-body');
        if (body) {
            body.style.maxHeight = 'none';
            body.style.overflowY = 'visible';
        }
    }
    
    // Center the popup vertically if it's smaller than viewport
    if (popupHeight < viewportHeight * 0.8) {
        popup.style.marginTop = ((viewportHeight - popupHeight) / 2 - 20) + 'px';
    } else {
        popup.style.marginTop = '20px';
    }
};


OfflineLicenseSystem.prototype.darkenBackground = function() {
    var elements = document.querySelectorAll('body > *:not(#offlineLicenseOverlay)');
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.filter = 'brightness(0.3) blur(2px)';
        elements[i].style.pointerEvents = 'none';
    }
};


OfflineLicenseSystem.prototype.restoreBackground = function() {
    var elements = document.querySelectorAll('body > *:not(#offlineLicenseOverlay)');
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.filter = '';
        elements[i].style.pointerEvents = '';
    }
};


OfflineLicenseSystem.prototype.disableAppInteractions = function() {
    var elements = document.querySelectorAll('body > *:not(#offlineLicenseOverlay)');
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.pointerEvents = 'none';
        elements[i].style.opacity = '0.2';
        elements[i].style.filter = 'blur(3px)';
    }
};
