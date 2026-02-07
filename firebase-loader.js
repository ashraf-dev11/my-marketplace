// حل مشكلة تحميل Firebase SDK
(function() {
    'use strict';
    
    console.log('🚀 بدء تحميل Firebase SDK...');
    
    // قائمة SDKs المطلوبة
    const firebaseSDKs = [
        'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js',
        'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js',
        'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js',
        'https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js'
    ];
    
    let loadedCount = 0;
    
    // دالة لتحميل سكريبت
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.defer = true;
            
            script.onload = () => {
                console.log(`✅ تم تحميل: ${src}`);
                loadedCount++;
                resolve();
            };
            
            script.onerror = () => {
                console.error(`❌ فشل تحميل: ${src}`);
                reject(new Error(`فشل تحميل ${src}`));
            };
            
            document.head.appendChild(script);
        });
    }
    
    // دالة التحقق من Firebase
    function checkFirebaseLoaded() {
        if (typeof firebase !== 'undefined') {
            console.log('🎉 Firebase SDK محمل بنجاح!');
            console.log('📦 الإصدار:', firebase.SDK_VERSION);
            
            // إعلام الصفحة أن Firebase جاهز
            window.dispatchEvent(new CustomEvent('firebase-loaded', {
                detail: { version: firebase.SDK_VERSION }
            }));
            
            return true;
        }
        return false;
    }
    
    // بدء التحميل
    async function loadAllSDKs() {
        try {
            console.log('🔧 جاري تحميل Firebase SDKs...');
            
            // محاولة التحميل المتوازي
            const promises = firebaseSDKs.map(src => loadScript(src));
            await Promise.all(promises);
            
            console.log(`✅ تم تحميل ${loadedCount}/${firebaseSDKs.length} SDKs`);
            
            // انتظار تحميل Firebase
            let attempts = 0;
            const maxAttempts = 10;
            
            const checkInterval = setInterval(() => {
                attempts++;
                
                if (checkFirebaseLoaded()) {
                    clearInterval(checkInterval);
                    showFirebaseLoadedMessage();
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkInterval);
                    console.error('❌ فشل تحميل Firebase بعد عدة محاولات');
                    showFirebaseError('Firebase لم يتم تحميله بعد عدة محاولات');
                }
            }, 500);
            
        } catch (error) {
            console.error('❌ خطأ في تحميل Firebase SDKs:', error);
            showFirebaseError(error.message);
        }
    }
    
    // عرض رسالة نجاح تحميل Firebase
    function showFirebaseLoadedMessage() {
        const messageDiv = document.createElement('div');
        messageDiv.id = 'firebase-loaded-message';
        messageDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 10px 15px;
            background: #4CAF50;
            color: white;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            font-weight: bold;
            animation: slideIn 0.5s ease;
        `;
        messageDiv.textContent = '✅ Firebase محمل وجاهز!';
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => messageDiv.remove(), 500);
        }, 3000);
    }
    
    // عرض رسالة خطأ
    function showFirebaseError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'firebase-error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            padding: 10px 15px;
            background: #f44336;
            color: white;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            font-weight: bold;
            animation: slideIn 0.5s ease;
            max-width: 300px;
        `;
        errorDiv.innerHTML = `
            <div>❌ مشكلة في Firebase</div>
            <div style="font-size: 12px; margin-top: 5px; opacity: 0.9;">${message}</div>
        `;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => errorDiv.remove(), 500);
        }, 5000);
    }
    
    // إضافة أنماط CSS
    if (!document.getElementById('firebase-loader-styles')) {
        const style = document.createElement('style');
        style.id = 'firebase-loader-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // بدء التحميل عند تحميل الصفحة
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllSDKs);
    } else {
        loadAllSDKs();
    }
    
    // تصدير للاستخدام
    window.loadFirebaseSDKs = loadAllSDKs;
    window.isFirebaseSDKLoaded = checkFirebaseLoaded;
    
})();
