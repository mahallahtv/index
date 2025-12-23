// admin-export-tools.js

// Tools admin
// ==================== FUNGSI BARU: EXPORT KE CSV ====================
OfflineLicenseSystem.prototype.exportLicensesToCSV = function() {
    var generatedLicenses = JSON.parse(localStorage.getItem('generated_licenses') || '[]');
    
    if (generatedLicenses.length === 0) {
        this.showToast('Tidak ada data untuk diexport', 'warning');
        return;
    }
    
    // Buat header CSV
    var csv = 'Kode,Paket,Device ID,Customer Name,Generated At,Status\n';
    
    // Tambahkan data
    generatedLicenses.forEach(function(license) {
        csv += [
            license.code,
            license.package,
            license.deviceId || 'N/A',
            license.customerName || 'Anonymous',
            new Date(license.generatedAt).toLocaleDateString('id-ID'),
            license.status
        ].join(',') + '\n';
    });
    
    // Buat blob dan download
    var blob = new Blob([csv], { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'license_data_' + new Date().toISOString().split('T')[0] + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    this.showToast('Data berhasil diexport ke CSV', 'success');
};



