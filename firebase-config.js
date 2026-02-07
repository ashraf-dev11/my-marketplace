// ============================================
// Firebase Configuration - SIMPLE & WORKING
// ============================================

// بيانات مشروع my-marketplace-64afa
const firebaseConfig = {
  apiKey: "AIzaSyBKNo5VBqNNEW0NffIop_Ufett-HOAQKkE",
  authDomain: "my-marketplace-64afa.firebaseapp.com",
  projectId: "my-marketplace-64afa",
  storageBucket: "my-marketplace-64afa.firebasestorage.app",
  messagingSenderId: "607733189687",
  appId: "1:607733189687:web:1566e5a81ec3d71ed603b2"
};

// ============================================
// المتغيرات الأساسية
// ============================================
let isFirebaseInitialized = false;
let initializationAttempts = 0;

// ============================================
// 1. الدالة الرئيسية لتهيئة Firebase
// ============================================
function initializeFirebaseSimple() {
    initializationAttempts++;
    console.log(`🔄 محاولة تهيئة Firebase #${initializationAttempts}`);
    
    // التحقق من وجود Firebase SDK
    if (typeof firebase === 'undefined') {
        console.error('❌ خطأ: Firebase SDK غير محمل!');
        
        // إظهار رسالة خطأ واضحة
        document.body.insertAdjacentHTML('beforeend', `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: #f44336;
                color: white;
                padding: 15px;
                text-align: center;
                font-weight: bold;
                z-index: 9999;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            ">
                ❌ Firebase SDK غير محمل! تأكد من اتصال الإنترنت
                <button onclick="location.reload()" style="
                    background: white;
                    color: #f44336;
                    border: none;
                    padding: 5px 15px;
                    margin-right: 10px;
                    border-radius: 4px;
                    cursor: pointer;
                ">
                    🔄 إعادة تحميل
                </button>
            </div>
        `);
        
        return false;
    }
    
    try {
        // التحقق من التهيئة السابقة
        if (firebase.apps.length > 0) {
            console.log('✅ Firebase مثبت بالفعل');
            isFirebaseInitialized = true;
            return true;
        }
        
        // التهيئة الأولى
        console.log('🚀 جاري تهيئة Firebase لأول مرة...');
        firebase.initializeApp(firebaseConfig);
        
        // تعيين الخدمات
        window.fbAuth = firebase.auth();
        window.fbDb = firebase.firestore();
        window.fbStorage = firebase.storage();
        
        isFirebaseInitialized = true;
        console.log('🎉 تم تهيئة Firebase بنجاح!');
        console.log('📊 Project ID:', firebase.app().options.projectId);
        
        // إظهار رسالة نجاح
        showSuccessMessage();
        
        return true;
        
    } catch (error) {
        console.error('❌ خطأ في تهيئة Firebase:', error);
        
        // عرض تفاصيل الخطأ
        document.body.insertAdjacentHTML('beforeend', `
            <div style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #ff9800;
                color: white;
                padding: 15px;
                border-radius: 8px;
                max-width: 300px;
                z-index: 9999;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            ">
                <strong>⚠️ تحذير Firebase:</strong><br>
                ${error.message.substring(0, 100)}...
                <br><br>
                <small>Project: ${firebaseConfig.projectId}</small>
            </div>
        `);
        
        return false;
    }
}

// ============================================
// 2. إظهار رسالة النجاح
// ============================================
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.id = 'firebase-success';
    successDiv.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 9998;
        box-shadow: 0 3px 15px rgba(76, 175, 80, 0.3);
        animation: slideIn 0.5s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        border: 2px solid rgba(255,255,255,0.3);
    `;
    
    successDiv.innerHTML = `
        <div style="font-size: 20px;">✅</div>
        <div>
            <div>Firebase متصل!</div>
            <div style="font-size: 12px; opacity: 0.9;">my-marketplace-64afa</div>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    // إخفاء بعد 4 ثواني
    setTimeout(() => {
        successDiv.style.opacity = '0';
        successDiv.style.transition = 'opacity 1s';
        setTimeout(() => successDiv.remove(), 1000);
    }, 4000);
}

// ============================================
// 3. إضافة أنماط CSS
// ============================================
if (!document.getElementById('firebase-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'firebase-animation-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// 4. التهيئة التلقائية عند تحميل الصفحة
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 الصفحة محملة - جاري بدء Firebase...');
    
    // المحاولة الأولى بعد تأخير قصير
    setTimeout(() => {
        const initialized = initializeFirebaseSimple();
        
        if (initialized) {
            // إعداد مستمع المصادقة
            if (window.fbAuth) {
                window.fbAuth.onAuthStateChanged((user) => {
                    if (user) {
                        console.log('👤 مستخدم مسجل:', user.email);
                    } else {
                        console.log('👤 لا يوجد مستخدم مسجل');
                    }
                });
            }
            
            // تشغيل اختبار تلقائي
            setTimeout(testFirebaseConnection, 2000);
        } else {
            // محاولة ثانية بعد 3 ثواني
            setTimeout(() => {
                console.log('🔄 محاولة ثانية لتهيئة Firebase...');
                initializeFirebaseSimple();
            }, 3000);
        }
    }, 1000);
});

// ============================================
// 5. دالة اختبار الاتصال (للاستخدام اليدوي)
// ============================================
window.testFirebaseConnection = async function() {
    console.log('🔍 بدء اختبار Firebase...');
    
    // التحقق من التهيئة
    if (!isFirebaseInitialized) {
        const result = initializeFirebaseSimple();
        if (!result) {
            alert('❌ Firebase غير مهيأ!\n\nجاري المحاولة مرة أخرى...');
            return false;
        }
    }
    
    try {
        // اختبار بسيط للاتصال
        const testData = {
            test: true,
            timestamp: new Date().toISOString(),
            page: window.location.href,
            project: firebaseConfig.projectId
        };
        
        // محاولة الكتابة إلى Firestore
        await window.fbDb.collection('_connection_tests').add(testData);
        
        // رسالة النجاح
        alert(`✅ Firebase يعمل بشكل ممتاز!\n\n✅ المشروع: ${firebaseConfig.projectId}\n✅ الدومين: ${window.location.hostname}\n✅ الوقت: ${new Date().toLocaleTimeString()}`);
        
        console.log('🎊 اختبار Firebase ناجح!');
        return true;
        
    } catch (error) {
        console.error('❌ فشل اختبار Firebase:', error);
        
        // رسالة الخطأ
        alert(`❌ فشل اختبار Firebase!\n\nالخطأ: ${error.message}\n\nجاري المحاولة مرة أخرى...`);
        
        // إعادة المحاولة
        setTimeout(() => testFirebaseConnection(), 2000);
        return false;
    }
};

// ============================================
// 6. دالة للتحقق من حالة Firebase
// ============================================
window.getFirebaseStatus = function() {
    return {
        initialized: isFirebaseInitialized,
        projectId: firebaseConfig.projectId,
        attempts: initializationAttempts,
        sdkLoaded: typeof firebase !== 'undefined',
        appsCount: typeof firebase !== 'undefined' ? firebase.apps.length : 0
    };
};

// ============================================
// 7. إظهار زر الاختبار في الصفحة
// ============================================
// إضافة زر اختبار Firebase
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const testButton = document.createElement('button');
        testButton.id = 'firebase-test-button';
        testButton.innerHTML = '🔥 اختبار Firebase';
        testButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: #FF9800;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            z-index: 9997;
            font-weight: bold;
            box-shadow: 0 3px 10px rgba(255, 152, 0, 0.3);
            transition: all 0.3s;
        `;
        
        testButton.onmouseover = () => {
            testButton.style.transform = 'scale(1.05)';
            testButton.style.boxShadow = '0 5px 15px rgba(255, 152, 0, 0.5)';
        };
        
        testButton.onmouseout = () => {
            testButton.style.transform = 'scale(1)';
            testButton.style.boxShadow = '0 3px 10px rgba(255, 152, 0, 0.3)';
        };
        
        testButton.onclick = testFirebaseConnection;
        
        document.body.appendChild(testButton);
    }, 2000);
});

// ============================================
// 8. تصدير المعلومات للتشخيص
// ============================================
console.log('🔧 Firebase Config Loaded:', {
    projectId: firebaseConfig.projectId,
    apiKey: firebaseConfig.apiKey.substring(0, 10) + '...',
    timestamp: new Date().toLocaleTimeString()
});
