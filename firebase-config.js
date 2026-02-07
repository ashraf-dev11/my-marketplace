// إعدادات Firebase مع حلول للمشاكل
const firebaseConfig = {
  apiKey: "AIzaSyBKNo5VBqNNEW0NffIop_Ufett-HOAQKkE",
  authDomain: "my-marketplace-64afa.firebaseapp.com",
  projectId: "my-marketplace-64afa",
  storageBucket: "my-marketplace-64afa.firebasestorage.app",
  messagingSenderId: "607733189687",
  appId: "1:607733189687:web:1566e5a81ec3d71ed603b2"
};

// حل مشكلة CORS لـ GitHub Pages
window.firebaseReady = false;

async function initializeFirebase() {
  try {
    // التحقق من وجود Firebase SDK
    if (typeof firebase === 'undefined') {
      console.error('❌ Firebase SDK لم يتم تحميله');
      return false;
    }
    
    // تهيئة Firebase
    if (!firebase.apps.length) {
      await firebase.initializeApp(firebaseConfig);
      console.log('✅ Firebase initialized on', window.location.hostname);
    }
    
    // تصدير الخدمات
    window.firebaseAuth = firebase.auth();
    window.firebaseDB = firebase.firestore();
    window.firebaseStorage = firebase.storage();
    
    // تمكين المصادقة على GitHub Pages
    if (window.location.hostname.includes('github.io')) {
      firebase.auth().useDeviceLanguage();
      console.log('🌐 تم تكييف Firebase لـ GitHub Pages');
    }
    
    window.firebaseReady = true;
    console.log('🚀 Firebase ready to use!');
    
    // عرض رسالة نجاح
    showFirebaseStatus(true);
    return true;
    
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    showFirebaseStatus(false, error.message);
    return false;
  }
}

// تشغيل التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initializeFirebase, 1000); // تأخير بسيط
});

// عرض حالة Firebase
function showFirebaseStatus(success, message = '') {
  const statusDiv = document.createElement('div');
  statusDiv.id = 'firebase-status-message';
  statusDiv.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: bold;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideIn 0.5s ease;
  `;
  
  if (success) {
    statusDiv.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-check-circle" style="font-size: 20px;"></i>
        <div>
          <div style="font-size: 16px;">✅ Firebase متصل</div>
          <div style="font-size: 12px; opacity: 0.8;">${window.location.hostname}</div>
        </div>
      </div>
    `;
    statusDiv.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
  } else {
    statusDiv.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-exclamation-triangle" style="font-size: 20px;"></i>
        <div>
          <div style="font-size: 16px;">⚠️ Firebase غير متصل</div>
          <div style="font-size: 12px; opacity: 0.8;">${message || 'تحقق من الاتصال'}</div>
        </div>
      </div>
    `;
    statusDiv.style.background = 'linear-gradient(135deg, #f44336, #c62828)';
  }
  
  // إضافة الأنماط إذا لم تكن موجودة
  if (!document.getElementById('firebase-styles')) {
    const style = document.createElement('style');
    style.id = 'firebase-styles';
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
  
  // إزالة الرسالة القديمة إذا وجدت
  const oldStatus = document.getElementById('firebase-status-message');
  if (oldStatus) oldStatus.remove();
  
  document.body.appendChild(statusDiv);
  
  // إخفاء الرسالة بعد 5 ثواني
  setTimeout(() => {
    if (statusDiv.parentNode) {
      statusDiv.style.animation = 'slideOut 0.5s ease';
      setTimeout(() => statusDiv.remove(), 500);
    }
  }, 5000);
}

// وظيفة اختبار اتصال Firebase
window.testFirebaseConnection = async function() {
  try {
    if (!window.firebaseReady) {
      const result = await initializeFirebase();
      if (!result) {
        alert('❌ فشل الاتصال بـ Firebase\nتحقق من:\n1. اتصال الإنترنت\n2. API Keys\n3. ملف firebase-config.js');
        return false;
      }
    }
    
    // اختبار بسيط
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    console.log('Firebase server time test:', timestamp);
    
    alert(`✅ Firebase متصل بنجاح!\n\nمشروع: ${firebaseConfig.projectId}\nالدومين: ${window.location.hostname}`);
    return true;
    
  } catch (error) {
    console.error('Firebase test failed:', error);
    alert(`❌ خطأ في Firebase:\n${error.message}`);
    return false;
  }
};

// تصدير التهيئة للاستخدام
window.initializeFirebaseApp = initializeFirebase;
