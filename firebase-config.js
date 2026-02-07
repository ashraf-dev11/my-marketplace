// ============================================
// ULTRA SMART FIREBASE DETECTOR - يعمل مع كل المشاريع
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

// اكتشاف repo على GitHub
const getGitHubRepo = () => {
    if (currentHost.includes('github.io')) {
        const pathParts = currentPath.split('/').filter(Boolean);
        return pathParts[0]; // اسم الـ repo الأول
    }
    return null;
};

const githubRepo = getGitHubRepo();

console.log('🔍 اكتشاف الموقع الحالي...');
console.log('🌐 الدومين:', currentHost);
console.log('📁 المسار:', currentPath);
console.log('📦 GitHub Repo:', githubRepo || 'غير محدد');

// ============================================
// 3. قاعدة بيانات المشاريع (أعد كتابتها حسب مشاريعك الحقيقية)
// ============================================
const FIREBASE_PROJECTS = {
    // المشروع الأول: my-marketplace-64afa
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
        },
        // المواقع التي تستخدم هذا المشروع
        domains: [
            'my-marketplace', // الاسم في GitHub Pages
            'localhost/my-marketplace',
            '127.0.0.1/my-marketplace',
            'ashraf-dev11.github.io/my-marketplace' // ⬅️ الرابط الحقيقي
        ]
    },
    
    // المشروع الثاني: fittnes-web
    'FITNESS': {
        name: 'موقع اللياقة البدنية',
        id: 'fittnes-web',
        config: {
            apiKey: "AIzaSyA7POxxSjiEHElUMEoQ90TTlBs2WBEE18g",
            authDomain: "fittnes-web.firebaseapp.com",
            projectId: "fittnes-web",
            storageBucket: "fittnes-web.firebasestorage.app",
            messagingSenderId: "1043684216161",
            appId: "1:1043684216161:web:7ffa29e8c215bcc480c920",
            measurementId: "G-8BQBEPH5Z8"
        },
        // المواقع التي تستخدم هذا المشروع
        domains: [
            'fitness-project', // ⬅️ غير هذا حسب اسم repo الحقيقي عندك
            'localhost/fitness-project',
            '127.0.0.1/fitness-project',
            'ashraf-dev11.github.io/fitness-project' // ⬅️ الرابط الحقيقي
        ]
    }
};

// ============================================
// 4. اكتشاف المشروع المناسب تلقائياً
// ============================================
function detectFirebaseProject() {
    // أولاً: اكتشاف من GitHub Repo
    if (githubRepo) {
        for (const [key, project] of Object.entries(FIREBASE_PROJECTS)) {
            if (project.domains.includes(githubRepo)) {
                console.log(`✅ تم اكتشاف من GitHub: ${project.name}`);
                return project;
            }
        }
    }
    
    // ثانياً: البحث في الدومينات
    for (const [key, project] of Object.entries(FIREBASE_PROJECTS)) {
        for (const domain of project.domains) {
            if (currentURL.includes(domain)) {
                console.log(`✅ تم اكتشاف من الدومين: ${project.name}`);
                return project;
            }
        }
    }
    
    // ثالثاً: إذا كان في my-marketplace (افتراضي)
    if (currentPath.includes('my-marketplace')) {
        console.log('✅ اكتشاف تلقائي: موقع my-marketplace');
        return FIREBASE_PROJECTS.MARKETPLACE;
    }
    
    // رابعاً: إذا كان في fitness
    if (currentPath.includes('fitness')) {
        console.log('✅ اكتشاف تلقائي: موقع fitness');
        return FIREBASE_PROJECTS.FITNESS;
    }
    
    // أخيراً: استخدام الافتراضي
    console.log('⚠️ استخدام المشروع الافتراضي (my-marketplace)');
    return FIREBASE_PROJECTS.MARKETPLACE;
}

// ============================================
// 5. تحديد المشروع الحالي
// ============================================
const currentProject = detectFirebaseProject();
const firebaseConfig = currentProject.config;

console.log('🎯 المشروع المختار:', currentProject.name);
console.log('📊 Project ID:', currentProject.id);

// ============================================
// 6. حالة Firebase
// ============================================
window.firebaseState = {
    ready: false,
    project: currentProject.id,
    error: null
};

// ============================================
// 7. تهيئة Firebase الذكية (مع دعم إصدار 8 و 9)
// ============================================
function smartFirebaseInit() {
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
        // إصدار 8.x (firebase.apps موجود)
        if (typeof firebase.apps !== 'undefined') {
            const existingApps = firebase.apps;
            
            if (existingApps.length > 0) {
                const existingApp = existingApps[0];
                if (existingApp.options.projectId === firebaseConfig.projectId) {
                    console.log('✅ Firebase مثبت بالفعل');
                    window.firebaseApp = existingApp;
                    window.auth = firebase.auth();
                    window.db = firebase.firestore();
                    window.storage = firebase.storage();
                } else {
                    console.log('🔄 حذف التطبيق القديم...');
                    existingApp.delete();
                    window.firebaseApp = firebase.initializeApp(firebaseConfig);
                    window.auth = firebase.auth();
                    window.db = firebase.firestore();
                    window.storage = firebase.storage();
                }
            } else {
                window.firebaseApp = firebase.initializeApp(firebaseConfig);
                window.auth = firebase.auth();
                window.db = firebase.firestore();
                window.storage = firebase.storage();
            }
        } 
        // إصدار 9.x (firebase.getApp, initializeApp فقط)
        else if (typeof firebase.getApp !== 'undefined') {
            try {
                window.firebaseApp = firebase.getApp();
                if (window.firebaseApp.options.projectId !== firebaseConfig.projectId) {
                    window.firebaseApp = firebase.initializeApp(firebaseConfig, 'custom-name');
                }
            } catch (e) {
                window.firebaseApp = firebase.initializeApp(firebaseConfig);
            }
            window.auth = firebase.getAuth(window.firebaseApp);
            window.db = firebase.getFirestore(window.firebaseApp);
            window.storage = firebase.getStorage(window.firebaseApp);
        }
        
        // تحديث الحالة
        window.firebaseState.ready = true;
        window.firebaseState.error = null;
        
        console.log('🎉 Firebase مهيأ بنجاح!');
        console.log('🔥 App:', window.firebaseApp.name);
        console.log('👤 Auth:', window.auth.app.name);
        
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
            errorMessage = 'API Key غير صحيح للمشروع الحالي';
        }
        
        showFirebaseStatus('error', errorMessage);
        window.firebaseState.error = errorMessage;
        window.firebaseReject(error);
        return false;
    }
}

// ============================================
// 8. باقي الوظائف (setupFirebaseListeners, showFirebaseStatus, etc.)
// (نفس الكود السابق)
// ============================================

// ============================================
// 9. التهيئة التلقائية مع معالجة الأخطاء
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 الصفحة محملة، جاري تهيئة Firebase الذكية...');
    
    // الانتظار قليلاً لتحميل SDK
    setTimeout(() => {
        const initialized = smartFirebaseInit();
        
        if (initialized) {
            // إظهار معلومات المشروع
            setTimeout(showProjectInfo, 1000);
            
            // إضافة أزرار التحكم
            addControlButtons();
        }
    }, 500);
});

// ============================================
// 10. وظائف جديدة لتحسين التحكم
// ============================================
function addControlButtons() {
    // زر فتح Firebase Console
    const consoleBtn = document.createElement('button');
    consoleBtn.innerHTML = '🚀 فتح Firebase Console';
    consoleBtn.className = 'firebase-control-btn';
    consoleBtn.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: linear-gradient(135deg, #FF6B6B, #FF8E53);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        cursor: pointer;
        z-index: 9996;
        font-size: 14px;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
        display: flex;
        align-items: center;
        gap: 10px;
        transition: all 0.3s;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    consoleBtn.onclick = () => {
        const urls = {
            'my-marketplace-64afa': 'https://console.firebase.google.com/project/my-marketplace-64afa',
            'fittnes-web': 'https://console.firebase.google.com/project/fittnes-web'
        };
        window.open(urls[currentProject.id] || 'https://console.firebase.google.com/', '_blank');
    };
    
    // زر إعادة التهيئة
    const reloadBtn = document.createElement('button');
    reloadBtn.innerHTML = '🔄 إعادة تهيئة Firebase';
    reloadBtn.className = 'firebase-control-btn';
    reloadBtn.style.cssText = `
        position: fixed;
        top: 70px;
        left: 20px;
        background: linear-gradient(135deg, #4ECDC4, #44A08D);
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 20px;
        cursor: pointer;
        z-index: 9995;
        font-size: 12px;
        font-weight: bold;
        box-shadow: 0 3px 10px rgba(78, 205, 196, 0.4);
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    reloadBtn.onclick = () => {
        if (confirm('هل تريد إعادة تهيئة Firebase؟')) {
            location.reload();
        }
    };
    
    // إضافة الأزرار
    document.body.appendChild(consoleBtn);
    document.body.appendChild(reloadBtn);
    
    // تأثيرات hover
    const buttons = document.querySelectorAll('.firebase-control-btn');
    buttons.forEach(btn => {
        btn.onmouseover = () => {
            btn.style.transform = 'translateY(-2px)';
            btn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
        };
        btn.onmouseout = () => {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = btn.style.boxShadow;
        };
    });
}

// ============================================
// 11. تصدير المتغيرات للاستخدام الخارجي
// ============================================
window.currentFirebaseProject = currentProject;
window.isFirebaseReady = () => window.firebaseState.ready;

console.log('🎯 Ultra Smart Firebase Loaded!');
console.log('📊 Current Project:', currentProject.name);
console.log('🔗 GitHub Repo:', githubRepo || 'N/A');
