// ============================================
// FIREBASE CONFIG - إعدادات فايربيز
// ============================================

// بيانات مشروع Firebase الخاص بك
const firebaseConfig = {
    apiKey: "AIzaSyBKNo5VBqNNEW0NffIop_Ufett-HOAQKkE",
    authDomain: "my-marketplace-64afa.firebaseapp.com",
    projectId: "my-marketplace-64afa",
    storageBucket: "my-marketplace-64afa.firebasestorage.app",
    messagingSenderId: "607733189687",
    appId: "1:607733189687:web:1566e5a81ec3d71ed603b2"
};

// حالة Firebase
let firebaseApp, auth, db, storage;
window.firebaseReady = false;

// تهيئة Firebase
function initializeFirebase() {
    try {
        // التهيئة
        firebaseApp = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        storage = firebase.storage();
        
        // تخزين في window للاستخدام العام
        window.firebaseApp = firebaseApp;
        window.auth = auth;
        window.db = db;
        window.storage = storage;
        window.firebaseReady = true;
        
        console.log('✅ Firebase initialized successfully!');
        console.log('📊 Project:', firebaseConfig.projectId);
        
        // إظهار رسالة نجاح
        showFirebaseStatus('success', 'Firebase متصل بنجاح');
        
        return true;
        
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        showFirebaseStatus('error', error.message);
        return false;
    }
}

// إظهار حالة Firebase
function showFirebaseStatus(type, message) {
    const statusDiv = document.createElement('div');
    statusDiv.className = `alert alert-${type}`;
    statusDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(statusDiv);
    setTimeout(() => statusDiv.remove(), 3000);
}

// اختبار اتصال Firebase
window.testFirebaseConnection = async function() {
    if (!window.firebaseReady) {
        alert('❌ Firebase غير مهيأ');
        return false;
    }
    
    try {
        // اختبار الكتابة
        await db.collection('testConnection').doc('test').set({
            timestamp: new Date().toISOString(),
            test: true
        });
        
        alert('✅ Firebase يعمل بنجاح!');
        return true;
        
    } catch (error) {
        alert(`❌ خطأ في Firebase: ${error.message}`);
        return false;
    }
};

// التهيئة التلقائية
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 جاري تهيئة Firebase...');
    setTimeout(initializeFirebase, 1000);
});

// إنشاء مستخدم تجريبي
window.createTestUser = async function() {
    try {
        const email = `test${Date.now()}@example.com`;
        const password = 'Test123456';
        
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // حفظ بيانات إضافية
        await db.collection('users').doc(userCredential.user.uid).set({
            email: email,
            name: 'مستخدم تجريبي',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            userType: 'vendor'
        });
        
        alert(`✅ تم إنشاء مستخدم تجريبي!\n\nالبريد: ${email}\nكلمة المرور: ${password}`);
        
        return userCredential;
        
    } catch (error) {
        alert(`❌ خطأ في إنشاء المستخدم: ${error.message}`);
        return null;
    }
};

// إضافة منتج تجريبي
window.addTestProduct = async function() {
    try {
        const productData = {
            name: 'منتج تجريبي',
            price: 99.99,
            category: 'إلكترونيات',
            description: 'هذا منتج تجريبي تم إضافته عبر Firebase',
            vendorId: 'test-vendor',
            vendorName: 'متجر تجريبي',
            status: 'active',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'],
            stock: 100
        };
        
        const docRef = await db.collection('products').add(productData);
        
        alert(`✅ تم إضافة منتج تجريبي!\n\nالمعرف: ${docRef.id}`);
        
        return docRef.id;
        
    } catch (error) {
        alert(`❌ خطأ في إضافة المنتج: ${error.message}`);
        return null;
    }
};
