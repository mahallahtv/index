//main-loader.js


// main-loader.js

// Tunggu sampai DOM siap
function initializeLicenseSystem() {
    window.offlineLicense = new OfflineLicenseSystem();
    
    // Tambahkan resize listener
    window.addEventListener('resize', function() {
        if (window.offlineLicense && typeof window.offlineLicense.adjustPopupHeight === 'function') {
            window.offlineLicense.adjustPopupHeight();
        }
    });
    
    // Tunggu sampai DOM siap
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
                window.offlineLicense.initialize();
            }, 1500);
        });
    } else {
        setTimeout(function() {
            window.offlineLicense.initialize();
        }, 1500);
    }
    
    // Export untuk penggunaan global
    if (typeof window !== 'undefined') {
        window.OfflineLicenseSystem = OfflineLicenseSystem;
        window.copyToClipboard = copyToClipboard;
        window.showGlobalToast = showGlobalToast;
    }
}

// Panggil inisialisasi
initializeLicenseSystem();