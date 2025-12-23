//core-license-system.js

//CONSTRUCTOR
var OfflineLicenseSystem = function() {

    // Tambahkan di constructor OfflineLicenseSystem (sekitar line 6):
    this.serverUrl = ''; // Akan diisi dari localStorage
    this.isOnline = false;
    this.serverConfigKey = 'license_server_config';
    // Kode lisensi valid (bisa diubah oleh admin)
    this.validLicenseKeys = {
        'RH-MTV-1Q2W3E': { // Trial
            package: 'trial',
            expiryDays: 2,
            created: '2024-01-01'
        },
        'RH-MTV-4R5T6Y': { // Dasar
            package: 'basic', 
            expiryDays: 365,
            created: '2024-01-01'
        },
        'RH-MTV-7U8I9O': { // Premium
            package: 'premium',
            expiryDays: 365,
            created: '2024-01-01'
        },
        'RH-MTV-0PASD1': { // VIP
            package: 'vip',
            expiryDays: 9999,
            created: '2024-01-01'
        },
        'RH-MTV-VIP001': { // Kode khusus untuk user DEV-MJAH2YDI-GWZ450
            package: 'vip',
            expiryDays: 9999,
            created: '2025-12-18'
        },
        'RH-MTV-BAS001': { // Kode contoh untuk paket dasar
            package: 'basic',
            expiryDays: 365,
            created: '2025-12-18'
        },
        'RH-MTV-PRE001': { // Kode contoh untuk paket premium
            package: 'premium',
            expiryDays: 365,
            created: '2025-12-18'
        }
    };

    // Load validLicenseKeys dari localStorage (jika ada)
    this.loadValidLicenseKeys();
    
    // Data paket dengan fitur
    this.licensePackages = {
        'trial': {
            name: 'Uji Coba',
            price: 50000,
            features: {
                hiddenLogo: true,
                hiddenSlides: [2, 3, 4],
                hiddenPowerButton: true,
                hiddenVillageName: true,
                maxImages: 2,
                hiddenImsakSyuruq: true,  // INI AKAN HIDE BOTH IMSAK & SYURUQ
                maghribIsyaActiveMinutes: 15,
                hiddenSettingsButtons: ['data-masjid', 'running-text', 'slider-duration'],
                hiddenAdzanButtons: ['countdown-adzan', 'countdown-iqamah', 'overlay-duration'],
                hiddenAudio: ['shalawat', 'adzan'],
                ads: {
                    enabled: true,
                    duration: 15,
                    interval: 10,
                    overlayBehavior: 'behind'
                }
            }
        },
        'basic': {
            name: 'Dasar',
            price: 340000,
            features: {
                hiddenLogo: true,
                hiddenSlides: [2, 4],
                hiddenPowerButton: false,
                hiddenVillageName: false,
                maxImages: 2,
                hiddenImsakSyuruq: false,
                maghribIsyaActiveMinutes: 0,
                hiddenSettingsButtons: ['slider-duration'],
                hiddenAdzanButtons: ['overlay-duration'],
                hiddenAudio: ['shalawat', 'adzan'],
                ads: {
                    enabled: true,
                    duration: 5,
                    interval: 300,
                    overlayBehavior: 'behind'
                }
            }
        },
        'premium': {
            name: 'Premium',
            price: 570000,
            features: {
                hiddenLogo: false,
                hiddenSlides: [],
                hiddenPowerButton: false,
                hiddenVillageName: false,
                maxImages: 5,
                hiddenImsakSyuruq: false,
                maghribIsyaActiveMinutes: 0,
                hiddenSettingsButtons: [],
                hiddenAdzanButtons: [],
                hiddenAudio: [],
                ads: { enabled: false }
            }
        },
        'vip': {
            name: 'VIP',
            price: 1420000,
            features: {
                hiddenLogo: false,
                hiddenSlides: [],
                hiddenPowerButton: false,
                hiddenVillageName: false,
                maxImages: 7,
                hiddenImsakSyuruq: false,
                maghribIsyaActiveMinutes: 0,
                hiddenSettingsButtons: [],
                hiddenAdzanButtons: [],
                hiddenAudio: [],
                ads: { enabled: false }
            }
        }
    };
    
    this.currentLicense = null;
    this.deviceId = this.getDeviceId();
    this.adsTimer = null;
    this.isShowingAds = false;
    this.demoUsedKey = 'demo_used_' + this.deviceId;

    
    // Default gambar iklan
    this.adImages = [
        'ads/ad1.jpg',
        'ads/ad2.jpg',
        'ads/ad3.jpg'
    ];

};



// Metode inisialisasi dan core
// ==================== INISIALISASI ====================
OfflineLicenseSystem.prototype.initialize = function() {
    console.log('Sistem Lisensi Offline - Inisialisasi...');

      // 1. Inisialisasi server
    this.initServer();
    
    // 1. Tambahkan styles
    this.addStyles();
    
    // 2. Load license yang sudah ada
    this.loadLicense();
    
    // 3. Load validLicenseKeys dari localStorage
    this.loadValidLicenseKeys();
    
    // 4. Validasi license
    var isValid = this.validateLicense();
    
    // 5. Tampilkan popup sesuai status
    if (!isValid) {
        this.showActivationPopup();
    } else {
        // Terapkan fitur lisensi
        this.applyLicenseFeatures();
        
        // Tampilkan info lisensi singkat (bukan popup besar)
        this.showBriefLicenseInfo();
    }
    
    // 6. Setup iklan jika diperlukan
    this.setupAds();
    
    return isValid;
};


// ==================== FUNGSI BARU: KOMUNIKASI SERVER ====================
OfflineLicenseSystem.prototype.initServer = function() {
    try {
      var config = localStorage.getItem(this.serverConfigKey);
      if (config) {
        config = JSON.parse(config);
        this.serverUrl = config.url;
        this.isOnline = config.enabled;
      }
    } catch (error) {
      console.error('Error loading server config:', error);
      this.isOnline = false;
    }
  };
  
  OfflineLicenseSystem.prototype.saveServerConfig = function(url, enabled) {
    var config = {
      url: url,
      enabled: enabled
    };
    localStorage.setItem(this.serverConfigKey, JSON.stringify(config));
    this.serverUrl = url;
    this.isOnline = enabled;
  };
  
  OfflineLicenseSystem.prototype.testServerConnection = function(callback) {
    if (!this.serverUrl) {
      if (callback) callback(false, 'Server URL belum diatur');
      return;
    }
    
    var xhr = new XMLHttpRequest();
    xhr.timeout = 10000;
    xhr.open('GET', this.serverUrl, true);
    
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          var response = JSON.parse(xhr.responseText);
          if (callback) callback(true, 'Koneksi berhasil');
        } catch (e) {
          if (callback) callback(false, 'Respon server tidak valid');
        }
      } else {
        if (callback) callback(false, 'Server error: ' + xhr.status);
      }
    };
    
    xhr.onerror = function() {
      if (callback) callback(false, 'Tidak dapat terhubung ke server');
    };
    
    xhr.ontimeout = function() {
      if (callback) callback(false, 'Timeout menghubungi server');
    };
    
    try {
      xhr.send();
    } catch (error) {
      if (callback) callback(false, 'Error: ' + error);
    }
  };
  
  OfflineLicenseSystem.prototype.validateLicenseOnline = function(licenseKey, callback) {
    if (!this.isOnline || !this.serverUrl) {
      if (callback) callback(null);
      return;
    }
    
    var xhr = new XMLHttpRequest();
    xhr.open('POST', this.serverUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          var response = JSON.parse(xhr.responseText);
          if (callback) callback(response);
        } catch (e) {
          console.error('Error parsing server response:', e);
          if (callback) callback(null);
        }
      } else {
        if (callback) callback(null);
      }
    };
    
    xhr.onerror = function() {
      if (callback) callback(null);
    };
    
    var data = {
      action: 'validate',
      licenseKey: licenseKey,
      deviceId: this.deviceId
    };
    
    try {
      xhr.send(JSON.stringify(data));
    } catch (error) {
      if (callback) callback(null);
    }
  };
  
  OfflineLicenseSystem.prototype.syncToServer = function(licenses, callback) {
    if (!this.isOnline || !this.serverUrl) {
      if (callback) callback(false, 'Mode offline atau server belum diatur');
      return;
    }
    
    var xhr = new XMLHttpRequest();
    xhr.open('POST', this.serverUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          var response = JSON.parse(xhr.responseText);
          if (callback) callback(response.success, response.message);
        } catch (e) {
          if (callback) callback(false, 'Error parsing response');
        }
      } else {
        if (callback) callback(false, 'Server error: ' + xhr.status);
      }
    };
    
    xhr.onerror = function() {
      if (callback) callback(false, 'Tidak dapat terhubung ke server');
    };
    
    var data = {
      action: 'syncLicenses',
      licenses: licenses
    };
    
    try {
      xhr.send(JSON.stringify(data));
    } catch (error) {
      if (callback) callback(false, 'Error: ' + error);
    }
  };
  
  OfflineLicenseSystem.prototype.importFromServer = function(callback) {
    if (!this.isOnline || !this.serverUrl) {
      if (callback) callback(null, 'Mode offline atau server belum diatur');
      return;
    }
    
    var xhr = new XMLHttpRequest();
    xhr.open('POST', this.serverUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          var response = JSON.parse(xhr.responseText);
          if (response.success && response.data) {
            if (callback) callback(response.data, null);
          } else {
            if (callback) callback(null, response.message || 'Tidak ada data');
          }
        } catch (e) {
          if (callback) callback(null, 'Error parsing response');
        }
      } else {
        if (callback) callback(null, 'Server error: ' + xhr.status);
      }
    };
    
    xhr.onerror = function() {
      if (callback) callback(null, 'Tidak dapat terhubung ke server');
    };
    
    var data = {
      action: 'getAllLicenses'
    };
    
    try {
      xhr.send(JSON.stringify(data));
    } catch (error) {
      if (callback) callback(null, 'Error: ' + error);
    }
  };


// Manajemen lisensi
// ==================== LICENSE MANAGEMENT ====================
OfflineLicenseSystem.prototype.loadLicense = function() {
    try {
        var saved = localStorage.getItem('adzan_offline_license');
        if (saved) {
            this.currentLicense = JSON.parse(saved);
            console.log('Lisensi ditemukan:', this.currentLicense.package);
        }
    } catch (error) {
        console.error('Error loading license:', error);
        this.currentLicense = null;
    }
};

OfflineLicenseSystem.prototype.saveLicense = function() {
    try {
        localStorage.setItem('adzan_offline_license', JSON.stringify(this.currentLicense));
        
        // Juga simpan di key lama untuk kompatibilitas
        localStorage.setItem('adzanAppLicense', JSON.stringify({
            package: this.currentLicense.package,
            startDate: this.currentLicense.startDate,
            endDate: this.currentLicense.expiry,
            paymentStatus: this.currentLicense.status === 'active' ? 'paid' : 'pending'
        }));
        
        return true;
    } catch (error) {
        console.error('Error saving license:', error);
        return false;
    }
};

OfflineLicenseSystem.prototype.validateLicense = function() {
    if (!this.currentLicense) return false;
    
    // Cek format license
    if (!this.currentLicense.key || !this.currentLicense.expiry) {
        return false;
    }
    
    // Cek apakah kode masih valid
    var licenseInfo = this.validLicenseKeys[this.currentLicense.key];
    if (!licenseInfo) {
        console.log('License key not found in valid keys');
        return false;
    }
    
    // Cek expiry date
    var now = new Date();
    var expiry = new Date(this.currentLicense.expiry);
    
    if (now > expiry) {
        console.log('License expired');
        // Tampilkan popup expired
        this.showExpiredPopup();
        return false;
    }
    
    return true;
};

OfflineLicenseSystem.prototype.checkDemoEligibility = function() {
    var demoUsed = localStorage.getItem(this.demoUsedKey);
    
    if (demoUsed === 'true') {
        return {
            eligible: false,
            message: 'Mode demo sudah pernah digunakan pada perangkat ini'
        };
    }
    
    if (this.currentLicense && this.currentLicense.status !== 'demo') {
        return {
            eligible: false,
            message: 'Lisensi sudah aktif'
        };
    }
    
    return {
        eligible: true,
        message: 'Dapat menggunakan demo'
    };
};


// ==================== FUNGSI BARU: KELUAR DARI LISENSI ====================
OfflineLicenseSystem.prototype.deactivateLicense = function() {
    if (confirm('Apakah Anda yakin ingin keluar dari lisensi saat ini? Semua data lisensi akan dihapus.')) {
        // Hapus lisensi dari localStorage
        localStorage.removeItem('adzan_offline_license');
        localStorage.removeItem('adzanAppLicense');
        
        // Reset current license
        this.currentLicense = null;
        
        // Hentikan iklan jika berjalan
        if (this.adsTimer) {
            clearInterval(this.adsTimer);
            this.adsTimer = null;
        }
        
        // Tampilkan toast
        this.showToast('Lisensi berhasil dihapus. Silahkan aktivasi lisensi baru.', 'info');
        
        // Tampilkan popup aktivasi setelah 1 detik
        var self = this;
        setTimeout(function() {
            self.showActivationPopup();
        }, 1000);
        
        return true;
    }
    return false;
};

// ==================== FUNGSI BARU: CEK STATUS UPGRADE ====================
OfflineLicenseSystem.prototype.checkUpgradeEligibility = function() {
    if (!this.currentLicense) return false;
    
    var currentPackage = this.currentLicense.package;
    var packagesOrder = ['trial', 'basic', 'premium', 'vip'];
    var currentIndex = packagesOrder.indexOf(currentPackage);
    
    // Jika sudah VIP, tidak bisa upgrade
    if (currentIndex >= 3) {
        return {
            eligible: false,
            message: 'Anda sudah memiliki paket tertinggi (VIP)'
        };
    }
    
    // Hitung berapa hari tersisa
    var expiryDate = new Date(this.currentLicense.expiry);
    var now = new Date();
    var daysLeft = Math.ceil((expiryDate - now) / (1000 * 3600 * 24));
    
    // Jika masa aktif kurang dari 30 hari, beri rekomendasi upgrade
    var recommendation = '';
    if (daysLeft < 30) {
        recommendation = 'Masa aktif tersisa ' + daysLeft + ' hari. Disarankan untuk upgrade.';
    }
    
    return {
        eligible: true,
        currentPackage: currentPackage,
        nextPackage: packagesOrder[currentIndex + 1],
        daysLeft: daysLeft,
        recommendation: recommendation
    };
};

// ==================== ACTIVATION FUNCTIONS ====================
OfflineLicenseSystem.prototype.activateLicense = function(licenseKey) {
    licenseKey = licenseKey.toUpperCase().trim();

    if (!this.isValidLicenseFormat(licenseKey)) {
        return {
            success: false,
            message: 'Format kode lisensi tidak valid'
        };
    }

    // CEK KE validLicenseKeys (termasuk yang baru digenerate admin)
    var licenseInfo = this.validLicenseKeys[licenseKey];
    
    if (!licenseInfo) {
        // Cek juga ke generated_licenses untuk backup
        var generated = this.findGeneratedLicense(licenseKey);
        if (!generated) {
            return {
                success: false,
                message: 'Kode lisensi tidak ditemukan'
            };
        }
        
        // Jika ditemukan di generated_licenses tapi belum di validLicenseKeys,
        // tambahkan ke validLicenseKeys
        if (generated.status === 'pending') {
            licenseInfo = {
                package: generated.package,
                expiryDays: generated.expiryDays || 365,
                created: generated.created || new Date().toISOString().split('T')[0]
            };
            this.validLicenseKeys[licenseKey] = licenseInfo;
            this.saveValidLicenseKeys();
        } else if (generated.status === 'active') {
            return {
                success: false,
                message: 'Kode lisensi sudah digunakan'
            };
        }
    }

    // Hitung expiry
    var pkg = this.licensePackages[licenseInfo.package];
    var startDate = new Date();
    var expiryDate = new Date();

    if (licenseInfo.package === 'vip') {
        expiryDate.setFullYear(expiryDate.getFullYear() + 100);
    } else if (licenseInfo.package === 'trial') {
        expiryDate.setDate(expiryDate.getDate() + 2);
    } else {
        expiryDate.setDate(expiryDate.getDate() + 365);
    }

    // Simpan lisensi aktif
    this.currentLicense = {
        key: licenseKey,
        package: licenseInfo.package,
        startDate: startDate.toISOString(),
        expiry: expiryDate.toISOString(),
        deviceId: this.deviceId,
        activatedAt: new Date().toISOString(),
        status: 'active'
    };

    this.saveLicense();

    // Update status di generated_licenses jika ada
    var generated = this.findGeneratedLicense(licenseKey);
    if (generated) {
        generated.status = 'active';
        generated.activatedAt = new Date().toISOString();
        generated.activatedDevice = this.deviceId;
        
        var all = JSON.parse(localStorage.getItem('generated_licenses') || '[]');
        for (var i = 0; i < all.length; i++) {
            if (all[i].code === licenseKey) {
                all[i] = generated;
                break;
            }
        }
        localStorage.setItem('generated_licenses', JSON.stringify(all));
    }

    return {
        success: true,
        data: {
            package: licenseInfo.package,
            expiry: expiryDate.toISOString()
        }
    };
};


OfflineLicenseSystem.prototype.isValidLicenseFormat = function(key) {
    var pattern = /^RH-MTV-[A-Z0-9]{6}$/;
    return pattern.test(key);
};



// Manajemen kode lisensi
// ==================== FUNGSI BARU: GENERATE KODE LISENSI (untuk admin) ====================
OfflineLicenseSystem.prototype.generateLicenseCode = function(packageType, deviceId, customerName) {
    // Generate random code 6 karakter
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var result = '';
    for (var i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    var licenseCode = 'RH-MTV-' + result;
    
    // Tentukan expiry days berdasarkan paket
    var expiryDays = 365;
    if (packageType === 'vip') {
        expiryDays = 9999;
    } else if (packageType === 'trial') {
        expiryDays = 2;
    }
    
    // Tambahkan ke validLicenseKeys agar bisa langsung digunakan
    this.validLicenseKeys[licenseCode] = {
        package: packageType,
        expiryDays: expiryDays,
        created: new Date().toISOString().split('T')[0]
    };
    
    // Simpan data lisensi yang digenerate
    var licenseData = {
        code: licenseCode,
        package: packageType,
        expiryDays: expiryDays,
        created: new Date().toISOString().split('T')[0],
        deviceId: deviceId || 'N/A',
        customerName: customerName || 'Anonymous',
        generatedAt: new Date().toISOString(),
        status: 'pending' // pending, active, used
    };
    
    // Simpan ke localStorage (untuk simulasi, dalam real implementation ini dikirim ke server)
    var generatedLicenses = JSON.parse(localStorage.getItem('generated_licenses') || '[]');
    generatedLicenses.push(licenseData);
    localStorage.setItem('generated_licenses', JSON.stringify(generatedLicenses));
    
    // Juga simpan validLicenseKeys yang diperbarui ke localStorage untuk persistensi
    this.saveValidLicenseKeys();
    
    return licenseCode;
};

// ==================== FUNGSI BARU: SIMPAN VALID LICENSE KEYS ====================
OfflineLicenseSystem.prototype.saveValidLicenseKeys = function() {
    try {
        localStorage.setItem('valid_license_keys', JSON.stringify(this.validLicenseKeys));
        return true;
    } catch (error) {
        console.error('Error saving valid license keys:', error);
        return false;
    }
};

// ==================== FUNGSI BARU: LOAD VALID LICENSE KEYS ====================
OfflineLicenseSystem.prototype.loadValidLicenseKeys = function() {
    try {
        var saved = localStorage.getItem('valid_license_keys');
        if (saved) {
            var loadedKeys = JSON.parse(saved);
            // Gabungkan dengan default keys (jika ada key yang sama, gunakan yang dari localStorage)
            Object.assign(this.validLicenseKeys, loadedKeys);
            console.log('Loaded valid license keys from storage:', Object.keys(loadedKeys).length, 'keys');
        }
    } catch (error) {
        console.error('Error loading valid license keys:', error);
    }
};


OfflineLicenseSystem.prototype.findGeneratedLicense = function(code) {
    var list = JSON.parse(localStorage.getItem('generated_licenses') || '[]');
    for (var i = 0; i < list.length; i++) {
        if (list[i].code === code) {
            return list[i];
        }
    }
    return null;
};


