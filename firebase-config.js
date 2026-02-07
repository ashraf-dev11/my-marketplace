// ============================================
// SMART FIREBASE DETECTOR - يعمل مع مشروع واحد
// ============================================

// ============================================
// 1. Promise للانتظار حتى يصبح Firebase جاهز
// ============================================
window.firebaseReady = new Promise((resolve, reject) => {
    window.firebaseResolve = resolve;
    window.firebaseReject = reject;
});

// ============================================
// 2. معرفة أي موقع نحن فيه
// ============================================
const currentURL = window.location.href;
const currentHost = window.location.hostname;
const currentPath = window.location.pathname;

console.log('🔍 اكتشاف الموقع الحالي...');
console.log('🌐 الرابط:', currentURL);
console.log('🏠 الدومين:', currentHost);
console.log('📁 المسار:', currentPath);

// ============================================
// 3. المشاريع المتاحة
// ============================================
const FIREBASE_PROJECTS = {
    'MARKETPLACE': {
        name: 'منصتي - متاجر متعددة',
        id: 'my-marketplace-64afa',
        config: {
            apiKey: "AIzaSyBKNo5VBqNNEW0NffIop_Ufett-HOAQKkE",
            authDomain: "my-marketplace-64afa.firebaseapp.com",
            projectId: "my-marketplace-64afa",
            storageBucket: "my-marketplace-64afa.firebasestorage.app",
            messagingSenderId: "607733189687",
            appId: "1:607733189687:web:1566e5a81ec3d71ed603b2"
        }
    }
};

// ============================================
// 4. تحديد المشروع (دائماً marketplace)
// ============================================
const currentProject = FIREBASE_PROJECTS.MARKETPLACE;
const firebaseConfig = currentProject.config;

console.log('🎯 المشروع المختار:', currentProject.name);
console.log('🔑 API Key:', firebaseConfig.apiKey.substring(0, 15) + '...');

// ============================================
// 5. تهيئة Firebase
// ============================================
window.firebaseState = {
    ready: false,
    project: currentProject.id,
    error: null
};

function initializeFirebase() {
    console.log(`🚀 بدء تهيئة Firebase لـ ${currentProject.name}...`);
    
    // التحقق من Firebase SDK
    if (typeof firebase === 'undefined') {
        const errorMsg = 'Firebase SDK غير محمل! تحقق من اتصال الإنترنت';
        console.error('❌', errorMsg);
        showFirebaseStatus('error', errorMsg);
        window.firebaseState.error = errorMsg;
        window.firebaseReject(new Error(errorMsg));
        return false;
    }
    
    try {
        // التهيئة الجديدة
        console.log('🔧 جاري تهيئة Firebase...');
        window.firebaseApp = firebase.initializeApp(firebaseConfig);
        
        // تهيئة الخدمات
        window.auth = firebase.auth();
        window.db = firebase.firestore();
        window.storage = firebase.storage();
        
        // تحديث الحالة
        window.firebaseState.ready = true;
        window.firebaseState.error = null;
        
        console.log('🎉 Firebase مهيأ بنجاح!');
        console.log('📦 Project:', window.firebaseApp.options.projectId);
        
        // حل الـ Promise
        window.firebaseResolve();
        
        // إظهار رسالة النجاح
        showFirebaseStatus('success', `${currentProject.name} - يعمل الآن`);
        
        // إعداد المستمعين
        setupFirebaseListeners();
        
        return true;
        
    } catch (error) {
        console.error('❌ خطأ في تهيئة Firebase:', error);
        
        let errorMessage = error.message;
        if (error.code === 'app/duplicate-app') {
            errorMessage = 'Firebase مثبت بالفعل من قبل';
        } else if (error.message.includes('invalid-api-key')) {
            errorMessage = 'API Key غير صحيح';
        }
        
        showFirebaseStatus('error', errorMessage);
        window.firebaseState.error = errorMessage;
        window.firebaseReject(error);
        return false;
    }
}

// ============================================
// 6. إعداد المستمعين
// ============================================
function setupFirebaseListeners() {
    if (!window.auth) return;
    
    // مراقبة حالة المصادقة
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

// ============================================
// 7. وظائف الواجهة
// ============================================
function updateUIForUser(user) {
    console.log('🔄 تحديث واجهة للمستخدم:', user.email);
}

function updateUIForVisitor() {
    console.log('🔄 تحديث واجهة للزوار');
}

// ============================================
// 8. عرض حالة Firebase
// ============================================
function showFirebaseStatus(type, message) {
    // إزالة أي رسالة سابقة
    const oldMessages = document.querySelectorAll('.firebase-status-message');
    oldMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'firebase-status-message';
    messageDiv.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        animation: statusSlideIn 0.5s ease;
        display: flex;
        align-items: center;
        gap: 12px;
        max-width: 400px;
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255,255,255,0.1);
    `;
    
    if (type === 'success') {
        messageDiv.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
        messageDiv.innerHTML = `
            <i class="fas fa-check-circle" style="font-size: 24px;"></i>
            <div>
                <div style="font-size: 16px; font-weight: bold;">✅ ${message}</div>
                <div style="font-size: 12px; opacity: 0.9; margin-top: 3px;">${currentProject.id}</div>
            </div>
        `;
    } else {
        messageDiv.style.background = 'linear-gradient(135deg, #f44336, #c62828)';
        messageDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle" style="font-size: 24px;"></i>
            <div>
                <div style="font-size: 16px; font-weight: bold;">❌ ${message}</div>
                <div style="font-size: 12px; opacity: 0.9; margin-top: 3px;">${currentProject.id}</div>
            </div>
        `;
    }
    
    document.body.appendChild(messageDiv);
    
    // إضافة أنماط CSS إذا لم تكن موجودة
    if (!document.getElementById('firebase-animations')) {
        const style = document.createElement('style');
        style.id = 'firebase-animations';
        style.textContent = `
            @keyframes statusSlideIn {
                from { transform: translateX(100px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes statusSlideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // إخفاء الرسالة بعد 5 ثواني
    setTimeout(() => {
        messageDiv.style.animation = 'statusSlideOut 0.5s ease';
        setTimeout(() => messageDiv.remove(), 500);
    }, 5000);
}

// ============================================
// 9. التهيئة التلقائية
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 الصفحة محملة، جاري تهيئة Firebase...');
    
    // الانتظار قليلاً لتحميل SDK
    setTimeout(() => {
        const initialized = initializeFirebase();
        
        if (initialized) {
            // إظهار معلومات المشروع في لوحة التحكم
            showProjectInfo();
        }
    }, 1000);
});

// ============================================
// 10. لوحة معلومات المشروع
// ============================================
function showProjectInfo() {
    const infoPanel = document.createElement('div');
    infoPanel.id = 'firebase-info-panel';
    infoPanel.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 20px;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 15px;
        padding: 20px;
        box-shadow: 0 5px 25px rgba(0,0,0,0.15);
        z-index: 9998;
        border: 2px solid #4CAF50;
        max-width: 300px;
        backdrop-filter: blur(10px);
    `;
    
    infoPanel.innerHTML = `
        <div style="margin-bottom: 15px;">
            <h4 style="margin: 0 0 10px 0; color: #333; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-project-diagram" style="color: #4CAF50;"></i>
                معلومات المشروع
            </h4>
            <div style="background: #f5f5f5; padding: 10px; border-radius: 8px; margin-bottom: 10px;">
                <div style="font-size: 12px; color: #666;">المشروع:</div>
                <div style="font-weight: bold; color: #4CAF50;">${currentProject.name}</div>
                <div style="font-size: 11px; color: #999;">${currentProject.id}</div>
            </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div style="text-align: center;">
                <div style="font-size: 12px; color: #666;">الحالة</div>
                <div id="project-status" style="color: #4CAF50; font-weight: bold;">✅ متصل</div>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 12px; color: #666;">النوع</div>
                <div style="color: #2196F3; font-weight: bold;">متاجر</div>
            </div>
        </div>
        
        <button onclick="testCurrentProject()" style="
            background: #2196F3;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 8px;
            cursor: pointer;
            width: 100%;
            margin-top: 15px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        ">
            <i class="fas fa-test"></i> اختبار المشروع
        </button>
        
        <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #eee;">
            <div style="font-size: 11px; color: #999; text-align: center;">
                ${new Date().toLocaleDateString('ar-EG')} • ${new Date().toLocaleTimeString('ar-EG')}
            </div>
        </div>
    `;
    
    document.body.appendChild(infoPanel);
    
    // زر إخفاء اللوحة
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        left: 10px;
        background: #f44336;
        color: white;
        border: none;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    closeBtn.onclick = () => infoPanel.remove();
    infoPanel.appendChild(closeBtn);
}

// ============================================
// 11. دوال اختبار
// ============================================
window.testCurrentProject = async function() {
    if (!window.firebaseState.ready) {
        alert('❌ Firebase غير مهيأ!');
        return false;
    }
    
    try {
        // اختبار قاعدة البيانات
        const testRef = window.db.collection('_project_tests').doc('current_test');
        await testRef.set({
            project: currentProject.id,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            url: window.location.href,
            test: 'success'
        });
        
        alert(`✅ اختبار ناجح!\n\n🏆 المشروع: ${currentProject.name}\n📊 الـ ID: ${currentProject.id}\n🌐 الرابط: ${window.location.hostname}\n\n✅ Firebase يعمل بشكل ممتاز!`);
        
        return true;
        
    } catch (error) {
        alert(`❌ فشل الاختبار!\n\nالخطأ: ${error.message}\n\nالمشروع: ${currentProject.name}`);
        return false;
    }
};

// ============================================
// 12. إظهار معلومات التصحيح
// ============================================
window.showFirebaseDebugInfo = function() {
    const info = `
🎯 معلومات Firebase:
══════════════════════
📋 المشروع: ${currentProject.name}
🔑 الـ ID: ${currentProject.id}
✅ الحالة: ${window.firebaseState.ready ? 'متصل' : 'غير متصل'}
🌐 الدومين: ${currentHost}
📁 المسار: ${currentPath}
⏰ الوقت: ${new Date().toLocaleTimeString()}
══════════════════════
📊 API Key: ${firebaseConfig.apiKey.substring(0, 20)}...
🏠 Auth Domain: ${firebaseConfig.authDomain}
══════════════════════
    `;
    
    console.log(info);
    alert('📋 افتح Console (F12) لرؤية معلومات التصحيح الكاملة');
};

// ============================================
// 13. زر التصحيح في الصفحة
// ============================================
setTimeout(() => {
    const debugBtn = document.createElement('button');
    debugBtn.innerHTML = '🐛 تصحيح Firebase';
    debugBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: #9C27B0;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 20px;
        cursor: pointer;
        z-index: 9997;
        font-size: 12px;
        font-weight: bold;
        box-shadow: 0 3px 10px rgba(156, 39, 176, 0.3);
    `;
    debugBtn.onclick = showFirebaseDebugInfo;
    document.body.appendChild(debugBtn);
}, 2000);

// ============================================
// 14. تصدير المعلومات
// ============================================
console.log('🔧 Firebase Config Loaded Successfully!');
console.log('🎯 Current Project:', currentProject.name);
console.log('📊 Config:', {
    projectId: firebaseConfig.projectId,
    apiKeyPreview: firebaseConfig.apiKey.substring(0, 15) + '...',
    host: currentHost
});
