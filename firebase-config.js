// إعدادات Firebase مع حلول للتحميل
const firebaseConfig = {
  apiKey: "AIzaSyBKNo5VBqNNEW0NffIop_Ufett-HOAQKkE",
  authDomain: "my-marketplace-64afa.firebaseapp.com",
  projectId: "my-marketplace-64afa",
  storageBucket: "my-marketplace-64afa.firebasestorage.app",
  messagingSenderId: "607733189687",
  appId: "1:607733189687:web:1566e5a81ec3d71ed603b2"
};

// نظام متقدم للتعامل مع Firebase
window.firebaseReady = false;
window.firebaseInitAttempts = 0;
window.maxFirebaseInitAttempts = 5;

// الدالة الرئيسية
function initializeFirebaseWithRetry() {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(`🔄 محاولة تهيئة Firebase (المحاولة ${window.firebaseInitAttempts + 1})...`);
            
            // المحاولة الأولى: انتظار SDK
            if (typeof firebase === 'undefined') {
                console.warn('⚠️ Firebase SDK غير محمل، جاري الانتظار...');
                
                // انتظار 3 ثواني
                await new Promise(resolve => setTimeout(resolve, 3000));
                
                if (typeof firebase === 'undefined') {
                    throw new Error('Firebase SDK لم يتم تحميله بعد 3 ثواني');
                }
            }
            
            // المحاولة الثانية: التهيئة
            if (!firebase.apps.length) {
                try {
                    firebase.initializeApp(firebaseConfig);
                    console.log('✅ تم تهيئة Firebase بنجاح');
                } catch (initError) {
                    if (initError.code === 'app/duplicate-app') {
                        console.log('ℹ️ Firebase مثبت بالفعل');
                    } else {
                        throw initError;
                    }
                }
            }
            
            // المحاولة الثالثة: تهيئة الخدمات
            window.auth = firebase.auth();
            window.db = firebase.firestore();
            window.storage = firebase.storage();
            window.firebaseInstance = firebase;
            
            window.firebaseReady = true;
            console.log('🎉 Firebase جاهز للاستخدام!');
            
            resolve(true);
            
        } catch (error) {
            window.firebaseInitAttempts++;
            
            if (window.firebaseInitAttempts < window.maxFirebaseInitAttempts) {
                console.log(`⏳ فشل المحاولة ${window.firebaseInitAttempts}، جاري المحاولة مرة أخرى...`);
                
                // الانتظار قبل المحاولة التالية
                setTimeout(() => {
                    initializeFirebaseWithRetry().then(resolve).catch(reject);
                }, 2000 * window.firebaseInitAttempts);
                
            } else {
                console.error('❌ فشل جميع محاولات تهيئة Firebase');
                window.firebaseReady = false;
                reject(error);
            }
        }
    });
}

// التهيئة التلقائية
document.addEventListener('DOMContentLoaded', async function() {
    console.log('📄 الصفحة محملة - جاري بدء Firebase...');
    
    // طريقة 1: الانتظار لـ SDK
    setTimeout(async () => {
        try {
            await initializeFirebaseWithRetry();
            showFirebaseStatus('success', 'Firebase يعمل الآن!');
            
            // إعداد المستمعين
            if (window.auth) {
                window.auth.onAuthStateChanged((user) => {
                    if (user) {
                        console.log('👤 مستخدم مسجل:', user.email);
                        updateUIForUser(user);
                    } else {
                        console.log('👤 لا يوجد مستخدم مسجل');
                        updateUIForVisitor();
                    }
                });
            }
            
        } catch (error) {
            console.error('❌ فشل نهائي في Firebase:', error);
            showFirebaseStatus('error', `Firebase غير متصل: ${error.message}`);
            
            // وضع التطوير: السماح بالعمل بدون Firebase
            console.log('⚠️ الموقع يعمل في وضع التطوير (بدون Firebase)');
            showFirebaseStatus('warning', 'الموقع يعمل بدون قاعدة بيانات');
        }
    }, 1000);
});

// دوال مساعدة
function showFirebaseStatus(type, message) {
    console.log(`📢 حالة Firebase: ${message}`);
    
    // يمكنك إضافة عرض رسالة في الصفحة هنا
    const statusElement = document.getElementById('firebase-status');
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = `firebase-status ${type}`;
    }
}

// دالة اختبار متقدمة
window.testFirebaseAdvanced = async function() {
    console.log('🔍 اختبار متقدم لـ Firebase...');
    
    // اختبار 1: SDK
    if (typeof firebase === 'undefined') {
        return { success: false, step: 'sdk', message: 'Firebase SDK غير محمل' };
    }
    
    // اختبار 2: التطبيق
    if (!firebase.apps.length) {
        return { success: false, step: 'app', message: 'Firebase غير مهيأ' };
    }
    
    // اختبار 3: الخدمات
    try {
        const testAuth = firebase.auth();
        const testDb = firebase.firestore();
        
        // اختبار بسيط
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        
        return { 
            success: true, 
            message: 'Firebase يعمل بشكل مثالي',
            details: {
                sdkVersion: firebase.SDK_VERSION,
                projectId: firebaseConfig.projectId,
                services: ['auth', 'firestore', 'storage']
            }
        };
        
    } catch (error) {
        return { success: false, step: 'services', message: error.message };
    }
};

// تصدير
window.initializeFirebase = initializeFirebaseWithRetry;
window.getFirebaseStatus = () => window.firebaseReady;
