//styles-global.js

// Global functions
// ==================== GLOBAL FUNCTIONS ====================
function copyToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        var successful = document.execCommand('copy');
        if (successful) {
            showGlobalToast('✓ Berhasil disalin ke clipboard', 'success');
        } else {
            showGlobalToast('Gagal menyalin', 'error');
        }
    } catch (err) {
        console.error('Copy failed:', err);
        showGlobalToast('Gagal menyalin', 'error');
    }
    
    document.body.removeChild(textArea);
}

function showGlobalToast(message, type) {
    var toast = document.createElement('div');
    
    var backgroundColor = '#17a2b8';
    if (type === 'success') backgroundColor = '#28a745';
    else if (type === 'error') backgroundColor = '#dc3545';
    else if (type === 'warning') backgroundColor = '#ffc107';
    
    toast.style.cssText = [
        'position: fixed;',
        'top: 20px;',
        'right: 20px;',
        'padding: 15px 25px;',
        'background: ' + backgroundColor + ';',
        'color: white;',
        'border-radius: 8px;',
        'z-index: 100001;',
        'animation: slideUp 0.3s ease;',
        'box-shadow: 0 5px 15px rgba(0,0,0,0.3);',
        'font-weight: bold;',
        'display: flex;',
        'align-items: center;',
        'gap: 10px;',
        'max-width: 400px;'
    ].join('');
    
    var icon = '';
    if (type === 'success') icon = 'bi-check-circle';
    else if (type === 'error') icon = 'bi-exclamation-circle';
    else if (type === 'warning') icon = 'bi-exclamation-triangle';
    else icon = 'bi-info-circle';
    
    toast.innerHTML = [
        '<i class="bi ' + icon + '"></i>',
        '<span>' + message + '</span>'
    ].join('');
    
    document.body.appendChild(toast);
    
    setTimeout(function() {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}


// ==================== STYLING (DIPERBAIKI) ====================
OfflineLicenseSystem.prototype.addStyles = function() {
    if (document.getElementById('offline-license-styles')) return;
    
    var style = document.createElement('style');
    style.id = 'offline-license-styles';
    
    var css = `
        /* ==================== BASE ANIMATIONS ==================== */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { 
                transform: translateY(50px) scale(0.95); 
                opacity: 0; 
            }
            to { 
                transform: translateY(0) scale(1); 
                opacity: 1; 
            }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        /* ==================== OVERLAY ==================== */
        #offlineLicenseOverlay {
            z-index: 99999 !important;
            overflow-y: auto !important;
            align-items: flex-start !important;
            padding: 20px !important;
            background: rgba(0, 0, 0, 0.92) !important;
        }
        
        /* ==================== MAIN POPUP ==================== */
        .offline-license-popup {
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
            color: #333333 !important;
            border-radius: 20px;
            width: 100%;
            max-width: 800px;
            overflow: hidden;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
            border: 2px solid #005a31;
            animation: slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            margin: 20px auto !important;
            position: relative;
            display: flex;
            flex-direction: column;
        }
        
        /* Admin dan Upgrade popup lebih lebar */
        .offline-license-popup.admin,
        .offline-license-popup.upgrade {
            max-width: 900px !important;
        }
        
        /* Expired popup */
        .offline-license-popup.expired {
            border-color: #dc3545;
        }
        
        /* ==================== POPUP HEADER ==================== */
        .popup-header {
            padding: 30px;
            text-align: center;
            background: linear-gradient(135deg, #005a31 0%, #00816d 100%) !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            color: white !important;
            flex-shrink: 0;
        }
        
        .popup-header.active {
            background: linear-gradient(135deg, #00816d 0%, #005a31 100%) !important;
        }
        
        .popup-header.expired {
            background: linear-gradient(135deg, #8b0000 0%, #dc3545 100%) !important;
        }
        
        .header-icon {
            font-size: 60px;
            color: white;
            margin-bottom: 15px;
            display: block;
        }
        
        .popup-header h2 {
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: 800;
            color: white !important;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        
        .subtitle {
            margin: 0;
            color: rgba(255, 255, 255, 0.9) !important;
            font-size: 16px;
        }
        
        /* ==================== POPUP BODY (SCROLLABLE) ==================== */
        .popup-body {
            padding: 30px;
            overflow-y: auto;
            overflow-x: hidden;
            flex: 1;
            background: #ffffff !important;
            color: #333333 !important;
            max-height: 60vh;
        }
        
        /* Untuk admin panel yang lebih panjang */
        .offline-license-popup.admin .popup-body {
            max-height: 65vh !important;
        }
        
        /* Custom scrollbar */
        .popup-body::-webkit-scrollbar {
            width: 8px;
        }
        
        .popup-body::-webkit-scrollbar-track {
            background: rgba(0, 90, 49, 0.1);
            border-radius: 4px;
        }
        
        .popup-body::-webkit-scrollbar-thumb {
            background: #005a31;
            border-radius: 4px;
        }
        
        .popup-body::-webkit-scrollbar-thumb:hover {
            background: #00816d;
        }
        
        /* ==================== CARDS ==================== */
        .activation-card,
        .license-details-card,
        .expired-warning-card,
        .admin-panel,
        .upgrade-container {
            background: rgba(255, 255, 255, 0.98) !important;
            border-radius: 15px;
            padding: 25px;
            border: 1px solid rgba(0, 90, 49, 0.2);
            color: #333333 !important;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        /* ==================== STATUS INDICATOR ==================== */
        .status-indicator {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 10px 20px;
            border-radius: 50px;
            background: rgba(0, 0, 0, 0.05);
            margin-bottom: 25px;
            font-weight: bold;
            font-size: 14px;
            color: #333333 !important;
        }
        
        .status-indicator.inactive {
            background: rgba(220, 53, 69, 0.1);
            border: 1px solid rgba(220, 53, 69, 0.3);
            color: #dc3545 !important;
        }
        
        .status-indicator.active {
            background: rgba(40, 167, 69, 0.1);
            border: 1px solid rgba(40, 167, 69, 0.3);
            color: #28a745 !important;
        }
        
        .status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: currentColor;
            animation: pulse 2s infinite;
        }
        
        /* ==================== LICENSE INPUT ==================== */
        .license-input-section {
            margin-bottom: 30px;
        }
        
        .input-group {
            margin-bottom: 25px;
        }
        
        .input-label {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
            color: #005a31 !important;
            font-weight: 600;
            font-size: 16px;
        }
        
        .license-input {
            width: 100%;
            padding: 18px 20px;
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 1px;
            background: #ffffff !important;
            border: 2px solid #005a31;
            border-radius: 10px;
            color: #333333 !important;
            text-align: center;
            text-transform: uppercase;
            font-family: 'Courier New', monospace;
            transition: all 0.3s;
            box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .license-input:focus {
            outline: none;
            border-color: #005a31;
            box-shadow: 0 0 0 4px rgba(0, 90, 49, 0.3), inset 0 2px 5px rgba(0, 0, 0, 0.1);
            background: #ffffff !important;
        }
        
        .input-hint {
            margin-top: 8px;
            color: #666666 !important;
            font-size: 13px;
            text-align: center;
        }
        
        /* ==================== PACKAGE PREVIEW ==================== */
        .package-preview {
            background: rgba(0, 90, 49, 0.05) !important;
            border-radius: 10px;
            padding: 20px;
            min-height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333333 !important;
            border: 1px dashed rgba(0, 90, 49, 0.3);
        }
        
        .preview-placeholder {
            text-align: center;
            color: #666666 !important;
        }
        
        .preview-placeholder i {
            font-size: 40px;
            margin-bottom: 10px;
            display: block;
            color: #999999;
        }
        
        .package-detected {
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 15px;
            background: rgba(0, 90, 49, 0.1) !important;
            border-radius: 10px;
            border: 1px solid rgba(0, 90, 49, 0.3);
            animation: slideUp 0.3s ease;
            color: #333333 !important;
            width: 100%;
        }
        
        .package-detected.trial {
            background: rgba(255, 193, 7, 0.1) !important;
            border-color: rgba(255, 193, 7, 0.3);
        }
        
        .package-detected.basic {
            background: rgba(13, 110, 253, 0.1) !important;
            border-color: rgba(13, 110, 253, 0.3);
        }
        
        .package-detected.premium {
            background: rgba(111, 66, 193, 0.1) !important;
            border-color: rgba(111, 66, 193, 0.3);
        }
        
        .package-detected.vip {
            background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(220, 53, 69, 0.1)) !important;
            border-color: rgba(255, 193, 7, 0.3);
        }
        
        .package-icon {
            font-size: 40px;
            color: #005a31;
        }
        
        .package-detected.trial .package-icon { color: #fd7e14; }
        .package-detected.basic .package-icon { color: #0d6efd; }
        .package-detected.premium .package-icon { color: #6f42c1; }
        .package-detected.vip .package-icon { color: #ffc107; }
        
        .package-info h4 {
            margin: 0 0 5px 0;
            font-size: 22px;
            color: #333333 !important;
        }
        
        .package-info p {
            margin: 0 0 10px 0;
            color: #666666 !important;
        }
        
        .package-features {
            display: flex;
            gap: 15px;
            font-size: 14px;
            flex-wrap: wrap;
        }
        
        .package-features span {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 4px 10px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 5px;
            color: #333333;
        }
        
        .package-invalid {
            display: flex;
            align-items: center;
            gap: 20px;
            padding: 15px;
            background: rgba(220, 53, 69, 0.1) !important;
            border-radius: 10px;
            border: 1px solid rgba(220, 53, 69, 0.3);
            animation: slideUp 0.3s ease;
            color: #333333 !important;
            width: 100%;
        }
        
        .package-invalid .package-icon {
            color: #dc3545;
        }
        
        /* ==================== BUTTONS ==================== */
        .action-section {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin: 25px 0;
        }
        
        /* Primary buttons - Green */
        .btn-activate-large,
        .btn-contact,
        .btn-whatsapp,
        .btn-upgrade-now,
        .btn-admin-generate,
        .btn-confirm-upgrade,
        .btn-whatsapp-admin {
            background: linear-gradient(135deg, #005a31 0%, #00816d 100%) !important;
            color: white !important;
            border: none;
            padding: 18px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            width: 100%;
            text-decoration: none;
        }
        
        .btn-activate-large:hover,
        .btn-contact:hover,
        .btn-whatsapp:hover,
        .btn-upgrade-now:hover,
        .btn-admin-generate:hover,
        .btn-confirm-upgrade:hover,
        .btn-whatsapp-admin:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0, 90, 49, 0.4);
        }
        
        .btn-activate-large:active,
        .btn-contact:active,
        .btn-whatsapp:active,
        .btn-upgrade-now:active,
        .btn-admin-generate:active,
        .btn-confirm-upgrade:active,
        .btn-whatsapp-admin:active {
            transform: translateY(-1px);
        }
        
        .btn-success-large {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
        }
        
        /* Secondary buttons - Light */
        .btn-demo-mode,
        .btn-copy,
        .btn-admin-secondary,
        .btn-cancel-upgrade,
        .btn-close,
        .btn-admin-close,
        .btn-copy-admin {
            background: rgba(255, 255, 255, 0.9) !important;
            color: #333333 !important;
            border: 2px solid #005a31;
            padding: 16px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            width: 100%;
        }
        
        .btn-demo-mode:hover,
        .btn-copy:hover,
        .btn-admin-secondary:hover,
        .btn-cancel-upgrade:hover,
        .btn-close:hover,
        .btn-admin-close:hover,
        .btn-copy-admin:hover {
            background: rgba(0, 90, 49, 0.1) !important;
            transform: translateY(-2px);
        }
        
        /* Danger buttons - Red */
        .btn-deactivate,
        .btn-admin-danger {
            background: linear-gradient(135deg, #dc3545 0%, #b02a37 100%) !important;
            color: white !important;
            border: none;
            padding: 18px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            width: 100%;
        }
        
        .btn-deactivate:hover,
        .btn-admin-danger:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(220, 53, 69, 0.4);
        }
        
        /* Special buttons */
        .btn-admin-panel {
            background: linear-gradient(135deg, #6f42c1 0%, #6610f2 100%) !important;
            color: white !important;
            border: none;
            padding: 18px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            width: 100%;
        }
        
        .btn-admin-panel:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(111, 66, 193, 0.4);
        }
        
        .btn-upgrade-notification {
            background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%) !important;
            color: #000 !important;
            border: none;
            padding: 15px;
            border-radius: 10px;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            margin-top: 15px;
        }
        
        .btn-upgrade-notification:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 193, 7, 0.4);
        }
        
        .btn-demo-again {
            background: rgba(13, 110, 253, 0.1) !important;
            color: #0d6efd !important;
            border: 2px solid rgba(13, 110, 253, 0.3);
            padding: 18px;
            border-radius: 12px;
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            width: 100%;
            transition: all 0.3s;
        }
        
        .btn-demo-again:hover {
            background: rgba(13, 110, 253, 0.2) !important;
            transform: translateY(-2px);
        }
        
        .btn-copy-id {
            background: rgba(255, 255, 255, 0.9) !important;
            color: #333333 !important;
            border: 2px solid #005a31;
            padding: 18px;
            border-radius: 12px;
            font-weight: bold;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            width: 100%;
            transition: all 0.3s;
        }
        
        .btn-copy-id:hover {
            background: rgba(0, 90, 49, 0.1) !important;
            transform: translateY(-2px);
        }
        
        .btn-copy-small {
            background: rgba(255, 255, 255, 0.9) !important;
            color: #333333 !important;
            border: 1px solid #005a31;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            margin-left: 10px;
            transition: all 0.3s;
        }
        
        .btn-copy-small:hover {
            background: rgba(0, 90, 49, 0.1) !important;
        }
        
        /* ==================== DIVIDER ==================== */
        .divider {
            display: flex;
            align-items: center;
            text-align: center;
            margin: 10px 0;
            color: #666666 !important;
        }
        
        .divider::before,
        .divider::after {
            content: '';
            flex: 1;
            border-bottom: 1px solid rgba(0, 90, 49, 0.2);
        }
        
        .divider span {
            padding: 0 15px;
        }
        
        /* ==================== INFO SECTIONS ==================== */
        .info-section {
            margin-top: 30px;
            padding-top: 25px;
            border-top: 1px solid rgba(0, 90, 49, 0.1);
        }
        
        .info-box,
        .upgrade-instructions,
        .upgrade-notification {
            background: rgba(0, 90, 49, 0.05) !important;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            border-left: 4px solid #005a31;
            color: #333333 !important;
        }
        
        .info-box h4,
        .upgrade-instructions h4,
        .upgrade-notification h4 {
            color: #005a31 !important;
            margin-top: 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .info-box ol {
            padding-left: 20px;
            margin: 15px 0 0 0;
        }
        
        .info-box li {
            margin-bottom: 8px;
            color: #333333 !important;
        }
        
        .device-info {
            background: rgba(0, 90, 49, 0.05) !important;
            padding: 15px;
            border-radius: 10px;
            border: 1px solid rgba(0, 90, 49, 0.2);
        }
        
        .device-info p {
            margin: 0 0 10px 0;
            color: #005a31 !important;
            font-weight: 600;
        }
        
        .device-id {
            display: block;
            font-family: 'Courier New', monospace;
            background: rgba(0, 0, 0, 0.05);
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
            color: #005a31 !important;
            font-size: 14px;
            word-break: break-all;
            font-weight: bold;
        }
        
        /* ==================== FOOTER ==================== */
        .popup-footer {
            padding: 20px 30px;
            background: rgba(0, 90, 49, 0.05) !important;
            border-top: 1px solid rgba(0, 90, 49, 0.1);
            text-align: center;
            color: #333333 !important;
            flex-shrink: 0;
        }
        
        .contact-details {
            margin-bottom: 15px;
            color: #666666 !important;
        }
        
        .contact-details p {
            margin: 5px 0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .click-hint {
            margin: 0;
            color: #666666 !important;
            font-size: 13px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .cannot-close-warning {
            color: #dc3545 !important;
            font-weight: bold;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 10px;
            background: rgba(220, 53, 69, 0.1);
            border-radius: 5px;
            border: 1px solid rgba(220, 53, 69, 0.3);
        }
        
        .admin-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 15px;
        }
        
        .admin-info p {
            margin: 0;
            color: #666666 !important;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        /* ==================== LICENSE DETAILS ==================== */
        .details-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        }
        
        @media (max-width: 768px) {
            .details-grid {
                grid-template-columns: 1fr;
            }
        }
        
        .detail-item {
            background: rgba(0, 0, 0, 0.03);
            padding: 15px;
            border-radius: 10px;
            border: 1px solid rgba(0, 90, 49, 0.1);
        }
        
        .detail-item label {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #005a31 !important;
            font-size: 14px;
            margin-bottom: 8px;
            font-weight: 600;
        }
        
        .detail-value {
            color: #333333 !important;
            font-weight: bold;
            font-size: 16px;
        }
        
        .license-key {
            font-family: 'Courier New', monospace;
            color: #005a31 !important;
            background: rgba(0, 90, 49, 0.05);
            padding: 5px 10px;
            border-radius: 5px;
            display: inline-block;
            font-weight: bold;
        }
        
        .features-list {
            background: rgba(0, 90, 49, 0.03);
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            border: 1px solid rgba(0, 90, 49, 0.1);
        }
        
        .features-list h4 {
            color: #005a31 !important;
            margin-top: 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .features-list ul {
            list-style: none;
            padding: 0;
            margin: 15px 0 0 0;
        }
        
        .features-list li {
            padding: 10px;
            margin-bottom: 8px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            color: #333333 !important;
        }
        
        .feature-active {
            background: rgba(0, 90, 49, 0.1);
            border-left: 4px solid #28a745;
        }
        
        .feature-inactive {
            background: rgba(220, 53, 69, 0.05);
            border-left: 4px solid #dc3545;
        }
        
        .action-buttons {
            display: flex;
            gap: 15px;
            margin-top: 20px;
        }
        
        @media (max-width: 768px) {
            .action-buttons {
                flex-direction: column;
            }
        }
        
        /* ==================== ADMIN PANEL ==================== */
        .admin-panel {
            display: grid;
            gap: 20px;
        }
        
        .admin-section {
            background: rgba(255, 255, 255, 0.95) !important;
            border-radius: 10px;
            padding: 20px;
            border: 1px solid rgba(0, 90, 49, 0.2);
            margin-bottom: 20px;
            color: #333333 !important;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
        }
        
        .admin-section h4 {
            color: #005a31 !important;
            margin-top: 0;
            display: flex;
            align-items: center;
            gap: 10px;
            border-bottom: 2px solid rgba(0, 90, 49, 0.2);
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        
        .admin-form {
            display: grid;
            gap: 15px;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #005a31 !important;
            margin-bottom: 8px;
            font-weight: 600;
        }
        
        .admin-select,
        .admin-input {
            width: 100%;
            padding: 12px 15px;
            background: #ffffff !important;
            border: 1px solid #005a31;
            border-radius: 8px;
            color: #333333 !important;
            font-size: 14px;
            transition: all 0.3s;
        }
        
        .admin-select:focus,
        .admin-input:focus {
            outline: none;
            border-color: #005a31;
            box-shadow: 0 0 0 3px rgba(0, 90, 49, 0.2);
        }
        
        .license-list {
            max-height: 300px;
            overflow-y: auto;
            margin: 15px 0;
            border: 1px solid rgba(0, 90, 49, 0.2);
            border-radius: 8px;
        }
        
        .license-list::-webkit-scrollbar {
            width: 6px;
        }
        
        .license-list::-webkit-scrollbar-thumb {
            background: rgba(0, 90, 49, 0.5);
            border-radius: 3px;
        }
        
        .admin-table {
            width: 100%;
            border-collapse: collapse;
            background: #ffffff !important;
            color: #333333 !important;
        }
        
        .admin-table th {
            background: rgba(0, 90, 49, 0.1) !important;
            color: #005a31 !important;
            padding: 12px 15px;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid rgba(0, 90, 49, 0.2);
            position: sticky;
            top: 0;
        }
        
        .admin-table td {
            padding: 10px 15px;
            background: #ffffff !important;
            color: #333333 !important;
            border-bottom: 1px solid rgba(0, 90, 49, 0.1);
        }
        
        .admin-table tr:hover td {
            background: rgba(0, 90, 49, 0.05) !important;
        }
        
        .admin-table code {
            font-family: 'Courier New', monospace;
            background: rgba(0, 90, 49, 0.05);
            padding: 3px 6px;
            border-radius: 4px;
            color: #005a31;
            font-weight: bold;
        }
        
        .status-badge {
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            display: inline-block;
            text-align: center;
            min-width: 70px;
        }
        
        .status-badge.pending {
            background: rgba(255, 193, 7, 0.2);
            color: #ffc107;
            border: 1px solid rgba(255, 193, 7, 0.3);
        }
        
        .status-badge.active {
            background: rgba(40, 167, 69, 0.2);
            color: #28a745;
            border: 1px solid rgba(40, 167, 69, 0.3);
        }
        
        .status-badge.used {
            background: rgba(108, 117, 125, 0.2);
            color: #6c757d;
            border: 1px solid rgba(108, 117, 125, 0.3);
        }
        
        .admin-actions {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        
        @media (max-width: 768px) {
            .admin-actions {
                flex-direction: column;
            }
        }
        
        .system-settings {
            display: grid;
            gap: 10px;
        }
        
        .setting-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            background: rgba(0, 0, 0, 0.02);
            border-radius: 8px;
            border: 1px solid rgba(0, 90, 49, 0.1);
        }
        
        .setting-item label {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #005a31 !important;
            font-weight: 600;
        }
        
        .setting-value {
            color: #333333 !important;
            font-weight: bold;
            background: rgba(0, 90, 49, 0.05);
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 14px;
        }
        
        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: #999999 !important;
        }
        
        .empty-state i {
            font-size: 50px;
            margin-bottom: 15px;
            display: block;
            color: #cccccc;
        }
        
        .empty-state p {
            margin: 0;
            font-size: 16px;
        }
        
        .license-result {
            background: rgba(0, 90, 49, 0.1) !important;
            border-radius: 10px;
            padding: 20px;
            border: 2px solid rgba(0, 90, 49, 0.3);
            color: #333333 !important;
        }
        
        .license-result h5 {
            color: #005a31 !important;
            margin-top: 0;
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .result-details {
            margin: 15px 0;
        }
        
        .result-details p {
            margin: 8px 0;
            color: #333333 !important;
        }
        
        .result-details strong {
            color: #005a31 !important;
        }
        
        .result-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        
        @media (max-width: 768px) {
            .result-actions {
                flex-direction: column;
            }
        }

        .important-note {
            background: rgba(255, 193, 7, 0.1);
            border-left: 4px solid #ffc107;
            padding: 10px 15px;
            margin: 15px 0;
            border-radius: 4px;
            color: #856404 !important;
            font-size: 14px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }

        .important-note i {
            color: #ffc107;
            font-size: 16px;
            margin-top: 2px;
        }
        
        /* ==================== UPGRADE OPTIONS ==================== */
        .upgrade-container {
            display: grid;
            gap: 25px;
        }
        
        .current-package-info h4 {
            color: #005a31 !important;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .current-package-card {
            background: rgba(255, 255, 255, 0.9) !important;
            border-radius: 10px;
            padding: 20px;
            border: 2px solid rgba(0, 90, 49, 0.3);
            text-align: center;
            color: #333333 !important;
        }
        
        .current-package-card.trial {
            border-color: rgba(253, 126, 20, 0.5);
        }
        
        .current-package-card.basic {
            border-color: rgba(13, 110, 253, 0.5);
        }
        
        .current-package-card.premium {
            border-color: rgba(111, 66, 193, 0.5);
        }
        
        .current-package-card.vip {
            border-color: rgba(255, 193, 7, 0.5);
        }
        
        .current-package-card h5 {
            margin-top: 0;
            color: #333333 !important;
            font-size: 20px;
        }
        
        .current-package-card p {
            margin: 8px 0;
            color: #666666 !important;
        }
        
        .upgrade-options-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
        }
        
        @media (max-width: 768px) {
            .upgrade-options-grid {
                grid-template-columns: 1fr;
            }
        }
        
        .upgrade-option {
            background: rgba(255, 255, 255, 0.95) !important;
            border-radius: 15px;
            padding: 25px;
            position: relative;
            border: 2px solid rgba(0, 90, 49, 0.3);
            transition: all 0.3s;
            color: #333333 !important;
            text-align: center;
        }
        
        .upgrade-option:hover {
            transform: translateY(-5px);
            border-color: #005a31;
            box-shadow: 0 10px 25px rgba(0, 90, 49, 0.15);
        }
        
        .upgrade-option.basic {
            border-color: rgba(13, 110, 253, 0.5);
        }
        
        .upgrade-option.premium {
            border-color: rgba(111, 66, 193, 0.5);
        }
        
        .upgrade-option.vip {
            border-color: rgba(255, 193, 7, 0.5);
        }
        
        .upgrade-option.basic:hover {
            border-color: #0d6efd;
            box-shadow: 0 10px 25px rgba(13, 110, 253, 0.15);
        }
        
        .upgrade-option.premium:hover {
            border-color: #6f42c1;
            box-shadow: 0 10px 25px rgba(111, 66, 193, 0.15);
        }
        
        .upgrade-option.vip:hover {
            border-color: #ffc107;
            box-shadow: 0 10px 25px rgba(255, 193, 7, 0.15);
        }
        
        .option-badge {
            position: absolute;
            top: -12px;
            right: 15px;
            background: linear-gradient(135deg, #005a31 0%, #00816d 100%);
            color: white;
            padding: 6px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 3px 10px rgba(0, 90, 49, 0.3);
        }
        
        .upgrade-option.basic .option-badge {
            background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
        }
        
        .upgrade-option.premium .option-badge {
            background: linear-gradient(135deg, #6f42c1 0%, #6610f2 100%);
        }
        
        .upgrade-option.vip .option-badge {
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
            color: #000;
        }
        
        .upgrade-option h4 {
            margin-top: 0;
            color: #333333 !important;
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        .option-price {
            font-size: 32px;
            font-weight: bold;
            color: #005a31 !important;
            margin: 15px 0;
        }
        
        .upgrade-option.basic .option-price {
            color: #0d6efd !important;
        }
        
        .upgrade-option.premium .option-price {
            color: #6f42c1 !important;
        }
        
        .upgrade-option.vip .option-price {
            color: #ffc107 !important;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .option-original-price {
            text-decoration: line-through;
            color: #999999 !important;
            font-size: 14px;
            margin-bottom: 10px;
        }
        
        .option-duration {
            background: rgba(0, 90, 49, 0.1);
            display: inline-block;
            padding: 6px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #005a31 !important;
        }
        
        .upgrade-option.basic .option-duration {
            background: rgba(13, 110, 253, 0.1);
            color: #0d6efd !important;
        }
        
        .upgrade-option.premium .option-duration {
            background: rgba(111, 66, 193, 0.1);
            color: #6f42c1 !important;
        }
        
        .upgrade-option.vip .option-duration {
            background: rgba(255, 193, 7, 0.1);
            color: #000 !important;
        }
        
        .option-features {
            list-style: none;
            padding: 0;
            margin: 20px 0;
            text-align: left;
        }
        
        .option-features li {
            padding: 8px 0;
            display: flex;
            align-items: center;
            gap: 10px;
            color: #333333 !important;
            border-bottom: 1px solid rgba(0, 90, 49, 0.1);
        }
        
        .option-features li:last-child {
            border-bottom: none;
        }
        
        .option-features .bi-check-circle {
            color: #28a745;
        }
        
        .option-features .bi-x-circle {
            color: #dc3545;
        }
        
        .upgrade-confirmation,
        .upgrade-instruction {
            background: rgba(255, 255, 255, 0.95) !important;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            border: 2px solid rgba(0, 90, 49, 0.3);
            color: #333333 !important;
        }
        
        .upgrade-confirmation h4,
        .upgrade-instruction h4 {
            color: #005a31 !important;
            margin-top: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            font-size: 24px;
        }
        
        .confirmation-details {
            text-align: left;
            background: rgba(0, 90, 49, 0.05);
            padding: 20px;
            border-radius: 10px;
            margin: 25px 0;
            border: 1px solid rgba(0, 90, 49, 0.1);
        }
        
        .confirmation-details p {
            margin: 10px 0;
            color: #333333 !important;
        }
        
        .confirmation-details strong {
            color: #005a31 !important;
        }
        
        .confirmation-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 25px;
        }
        
        @media (max-width: 768px) {
            .confirmation-actions {
                flex-direction: column;
            }
        }
        
        .instruction-content {
            text-align: left;
            margin: 25px 0;
        }
        
        .instruction-content p {
            margin: 15px 0;
            color: #333333 !important;
        }
        
        .instruction-content ol {
            padding-left: 20px;
            margin: 15px 0;
        }
        
        .instruction-content li {
            margin-bottom: 10px;
            color: #333333 !important;
        }
        
        .device-id-reminder {
            background: rgba(255, 215, 0, 0.1);
            padding: 20px;
            border-radius: 10px;
            margin-top: 25px;
            border: 1px solid rgba(255, 215, 0, 0.3);
            text-align: center;
        }
        
        .device-id-reminder p {
            margin: 0 0 10px 0;
            color: #333333 !important;
            font-weight: 600;
        }
        
        .device-id-reminder code {
            font-family: 'Courier New', monospace;
            background: rgba(0, 0, 0, 0.05);
            padding: 10px;
            border-radius: 5px;
            display: block;
            margin: 10px 0;
            color: #005a31 !important;
            font-weight: bold;
            word-break: break-all;
        }
        
        .instruction-actions {
            margin-top: 25px;
        }
        
        /* ==================== EXPIRED POPUP PACKAGE COMPARISON ==================== */
        .package-comparison {
            margin: 30px 0;
        }
        
        .package-comparison h4 {
            color: #005a31 !important;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            justify-content: center;
        }
        
        .packages-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        @media (max-width: 768px) {
            .packages-grid {
                grid-template-columns: 1fr;
            }
        }
        
        .package-card {
            background: rgba(255, 255, 255, 0.95) !important;
            border-radius: 15px;
            padding: 25px;
            position: relative;
            border: 2px solid rgba(0, 90, 49, 0.2);
            transition: all 0.3s;
            color: #333333 !important;
            text-align: center;
        }
        
        .package-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .package-card.basic {
            border-color: rgba(13, 110, 253, 0.3);
        }
        
        .package-card.premium {
            border-color: rgba(111, 66, 193, 0.3);
            transform: scale(1.05);
            border-width: 3px;
        }
        
        .package-card.vip {
            border-color: rgba(255, 193, 7, 0.3);
        }
        
        .popular-badge {
            position: absolute;
            top: -12px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #6f42c1 0%, #6610f2 100%);
            color: white;
            padding: 6px 20px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 3px 10px rgba(111, 66, 193, 0.3);
        }
        
        .vip-badge {
            position: absolute;
            bottom: 0px;
            left: 0px;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #333 0%, #333 100%);
            color: #000;
            padding: 6px 20px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 3px 10px rgba(255, 215, 0, 0.3);
        }
        
        .package-card h5 {
            margin-top: 0;
            font-size: 22px;
            color: #333333 !important;
            margin-bottom: 15px;
        }
        
        .package-card .price {
            font-size: 28px;
            font-weight: bold;
            color: #005a31 !important;
            margin: 15px 0;
        }
        
        .package-card.basic .price {
            color: #0d6efd !important;
        }
        
        .package-card.premium .price {
            color: #6f42c1 !important;
        }
        
        .package-card.vip .price {
            color: #ffc107 !important;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .package-card .duration {
            background: rgba(0, 90, 49, 0.1);
            display: inline-block;
            padding: 6px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #005a31 !important;
        }
        
        .package-card.basic .duration {
            background: rgba(13, 110, 253, 0.1);
            color: #0d6efd !important;
        }
        
        .package-card.premium .duration {
            background: rgba(111, 66, 193, 0.1);
            color: #6f42c1 !important;
        }
        
        .package-card.vip .duration {
            background: rgba(255, 193, 7, 0.1);
            color: #000 !important;
        }
        
        .package-card ul {
            list-style: none;
            padding: 0;
            margin: 0;
            font-size: 14px;
            text-align: left;
        }
        
        .package-card li {
            padding: 8px 0;
            border-bottom: 1px solid rgba(0, 90, 49, 0.1);
            color: #333333 !important;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .package-card li:last-child {
            border-bottom: none;
        }
        
        /* ==================== WARNING CARD ==================== */
        .warning-icon {
            font-size: 80px;
            color: #dc3545;
            margin-bottom: 20px;
            animation: pulse 1.5s infinite;
            display: block;
            text-align: center;
        }
        
        .warning-message {
            background: rgba(220, 53, 69, 0.05);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 4px solid #dc3545;
            text-align: center;
        }
        
        .warning-message p {
            margin: 10px 0;
            color: #333333 !important;
            font-size: 16px;
        }
        
        .contact-actions {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-top: 30px;
        }
        
        /* ==================== TOAST NOTIFICATION ==================== */
        .license-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            color: white !important;
            font-weight: bold;
            z-index: 100000;
            animation: slideUp 0.3s ease;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 400px;
        }
        
        .toast-success {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
            border-left: 4px solid #155724;
        }
        
        .toast-error {
            background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%) !important;
            border-left: 4px solid #721c24;
        }
        
        .toast-info {
            background: linear-gradient(135deg, #17a2b8 0%, #138496 100%) !important;
            border-left: 4px solid #0c5460;
        }
        
        /* ==================== RESPONSIVE DESIGN ==================== */
        @media (max-width: 992px) {
            .offline-license-popup {
                max-width: 95% !important;
            }
            
            .popup-header {
                padding: 25px;
            }
            
            .popup-body {
                padding: 25px;
            }
        }
        
        @media (max-width: 768px) {
            .offline-license-popup {
                max-width: 98% !important;
                margin: 10px auto !important;
            }
            
            .popup-header {
                padding: 20px;
            }
            
            .popup-header h2 {
                font-size: 24px;
            }
            
            .header-icon {
                font-size: 50px;
            }
            
            .popup-body {
                padding: 20px;
                max-height: 70vh !important;
            }
            
            .activation-card,
            .license-details-card,
            .expired-warning-card,
            .admin-section,
            .upgrade-container {
                padding: 20px;
            }
            
            .license-input {
                font-size: 18px;
                padding: 15px;
            }
            
            .btn-activate-large,
            .btn-demo-mode,
            .btn-contact,
            .btn-admin-panel,
            .btn-deactivate,
            .btn-whatsapp,
            .btn-copy-id,
            .btn-demo-again {
                padding: 16px;
                font-size: 15px;
            }
            
            .admin-footer {
                flex-direction: column;
                text-align: center;
            }
            
            .admin-table {
                font-size: 12px;
            }
            
            .admin-table th,
            .admin-table td {
                padding: 8px 10px;
            }
            
            .upgrade-options-grid {
                grid-template-columns: 1fr;
            }
            
            .packages-grid {
                grid-template-columns: 1fr;
            }
            
            .package-card.premium {
                transform: scale(1);
            }
            
            .action-buttons,
            .confirmation-actions,
            .result-actions,
            .admin-actions {
                flex-direction: column;
            }
        }
        
        @media (max-width: 480px) {
            .offline-license-popup {
                border-radius: 15px;
            }
            
            .popup-header {
                padding: 15px;
            }
            
            .popup-header h2 {
                font-size: 20px;
            }
            
            .subtitle {
                font-size: 14px;
            }
            
            .header-icon {
                font-size: 40px;
            }
            
            .popup-body {
                padding: 15px;
                max-height: 75vh !important;
            }
            
            .popup-footer {
                padding: 15px;
            }
            
            .activation-card,
            .license-details-card,
            .expired-warning-card,
            .admin-section,
            .upgrade-container {
                padding: 15px;
            }
            
            .license-input {
                font-size: 16px;
                padding: 12px;
            }
            
            .details-grid {
                grid-template-columns: 1fr;
                gap: 10px;
            }
            
            .package-features {
                flex-direction: column;
                gap: 8px;
            }
            
            .warning-icon {
                font-size: 60px;
            }
            
            .package-card,
            .upgrade-option {
                padding: 20px;
            }
        }
        
        /* ==================== FIX FOR SCROLL ON MOBILE ==================== */
        @media (max-width: 768px) {
            #offlineLicenseOverlay {
                padding: 10px !important;
                align-items: flex-start !important;
            }
            
            .offline-license-popup {
                margin-top: 10px !important;
                margin-bottom: 10px !important;
            }
        }
        
        /* ==================== PRINT STYLES ==================== */
        @media print {
            #offlineLicenseOverlay {
                position: relative !important;
                background: white !important;
            }
            
            .offline-license-popup {
                box-shadow: none !important;
                border: 2px solid #000 !important;
                max-width: 100% !important;
                margin: 0 !important;
            }
            
            .btn-activate-large,
            .btn-demo-mode,
            .btn-contact,
            .btn-admin-panel,
            .btn-deactivate,
            .btn-close,
            .btn-copy,
            .btn-copy-id,
            .btn-demo-again,
            .btn-upgrade-now,
            .btn-upgrade-notification,
            .btn-confirm-upgrade,
            .btn-cancel-upgrade,
            .btn-admin-generate,
            .btn-admin-secondary,
            .btn-admin-danger,
            .btn-admin-close,
            .btn-copy-admin,
            .btn-whatsapp-admin,
            .btn-whatsapp {
                display: none !important;
            }
        }

        /* Demo Badge Animation */
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        /* Demo Features List */
        .demo-features {
            background: rgba(255, 107, 107, 0.05);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border-left: 4px solid #ff6b6b;
        }

        .demo-features h4 {
            color: #ff6b6b !important;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .demo-warning {
            background: rgba(255, 193, 7, 0.1);
            padding: 15px;
            border-radius: 10px;
            margin: 20px 0;
            border: 1px solid rgba(255, 193, 7, 0.3);
        }

        .demo-warning h4 {
            color: #ffc107 !important;
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 0;
        }

        .demo-timer {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            color: #ff6b6b;
            font-weight: bold;
            font-size: 16px;
        }

        #demoTimeRemaining {
            background: rgba(255, 107, 107, 0.1);
            padding: 5px 10px;
            border-radius: 5px;
            font-family: 'Courier New', monospace;
            font-size: 18px;
            min-width: 60px;
            display: inline-block;
            text-align: center;
        }

        /* ==================== FOCUSED INPUT MODE ==================== */
        /* ==================== FOCUSED INPUT MODE ==================== */
        .focused-input-mode {
            max-width: 500px !important;
            min-height: auto !important;
        }

        .focused-input-mode .popup-header,
        .focused-input-mode .popup-body .action-section,
        .focused-input-mode .popup-body .info-section,
        .focused-input-mode .popup-footer .contact-details {
            display: none !important;
        }

        /* TAMBAHKAN INI: Jangan sembunyikan package preview */
        .focused-input-mode .package-preview {
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
            margin-top: 20px !important;
            animation: slideUp 0.3s ease !important;
        }

        .focused-input-mode .popup-body {
            padding: 30px !important;
            max-height: none !important;
            overflow: visible !important;
        }

        .focused-input-mode .activation-card {
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
        }

        .focused-input-mode .license-input-section {
            margin-bottom: 0 !important;
        }

        .focused-input-mode .input-group {
            position: relative;
            margin-bottom: 15px !important;
        }

        .focused-input-mode .license-input {
            font-size: 24px !important;
            padding: 20px 60px 20px 20px !important;
            border-radius: 12px !important;
            border-width: 3px !important;
            letter-spacing: 2px !important;
        }

        .focused-input-mode .input-hint {
            font-size: 14px !important;
            margin-top: 10px !important;
            text-align: center !important;
        }

        .focused-input-mode .package-preview {
            min-height: 80px !important;
            margin-top: 20px !important;
            background: rgba(255, 255, 255, 0.95) !important;
            border: 2px solid rgba(0, 90, 49, 0.2) !important;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
        }

        /* Tombol close di pojok kanan atas */
        .close-focused-btn {
            position: absolute;
            top: 15px;
            right: 15px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.1) !important;
            border: none;
            color: #333 !important;
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            z-index: 1000;
        }

        .close-focused-btn:hover {
            background: rgba(0, 90, 49, 0.2) !important;
            transform: rotate(90deg);
        }

        /* Tombol status validasi di dalam input */
        .input-validation-icons {
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            gap: 10px;
        }

        .validation-icon {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            cursor: pointer;
            transition: all 0.3s;
            opacity: 0.7;
        }

        .validation-icon:hover {
            opacity: 1;
            transform: scale(1.1);
        }

        .validation-icon.valid {
            background: rgba(40, 167, 69, 0.2) !important;
            color: #28a745 !important;
            border: 2px solid rgba(40, 167, 69, 0.3);
        }

        .validation-icon.invalid {
            background: rgba(220, 53, 69, 0.2) !important;
            color: #dc3545 !important;
            border: 2px solid rgba(220, 53, 69, 0.3);
        }

        .validation-icon.disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }

        .validation-icon.active {
            opacity: 1;
            box-shadow: 0 0 0 4px rgba(0, 90, 49, 0.1);
        }

        /* ==================== HIGHLIGHT CURRENT DEVICE ==================== */
        .current-device {
        background: rgba(0, 90, 49, 0.15) !important;
        border-left: 4px solid #005a31 !important;
        position: relative;
        }

        .current-device::before {
        content: '✓ PERANGKAT INI';
        position: absolute;
        top: 5px;
        right: 5px;
        background: #005a31;
        color: white;
        font-size: 10px;
        padding: 2px 5px;
        border-radius: 3px;
        }

        /* ==================== LICENSE RESULT POPUP ==================== */
        .license-result-popup {
        text-align: center;
        padding: 20px;
        }

        .result-icon {
        font-size: 80px;
        color: #28a745;
        margin-bottom: 20px;
        }

        .result-details {
        background: rgba(0, 90, 49, 0.05);
        border-radius: 10px;
        padding: 20px;
        margin: 20px 0;
        text-align: left;
        }

        .result-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(0, 90, 49, 0.1);
        }

        .result-item:last-child {
        border-bottom: none;
        margin-bottom: 0;
        }

        .result-item label {
        font-weight: bold;
        color: #005a31;
        }

        .result-value {
        color: #333;
        }

        .license-code {
        font-family: 'Courier New', monospace;
        font-size: 18px;
        font-weight: bold;
        color: #005a31;
        }

        .result-note {
        background: rgba(255, 193, 7, 0.1);
        border-left: 4px solid #ffc107;
        padding: 15px;
        border-radius: 5px;
        margin-top: 20px;
        text-align: left;
        font-size: 14px;
        }

        .result-note p {
        margin: 5px 0;
        }

        .close-popup-btn {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        position: absolute;
        top: 15px;
        right: 15px;
        transition: all 0.3s;
        }

        .close-popup-btn:hover {
        color: #ffc107;
        transform: scale(1.1);
        }


    `;
    
    style.textContent = css;
    document.head.appendChild(style);
};


// ==================== TOAST NOTIFICATION ====================
OfflineLicenseSystem.prototype.showToast = function(message, type) {
    var oldToast = document.querySelector('.license-toast');
    if (oldToast && oldToast.parentNode) {
        oldToast.parentNode.removeChild(oldToast);
    }
    
    var toast = document.createElement('div');
    toast.className = 'license-toast toast-' + type;
    
    var icon = '';
    if (type === 'success') {
        icon = 'check-circle';
    } else if (type === 'error') {
        icon = 'exclamation-circle';
    } else {
        icon = 'info-circle';
    }
    
    toast.innerHTML = [
        '<i class="bi bi-' + icon + '"></i>',
        '<span>' + message + '</span>'
    ].join('');
    
    document.body.appendChild(toast);
    
    var selfToast = toast;
    setTimeout(function() {
        if (selfToast.parentNode) {
            selfToast.parentNode.removeChild(selfToast);
        }
    }, 4000);
};


