// ============================================
// إعدادات Firebase الصحيحة بعد الإعداد
// ============================================

// هذه البيانات يجب أن تأتي من Firebase Console بعد إعداد المشروع
const firebaseConfig = {
  apiKey: "AIzaSyBKNo5VBqNNEW0NffIop_Ufett-HOAQKkE",
  authDomain: "my-marketplace-64afa.firebaseapp.com",
  projectId: "my-marketplace-64afa",
  storageBucket: "my-marketplace-64afa.firebasestorage.app",
  messagingSenderId: "607733189687",
  appId: "1:607733189687:web:1566e5a81ec3d71ed603b2"
};

// ============================================
// نظام ذكي للتعامل مع Firebase
// ============================================

// حالة Firebase
window.firebaseState = {
  ready: false,
  initialized: false,
  error: null
};

// الدالة الذكية لتهيئة Firebase
function smartFirebaseInit() {
  console.log('🧠 بدء التهيئة الذكية لـ Firebase...');
  
  return new Promise((resolve, reject) => {
    // المحاولة 1: التحقق من SDK
    if (typeof firebase === 'undefined') {
      console.error('❌ Firebase SDK غير محمل - تحقق من اتصال الإنترنت');
      reject(new Error('Firebase SDK غير محمل. المشكلة في: 1. الإنترنت 2. جدار الحماية 3. السكريبتات'));
      return;
    }
    
    // المحاولة 2: التهيئة
    try {
      let app;
      
      if (!firebase.apps.length) {
        console.log('🔧 جاري تهيئة Firebase لأول مرة...');
        app = firebase.initializeApp(firebaseConfig);
      } else {
        console.log('ℹ️ Firebase مثبت بالفعل');
        app = firebase.app();
      }
      
      // المحاولة 3: تهيئة الخدمات
      window.fbAuth = firebase.auth();
      window.fbDb = firebase.firestore();
      window.fbStorage = firebase.storage();
      
      // إعدادات خاصة لـ GitHub Pages
      if (window.location.hostname.includes('github.io')) {
        console.log('🌐 تم اكتشاف GitHub Pages - تطبيق إعدادات خاصة');
        
        // تمكين استمرارية الجلسة
        window.fbAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
          .catch(err => console.log('⚠️ تحذير في استمرارية الجلسة:', err));
      }
      
      // تحديث الحالة
      window.firebaseState.ready = true;
      window.firebaseState.initialized = true;
      window.firebaseState.error = null;
      
      console.log('✅ Firebase مهيأ بنجاح!');
      console.log('📊 المشروع:', firebaseConfig.projectId);
      
      // عرض رسالة النجاح
      showFirebaseSuccess();
      
      resolve({
        app: app,
        auth: window.fbAuth,
        db: window.fbDb,
        storage: window.fbStorage
      });
      
    } catch (error) {
      console.error('❌ خطأ في تهيئة Firebase:', error);
      
      window.firebaseState.error = error.message;
      
      // تحليل الخطأ
      const errorAnalysis = analyzeFirebaseError(error);
      console.log('🔍 تحليل الخطأ:', errorAnalysis);
      
      reject(new Error(`فشل تهيئة Firebase: ${errorAnalysis}`));
    }
  });
}

// تحليل أخطاء Firebase
function analyzeFirebaseError(error) {
  const errorCode = error.code || '';
  const errorMessage = error.message || '';
  
  if (errorCode.includes('network') || errorMessage.includes('Network')) {
    return 'مشكلة في الشبكة - تحقق من اتصال الإنترنت';
  }
  
  if (errorCode.includes('permission') || errorMessage.includes('permission')) {
    return 'مشكلة في الصلاحيات - تحقق من إعدادات Firebase Console';
  }
  
  if (errorCode.includes('invalid-api-key') || errorMessage.includes('API key')) {
    return 'API Key غير صحيح - تأكد من بيانات firebaseConfig';
  }
  
  if (errorCode.includes('project') || errorMessage.includes('project')) {
    return 'المشروع غير موجود - تحقق من projectId في Firebase Console';
  }
  
  if (errorCode.includes('auth/domain-not-authorized')) {
    return 'المجال غير مصرح به - أضف ashraf-dev11.github.io في Firebase Console → Authentication → Settings';
  }
  
  return `خطأ تقني: ${errorMessage.substring(0, 100)}`;
}

// عرض رسالة نجاح Firebase
function showFirebaseSuccess() {
  const successDiv = document.createElement('div');
  successDiv.id = 'firebase-global-success';
  successDiv.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    padding: 15px 20px;
    background: linear-gradient(135deg, #4CAF50, #2E7D32);
    color: white;
    border-radius: 10px;
    z-index: 10000;
    box-shadow: 0 5px 20px rgba(76, 175, 80, 0.3);
    font-weight: bold;
    animation: firebaseSlideIn 0.5s ease;
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: 350px;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255,255,255,0.2);
  `;
  
  successDiv.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="font-size: 24px;">🎉</div>
      <div>
        <div style="font-size: 16px; font-weight: bold;">Firebase يعمل!</div>
        <div style="font-size: 12px; opacity: 0.9; margin-top: 3px;">المشروع: ${firebaseConfig.projectId}</div>
      </div>
    </div>
  `;
  
  document.body.appendChild(successDiv);
  
  // إخفاء الرسالة بعد 5 ثواني
  setTimeout(() => {
    successDiv.style.animation = 'firebaseSlideOut 0.5s ease';
    setTimeout(() => successDiv.remove(), 500);
  }, 5000);
}

// ============================================
// التهيئة التلقائية
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 بدء تهيئة Firebase تلقائياً...');
  
  // تأخير لضمان تحميل الصفحة
  setTimeout(() => {
    smartFirebaseInit()
      .then((firebaseServices) => {
        console.log('✅ التهيئة التلقائية ناجحة');
        
        // إعداد المستمعين
        setupFirebaseListeners(firebaseServices);
        
        // اختبار الاتصال
        testFirebaseConnection();
      })
      .catch((error) => {
        console.error('❌ فشل التهيئة التلقائية:', error);
        
        // عرض رسالة الخطأ
        showFirebaseError(error.message);
        
        // وضع الطوارئ: تشغيل بدون Firebase
        emergencyMode();
      });
  }, 1500);
});

// إعداد المستمعين
function setupFirebaseListeners(services) {
  const { auth } = services;
  
  // مراقبة حالة المصادقة
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log('👤 مستخدم مسجل:', user.email);
      updateUIForLoggedInUser(user);
    } else {
      console.log('👤 لا يوجد مستخدم مسجل');
      updateUIForVisitor();
    }
  }, (error) => {
    console.warn('⚠️ تحذير في المصادقة:', error);
  });
}

// اختبار الاتصال
async function testFirebaseConnection() {
  try {
    if (!window.firebaseState.ready) {
      console.log('⏳ Firebase غير جاهز بعد...');
      return false;
    }
    
    // اختبار بسيط
    const testDoc = await window.fbDb.collection('_connection_tests').doc('github_pages').get();
    
    if (!testDoc.exists) {
      await window.fbDb.collection('_connection_tests').doc('github_pages').set({
        test: true,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        hostname: window.location.hostname,
        userAgent: navigator.userAgent.substring(0, 100)
      });
    }
    
    console.log('✅ اختبار الاتصال ناجح');
    return true;
    
  } catch (error) {
    console.error('❌ فشل اختبار الاتصال:', error);
    return false;
  }
}

// وضع الطوارئ (بدون Firebase)
function emergencyMode() {
  console.log('🚨 تشغيل وضع الطوارئ (بدون Firebase)');
  
  const warningDiv = document.createElement('div');
  warningDiv.id = 'firebase-emergency-warning';
  warningDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #FF9800, #F57C00);
    color: white;
    padding: 15px 20px;
    text-align: center;
    z-index: 9999;
    font-weight: bold;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `;
  
  warningDiv.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
      <i class="fas fa-exclamation-triangle"></i>
      <span>الموقع يعمل بدون قاعدة بيانات - Firebase غير متصل</span>
      <button onclick="retryFirebaseInit()" style="background: white; color: #FF9800; border: none; padding: 5px 10px; border-radius: 4px; margin-right: 10px; cursor: pointer;">
        🔄 إعادة المحاولة
      </button>
    </div>
  `;
  
  document.body.appendChild(warningDiv);
  
  // إضافة الزر للرأس إذا لم يكن موجوداً
  const style = document.createElement('style');
  style.textContent = `
    @keyframes firebaseSlideIn {
      from { transform: translateY(-100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes firebaseSlideOut {
      from { transform: translateY(0); opacity: 1; }
      to { transform: translateY(-100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// إعادة المحاولة
window.retryFirebaseInit = function() {
  console.log('🔄 إعادة محاولة تهيئة Firebase...');
  
  const warningDiv = document.getElementById('firebase-emergency-warning');
  if (warningDiv) warningDiv.remove();
  
  smartFirebaseInit()
    .then(() => {
      console.log('✅ إعادة المحاولة ناجحة');
      location.reload();
    })
    .catch(error => {
      console.error('❌ فشلت إعادة المحاولة:', error);
      emergencyMode();
    });
};

// ============================================
// دوال للاستخدام العام
// ============================================

// دالة اختبار شاملة
window.testFirebaseComprehensive = async function() {
  console.log('🔍 بدء اختبار شامل لـ Firebase...');
  
  const results = {
    sdk: false,
    config: false,
    auth: false,
    firestore: false,
    domain: false
  };
  
  try {
    // اختبار 1: SDK
    if (typeof firebase === 'undefined') {
      throw new Error('Firebase SDK غير محمل');
    }
    results.sdk = true;
    console.log('✅ SDK: ✓');
    
    // اختبار 2: التهيئة
    if (!firebase.apps.length) {
      throw new Error('Firebase غير مهيأ');
    }
    results.config = true;
    console.log('✅ التهيئة: ✓');
    
    // اختبار 3: Authentication
    const auth = firebase.auth();
    if (!auth) throw new Error('Authentication غير متاح');
    results.auth = true;
    console.log('✅ Authentication: ✓');
    
    // اختبار 4: Firestore
    const db = firebase.firestore();
    if (!db) throw new Error('Firestore غير متاح');
    results.firestore = true;
    console.log('✅ Firestore: ✓');
    
    // اختبار 5: المجال
    const testWrite = await db.collection('_domain_tests').add({
      test: 'domain_check',
      host: window.location.hostname,
      timestamp: new Date().toISOString()
    });
    
    results.domain = true;
    console.log('✅ المجال مصرح: ✓');
    
    // النتيجة النهائية
    const success = Object.values(results).every(r => r === true);
    
    if (success) {
      return {
        success: true,
        message: '🎉 جميع اختبارات Firebase ناجحة!',
        results: results,
        project: firebaseConfig.projectId
      };
    } else {
      return {
        success: false,
        message: '⚠️ بعض الاختبارات فشلت',
        results: results,
        failed: Object.keys(results).filter(key => !results[key])
      };
    }
    
  } catch (error) {
    console.error('❌ فشل الاختبار الشامل:', error);
    return {
      success: false,
      message: `❌ فشل الاختبار: ${error.message}`,
      results: results,
      error: error.message
    };
  }
};

// دالة للمساعدة في الإعداد
window.getFirebaseSetupGuide = function() {
  const guide = `
🎯 دليل إعداد Firebase خطوة بخطوة:

1. 🔗 ادخل على: https://console.firebase.google.com/project/my-marketplace-64afa

2. 📱 أنشئ تطبيق ويب:
   - ⚙ → Project settings
   - Your apps → Add app (زر </>)
   - اسم: my-marketplace-web
   - Register app

3. 🔐 فعل Authentication:
   - Build → Authentication
   - Get started
   - Email/Password → Enable → Save

4. 🗄️ فعل Firestore Database:
   - Build → Firestore Database
   - Create database
   - Start in test mode
   - Next → Enable

5. 🌐 أضف مجال موقعك:
   - Build → Authentication → Settings
   - Authorized domains → Add domain
   - أضف: ashraf-dev11.github.io
   - ✅ Add

6. 🔄 انسخ firebaseConfig الجديد من صفحة Project settings

7. 💾 استبدل بيانات firebase-config.js بالبيانات الجديدة

8. 🚀 ارفع الملفات على GitHub

9. ✅ افتح موقعك واختبر Firebase!
  `;
  
  console.log(guide);
  alert('📋 افتح Console (F12) لرؤية دليل الإعداد الكامل');
  
  return guide;
};

// ============================================
// تصدير
// ============================================

window.initializeFirebaseSmart = smartFirebaseInit;
window.getFirebaseState = () => window.firebaseState;
window.isFirebaseOperational = () => window.firebaseState.ready === true;
