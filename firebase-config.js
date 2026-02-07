// ============================================
// إعدادات Firebase - من مشروعك على Firebase
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyBKNo5VBqNNEW0NffIop_Ufett-HOAQKkE",
  authDomain: "my-marketplace-64afa.firebaseapp.com",
  projectId: "my-marketplace-64afa",
  storageBucket: "my-marketplace-64afa.firebasestorage.app",
  messagingSenderId: "607733189687",
  appId: "1:607733189687:web:1566e5a81ec3d71ed603b2"
};

// ============================================
// تهيئة Firebase (النسخة القديمة - تناسب موقعك)
// ============================================

// الانتظار حتى يتم تحميل Firebase SDK
document.addEventListener('DOMContentLoaded', function() {
  // التحقق إذا كان Firebase SDK محمل
  if (typeof firebase === 'undefined') {
    console.error('❌ Firebase SDK لم يتم تحميله! تأكد من إضافة السكريبتات في HTML');
    return;
  }
  
  try {
    // تهيئة Firebase
    if (!firebase.apps.length) {
      const firebaseApp = firebase.initializeApp(firebaseConfig);
      console.log('✅ Firebase تم التهيئة بنجاح:', firebaseApp.name);
    } else {
      console.log('⚠️ Firebase مثبت بالفعل');
    }
    
    // تصدير الخدمات للاستخدام العام
    window.firebaseAuth = firebase.auth();
    window.firebaseDB = firebase.firestore();
    window.firebaseStorage = firebase.storage();
    
    console.log('🚀 خدمات Firebase جاهزة للاستخدام!');
    
    // عرض رسالة نجاح في الصفحة
    showFirebaseStatus('success', '✅ Firebase متصل بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ في تهيئة Firebase:', error);
    showFirebaseStatus('error', '❌ خطأ في الاتصال بـ Firebase');
  }
});

// دالة لعرض حالة الاتصال
function showFirebaseStatus(type, message) {
  // إنشاء عنصر لعرض الحالة
  const statusDiv = document.createElement('div');
  statusDiv.id = 'firebase-connection-status';
  statusDiv.style.cssText = `
    position: fixed;
    top: 70px;
    right: 20px;
    padding: 10px 20px;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    z-index: 9999;
    animation: slideIn 0.5s ease;
  `;
  
  if (type === 'success') {
    statusDiv.style.background = '#4CAF50';
  } else {
    statusDiv.style.background = '#f44336';
  }
  
  statusDiv.textContent = message;
  document.body.appendChild(statusDiv);
  
  // إزالة الرسالة بعد 5 ثواني
  setTimeout(() => {
    if (statusDiv.parentNode) {
      statusDiv.style.animation = 'slideOut 0.5s ease';
      setTimeout(() => statusDiv.remove(), 500);
    }
  }, 5000);
}

// إضافة أنماط CSS للرسوم المتحركة
const style = document.createElement('style');
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

// وظائف مساعدة
function getAuth() {
  return window.firebaseAuth || null;
}

function getDB() {
  return window.firebaseDB || null;
}

function getStorage() {
  return window.firebaseStorage || null;
}

function isFirebaseConnected() {
  return !!(window.firebaseAuth && window.firebaseDB);
}

// تصدير للاستخدام
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    firebaseConfig,
    getAuth,
    getDB,
    getStorage,
    isFirebaseConnected
  };
}
