// ============================================
// Firebase Configuration for MY-MARKETPLACE
// هذا المشروع: my-marketplace-64afa
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
// Simple Firebase Initialization
// ============================================

console.log('🚀 بدء تهيئة Firebase لـ my-marketplace...');

// تأخير التهيئة حتى يتم تحميل SDK
setTimeout(() => {
  if (typeof firebase === 'undefined') {
    console.error('❌ Firebase SDK غير محمل!');
    alert('⚠️ Firebase غير محمل. تأكد من اتصال الإنترنت.');
    return;
  }
  
  try {
    // التحقق من عدم وجود تهيئة سابقة
    if (!firebase.apps.length) {
      // التهيئة الأولى
      firebase.initializeApp(firebaseConfig);
      console.log('✅ تم تهيئة Firebase بنجاح');
    } else {
      console.log('ℹ️ Firebase مثبت بالفعل');
    }
    
    // تصدير الخدمات
    window.auth = firebase.auth();
    window.db = firebase.firestore();
    window.storage = firebase.storage();
    
    console.log('🎉 Firebase جاهز للاستخدام!');
    console.log('📊 Project ID:', firebaseConfig.projectId);
    
    // عرض رسالة نجاح
    showSuccessMessage();
    
  } catch (error) {
    console.error('❌ خطأ في تهيئة Firebase:', error);
    
    // تحليل الخطأ
    if (error.code === 'app/duplicate-app') {
      console.log('⚠️ Firebase مثبت بالفعل في صفحة أخرى');
    } else if (error.message.includes('project')) {
      console.error('❌ المشروع غير صحيح! تأكد من Project ID');
      alert('❌ مشروع Firebase غير صحيح! استخدم my-marketplace-64afa');
    } else {
      alert('❌ خطأ في Firebase: ' + error.message);
    }
  }
}, 1000);

// ============================================
// دوال مساعدة
// ============================================

function showSuccessMessage() {
  const msg = document.createElement('div');
  msg.innerHTML = `
    <div style="
      position: fixed;
      top: 10px;
      right: 10px;
      background: #4CAF50;
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      font-weight: bold;
      z-index: 9999;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    ">
      ✅ Firebase متصل: my-marketplace-64afa
    </div>
  `;
  document.body.appendChild(msg);
  
  setTimeout(() => msg.remove(), 3000);
}

// دالة اختبار بسيطة
window.testMarketplaceFirebase = function() {
  if (typeof firebase === 'undefined') {
    alert('❌ Firebase SDK غير محمل');
    return false;
  }
  
  const projectId = firebase.app().options.projectId;
  
  if (projectId === 'my-marketplace-64afa') {
    alert(`✅ Perfect! Using correct project:\n${projectId}`);
    return true;
  } else {
    alert(`❌ Wrong project! Currently using:\n${projectId}\n\nShould be: my-marketplace-64afa`);
    return false;
  }
};

// التحقق من المشروع عند التحميل
document.addEventListener('DOMContentLoaded', function() {
  console.log('📍 موقع my-marketplace محمل');
  
  // التحقق من أننا نستخدم المشروع الصحيح
  setTimeout(() => {
    if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
      const currentProject = firebase.app().options.projectId;
      console.log('🔍 المشروع الحالي:', currentProject);
      
      if (currentProject !== 'my-marketplace-64afa') {
        console.warn('⚠️ تحذير: استخدام مشروع خاطئ!');
        console.warn('المفروض: my-marketplace-64afa');
        console.warn('الحالي:', currentProject);
        
        // محاولة التصحيح
        try {
          firebase.app().delete();
          console.log('🔄 حذفت التطبيق الخاطئ، جاري إعادة التهيئة...');
          firebase.initializeApp(firebaseConfig);
        } catch (e) {
          console.error('❌ لا يمكن تصحيح الخطأ:', e);
        }
      }
    }
  }, 2000);
});
