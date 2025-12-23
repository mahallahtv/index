// features-applier.js

// Penerapan fitur
// ==================== APPLY LICENSE FEATURES ====================
OfflineLicenseSystem.prototype.applyLicenseFeatures = function() {
    if (!this.currentLicense) {
        console.log('Tidak ada lisensi aktif');
        return;
    }
    
    var packageData = this.licensePackages[this.currentLicense.package];
    if (!packageData) {
        console.log('Paket tidak ditemukan:', this.currentLicense.package);
        return;
    }
    
    var features = packageData.features;
    console.log('Menerapkan fitur untuk paket:', this.currentLicense.package);
    
    // 1. Hidden logo jika diperlukan
    if (features.hiddenLogo) {
        this.hideElement('#masjidLogo');
    }
    
    // 2. Hidden slide tertentu
    this.setupLeftCarouselForLicense(features.hiddenSlides);

    
    // 3. Hidden tombol ON/OFF
    if (features.hiddenPowerButton) {
        this.hideElement('#screenOffBtn');
    }
    
    // 4. Hidden nama desa dari alamat
    if (features.hiddenVillageName) {
        this.modifyAddress();
    }
    
    // 5. Batasi jumlah gambar
    this.limitImages(features.maxImages);
    
    // 6. Hidden card Imsak dan Syuruq
    if (features.hiddenImsakSyuruq) {
        this.hideElement('#timeImsak');
        this.hideElement('#timeSyuruq');
        this.hideElement('#thSyuruq');
        
        // TAMBAHKAN INI UNTUK HIDE HEADER IMSAK JUGA:
        var thImsak = document.getElementById('thImsak');
        if (thImsak) {
            thImsak.style.display = 'none';
        }
    }
    
    // 7. Teks Maghrib & Isya aktif hanya 15 menit pertama (untuk trial)
    if (features.maghribIsyaActiveMinutes > 0) {
        this.handleMaghribIsyaTimer(features.maghribIsyaActiveMinutes);
    }
    
    // 8. Hidden tombol pengaturan
    for (var j = 0; j < features.hiddenSettingsButtons.length; j++) {
        var buttonType = features.hiddenSettingsButtons[j];
        this.hideSettingsButton(buttonType);
    }
    
    // 9. Hidden tombol atur waktu adzan
    for (var k = 0; k < features.hiddenAdzanButtons.length; k++) {
        var adzanButtonType = features.hiddenAdzanButtons[k];
        this.hideAdzanButton(adzanButtonType);
    }
    
    // 10. Hidden audio
    for (var l = 0; l < features.hiddenAudio.length; l++) {
        var audioType = features.hiddenAudio[l];
        this.disableAudio(audioType);
    }
    
    // Update UI dengan info lisensi
    this.updateLicenseUI();
};


// ==================== TAMBAHKAN FUNGSI BARU: applyDemoFeatures ====================
OfflineLicenseSystem.prototype.applyDemoFeatures = function() {
    console.log('Menerapkan semua fitur untuk mode demo');
    
    // 1. Tampilkan logo jika sebelumnya tersembunyi
    this.showElement('#masjidLogo');
    
    // 2. Tampilkan semua slide
    for (var i = 1; i <= 4; i++) {
        this.showElement('#slide' + i);
    }
    
    // 3. Tampilkan tombol ON/OFF
    this.showElement('#screenOffBtn');
    
    // 4. Tampilkan nama desa lengkap (jika ada)
    this.restoreAddress();
    
    // 5. Batalkan pembatasan gambar (gunakan maksimal 7 gambar seperti VIP)
    this.limitImages(7);
    
    // 6. Tampilkan card Imsak dan Syuruq
    this.showElement('#timeImsak');
    this.showElement('#timeSyuruq');
    this.showElement('#thSyuruq');
    
    // 7. Nonaktifkan timer Maghrib & Isya (tampilkan terus)
    this.showElement('#timeMaghrib');
    this.showElement('#timeIsya');
    
    // 8. Tampilkan semua tombol pengaturan
    this.showAllSettingsButtons();
    
    // 9. Tampilkan semua tombol atur waktu adzan
    this.showAllAdzanButtons();
    
    // 10. Aktifkan semua audio
    this.enableAllAudio();
    
    // 11. Matikan iklan selama demo
    if (this.adsTimer) {
        clearInterval(this.adsTimer);
        this.adsTimer = null;
    }
    
    // Update UI dengan info demo
    this.updateDemoUI();
};

// TAMBAHKAN FUNGSI INI SEBELUM applyLicenseFeatures:
OfflineLicenseSystem.prototype.setupLeftCarouselForLicense = function(hiddenSlides) {
    // Simpan hidden slides ke localStorage
    localStorage.setItem('license_hidden_slides', JSON.stringify(hiddenSlides || []));
    
    // Panggil fungsi loadLeftCarousel jika ada
    if (typeof window.loadLeftCarousel === 'function') {
        setTimeout(function() {
            window.loadLeftCarousel();
        }, 100);
    }
};


// Helper fitur
// ==================== HELPER FUNCTIONS FOR FEATURES ====================
OfflineLicenseSystem.prototype.hideElement = function(selector) {
    var element = document.querySelector(selector);
    if (element) {
        element.style.display = 'none';
    }
};

// ==================== TAMBAHKAN FUNGSI HELPER BARU ====================
OfflineLicenseSystem.prototype.showElement = function(selector) {
    var element = document.querySelector(selector);
    if (element) {
        element.style.display = '';
    }
};


OfflineLicenseSystem.prototype.modifyAddress = function() {
    var addressElement = document.getElementById('masjidAddress');
    if (addressElement) {
        var address = addressElement.textContent;
        var modifiedAddress = address.replace(/Desa\s+\w+,?\s*/i, '');
        addressElement.textContent = modifiedAddress || 'Masjid Al-Muthmainnah';
    }
};


OfflineLicenseSystem.prototype.restoreAddress = function() {
    var addressElement = document.getElementById('masjidAddress');
    if (addressElement) {
        // Kembalikan alamat asli atau default
        addressElement.textContent = addressElement.getAttribute('data-original-address') || 'Masjid Al-Muthmainnah';
    }
};


OfflineLicenseSystem.prototype.limitImages = function(maxImages) {
    if (typeof settings !== 'undefined' && settings.uploadedImages) {
        if (settings.uploadedImages.length > maxImages) {
            settings.uploadedImages = settings.uploadedImages.slice(0, maxImages);
            if (typeof saveSettings === 'function') {
                saveSettings();
            }
        }
        
        if (typeof loadMainCarousel === 'function') {
            loadMainCarousel();
        }
    }
};


/ GANTI FUNGSI handleMaghribIsyaTimer MENJADI INI:
OfflineLicenseSystem.prototype.handleMaghribIsyaTimer = function(minutes) {
    var firstOpenKey = 'firstOpenTime';
    var firstOpenTime = localStorage.getItem(firstOpenKey);
    
    if (!firstOpenTime) {
        firstOpenTime = new Date().getTime();
        localStorage.setItem(firstOpenKey, firstOpenTime);
    }
    
    var now = new Date().getTime();
    var timeDiff = now - parseInt(firstOpenTime);
    var minutesDiff = timeDiff / (1000 * 60);
    
    if (minutesDiff > minutes) {
        // GANTI TEKS HEADER MENJADI "-----" BUKAN HIDE ELEMENT
        var headerRow = document.getElementById('jadwalHeader');
        if (headerRow) {
            var headers = headerRow.getElementsByTagName('th');
            for (var i = 0; i < headers.length; i++) {
                var headerText = headers[i].textContent.trim();
                if (headerText === 'Maghrib' || headerText === 'Isya') {
                    headers[i].textContent = '-----';
                }
            }
        }
        
        // JANGAN hideElement, tapi biarkan waktu tetap tampil
        // Hanya header yang diganti
    }
};

OfflineLicenseSystem.prototype.hideSettingsButton = function(buttonType) {
    var selector = '';
    
    switch(buttonType) {
        case 'data-masjid':
            selector = 'button[data-bs-target="#offcanvasDataMasjid"]';
            break;
        case 'running-text':
            selector = 'button[data-bs-target="#offcanvasRunningText"]';
            break;
        case 'slider-duration':
            selector = 'button[onclick="showSliderSettingsForm()"]';
            break;
    }
    
    if (selector) {
        this.hideElement(selector);
    }
};


OfflineLicenseSystem.prototype.hideAdzanButton = function(buttonType) {
    var self = this;
    setTimeout(function() {
        var modal = document.getElementById('prayerSettingsModal');
        if (modal) {
            var buttonSelector = '';
            
            if (buttonType === 'countdown-adzan') {
                buttonSelector = 'button[onclick*="adzan"]';
            } else if (buttonType === 'countdown-iqamah') {
                buttonSelector = 'button[onclick*="iqamah"]';
            } else if (buttonType === 'overlay-duration') {
                buttonSelector = 'button[onclick*="overlay"]';
            }
            
            if (buttonSelector) {
                var buttons = modal.querySelectorAll(buttonSelector);
                for (var i = 0; i < buttons.length; i++) {
                    buttons[i].style.display = 'none';
                }
            }
        }
    }, 1000);
};

OfflineLicenseSystem.prototype.disableAudio = function(audioType) {
    var audioId = '';
    
    switch(audioType) {
        case 'shalawat':
            audioId = 'audioShalawat';
            break;
        case 'adzan':
            audioId = 'audioAdzan';
            break;
    }
    
    if (audioId) {
        var audioElement = document.getElementById(audioId);
        if (audioElement) {
            audioElement.src = '';
            audioElement.removeAttribute('src');
        }
    }
};


OfflineLicenseSystem.prototype.enableAllAudio = function() {
    var audioIds = ['audioShalawat', 'audioAdzan'];
    
    for (var i = 0; i < audioIds.length; i++) {
        var audioElement = document.getElementById(audioIds[i]);
        if (audioElement) {
            // Setel kembali sumber audio default jika ada
            if (audioIds[i] === 'audioShalawat') {
                audioElement.src = 'audio/shalawat.mp3';
            } else if (audioIds[i] === 'audioAdzan') {
                audioElement.src = 'audio/adzan.mp3';
            }
        }
    }
};


OfflineLicenseSystem.prototype.showAllSettingsButtons = function() {
    var selectors = [
        'button[data-bs-target="#offcanvasDataMasjid"]',
        'button[data-bs-target="#offcanvasRunningText"]',
        'button[onclick="showSliderSettingsForm()"]'
    ];
    
    for (var i = 0; i < selectors.length; i++) {
        this.showElement(selectors[i]);
    }
};

OfflineLicenseSystem.prototype.showAllAdzanButtons = function() {
    var self = this;
    setTimeout(function() {
        var modal = document.getElementById('prayerSettingsModal');
        if (modal) {
            var buttonSelectors = [
                'button[onclick*="adzan"]',
                'button[onclick*="iqamah"]',
                'button[onclick*="overlay"]'
            ];
            
            for (var i = 0; i < buttonSelectors.length; i++) {
                var buttons = modal.querySelectorAll(buttonSelectors[i]);
                for (var j = 0; j < buttons.length; j++) {
                    buttons[j].style.display = '';
                }
            }
        }
    }, 1000);
};


// Manajemen iklan
// ==================== ADS MANAGEMENT ====================
OfflineLicenseSystem.prototype.setupAds = function() {
    if (!this.currentLicense) return;
    
    var packageData = this.licensePackages[this.currentLicense.package];
    if (!packageData.features.ads.enabled) return;
    
    var adsConfig = packageData.features.ads;
    var self = this;
    
    this.adsTimer = setInterval(function() {
        self.showAd(adsConfig);
    }, adsConfig.interval * 60 * 1000);
    
    setTimeout(function() {
        self.showAd(adsConfig);
    }, 10000);
};

OfflineLicenseSystem.prototype.showAd = function(adsConfig) {
    var blackOverlay = document.getElementById('blackOverlay');
    var screenBlack = document.getElementById('screenblack');
    
    if ((blackOverlay && blackOverlay.style.display === 'block') || 
        (screenBlack && screenBlack.style.display === 'block')) {
        
        if (adsConfig.overlayBehavior === 'behind') {
            console.log('Iklan berjalan di belakang overlay');
            return;
        }
    }
    
    if (this.isShowingAds) return;
    
    this.isShowingAds = true;
    
    var randomAd = this.adImages[Math.floor(Math.random() * this.adImages.length)];
    
    var adOverlay = document.createElement('div');
    adOverlay.id = 'adOverlay';
    adOverlay.style.position = 'fixed';
    adOverlay.style.top = '0';
    adOverlay.style.left = '0';
    adOverlay.style.width = '100%';
    adOverlay.style.height = '100%';
    adOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    adOverlay.style.zIndex = '99990';
    adOverlay.style.display = 'flex';
    adOverlay.style.alignItems = 'center';
    adOverlay.style.justifyContent = 'center';
    adOverlay.style.flexDirection = 'column';
    
    adOverlay.innerHTML = [
        '<div style="max-width: 90%; max-height: 90%;">',
        '    <img src="' + randomAd + '" alt="Iklan" style="width: 100%; height: auto; border-radius: 10px;">',
        '</div>',
        '<div id="adCountdown" style="color: white; font-size: 24px; margin-top: 20px; font-weight: bold;">',
        '    ' + adsConfig.duration,
        '</div>'
    ].join('');
    
    document.body.appendChild(adOverlay);
    
    var countdown = adsConfig.duration;
    var countdownElement = document.getElementById('adCountdown');
    var self = this;
    
    var countdownInterval = setInterval(function() {
        countdown--;
        if (countdownElement) {
            countdownElement.textContent = countdown;
        }
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            self.removeAd(adOverlay);
        }
    }, 1000);
    
    adOverlay.addEventListener('click', function() {
        clearInterval(countdownInterval);
        self.removeAd(adOverlay);
    });
};

OfflineLicenseSystem.prototype.removeAd = function(adOverlay) {
    if (adOverlay && adOverlay.parentNode) {
        adOverlay.parentNode.removeChild(adOverlay);
    }
    this.isShowingAds = false;
};


// ==================== UTILITY FUNCTIONS ====================
OfflineLicenseSystem.prototype.updateLicenseUI = function() {
    if (!this.currentLicense) return;
    
    var packageData = this.licensePackages[this.currentLicense.package];
    var endDate = new Date(this.currentLicense.expiry);
    var daysLeft = Math.ceil((endDate - new Date()) / (1000 * 3600 * 24));
    
    var packageElement = document.getElementById('licensePackage');
    var statusElement = document.getElementById('licenseStatusText');
    var expiryElement = document.getElementById('licenseExpiryDate');
    var daysLeftElement = document.getElementById('licenseDaysLeft');
    
    if (packageElement) {
        packageElement.textContent = packageData.name;
    }
    
    if (statusElement) {
        if (daysLeft > 7) {
            statusElement.className = 'badge bg-success';
            statusElement.textContent = 'Aktif';
        } else if (daysLeft > 0) {
            statusElement.className = 'badge bg-warning';
            statusElement.textContent = 'Hampir Habis';
        } else {
            statusElement.className = 'badge bg-danger';
            statusElement.textContent = 'Kadaluarsa';
        }
    }
    
    if (expiryElement) {
        expiryElement.textContent = endDate.toLocaleDateString('id-ID');
    }
    
    if (daysLeftElement) {
        daysLeftElement.textContent = daysLeft > 0 ? daysLeft : 0;
    }
};

OfflineLicenseSystem.prototype.updateDemoUI = function() {
    // Update badge demo
    var oldBadge = document.getElementById('licenseInfoBadge');
    if (oldBadge && oldBadge.parentNode) {
        oldBadge.parentNode.removeChild(oldBadge);
    }
    
    // Buat badge demo khusus
    var demoBadge = document.createElement('div');
    demoBadge.id = 'licenseInfoBadge';
    demoBadge.style.cssText = [
        'position: fixed;',
        'bottom: 0px;',
        'right: 0px;',
        'background: #333;',
        'color: white;',
        'padding: 8px 15px;',
        'border-radius: 20px 0px 0px 20px;',
        'z-index: 9998;',
        'font-size: 12px;',
        'cursor: pointer;',
        'display: flex;',
        'align-items: center;',
        'gap: 8px;',
    ].join('');
    
    demoBadge.innerHTML = [
        '<i class="bi bi-play-circle" style="font-size: 14px;"></i>',
        '<span><b>DEMO</b></span>'
    ].join('');
    
    document.body.appendChild(demoBadge);
    
    var self = this;
    demoBadge.addEventListener('click', function() {
        self.showDemoInfoPopup();
    });
};


// ==================== FUNGSI BARU: SHOW BRIEF LICENSE INFO ====================
OfflineLicenseSystem.prototype.showBriefLicenseInfo = function() {
    if (!this.currentLicense) return;
    
    var packageData = this.licensePackages[this.currentLicense.package];
    var expiryDate = new Date(this.currentLicense.expiry);
    var daysLeft = Math.ceil((expiryDate - new Date()) / (1000 * 3600 * 24));
    
    // Hapus badge lama jika ada
    var oldBadge = document.getElementById('licenseInfoBadge');
    if (oldBadge && oldBadge.parentNode) {
        oldBadge.parentNode.removeChild(oldBadge);
    }
    
    // Buat notification kecil di pojok kanan atas
    var infoBadge = document.createElement('div');
    infoBadge.id = 'licenseInfoBadge';
    infoBadge.style.cssText = [
        'position: fixed;',
        'bottom: 0px;',
        'right: 0px;',
        'background: #005a31;',
        'color: white;',
        'padding: 8px 15px;',
        'z-index: 9998;',
        'font-size: 12px;',
        'cursor: pointer;',
        'display: flex;',
        'align-items: center;',
    ].join('');
    

    // Tampilkan icon berbeda berdasarkan paket
    var iconClass = 'bi-shield-check';
    if (this.currentLicense.package === 'vip') iconClass = 'bi-gem';
    else if (this.currentLicense.package === 'premium') iconClass = 'bi-star-fill';
    else if (this.currentLicense.package === 'basic') iconClass = 'bi-shield';
    else if (this.currentLicense.package === 'trial') iconClass = 'bi-clock';
    
    infoBadge.innerHTML = [
        '<i class="bi ' + iconClass + '" style="font-size: 14px;"></i>',
        '<span>' + packageData.name + ' - ' + daysLeft + ' hari</span>'
    ].join('');
    
    document.body.appendChild(infoBadge);
    
    // Klik untuk lihat detail
    var self = this;
    infoBadge.addEventListener('click', function() {
        self.showLicenseDetailsPopup();
    });
    
    // Hover effect
    infoBadge.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.4)';
    });
    
    infoBadge.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 3px 10px rgba(0,0,0,0.3)';
    });
    
};