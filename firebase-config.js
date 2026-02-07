// ============================================
// Firebase Configuration for HTML Website
// ============================================

// Important: This code works with CDN version of Firebase

const firebaseConfig = {
  apiKey: "AIzaSyBKNo5VBqNNEW0NffIop_Ufett-HOAQKkE",
  authDomain: "my-marketplace-64afa.firebaseapp.com",
  projectId: "my-marketplace-64afa",
  storageBucket: "my-marketplace-64afa.firebasestorage.app",
  messagingSenderId: "607733189687",
  appId: "1:607733189687:web:1566e5a81ec3d71ed603b2"
};

// ============================================
// Firebase Initialization
// ============================================

// Global variable to track Firebase state
window.firebaseLoaded = false;
window.firebaseInitialized = false;
window.firebaseErrorMessage = null;

// Initialize Firebase when SDK is loaded
function initializeFirebase() {
    console.log('🚀 Starting Firebase initialization...');
    
    try {
        // Check if Firebase SDK is loaded
        if (typeof firebase === 'undefined') {
            throw new Error('Firebase SDK is not loaded. Check your script tags.');
        }
        
        // Check if Firebase is already initialized
        if (firebase.apps.length > 0) {
            console.log('✅ Firebase already initialized');
            window.firebaseApp = firebase.app();
        } else {
            // Initialize Firebase
            console.log('🔧 Initializing Firebase...');
            window.firebaseApp = firebase.initializeApp(firebaseConfig);
            console.log('✅ Firebase initialized successfully');
        }
        
        // Initialize services
        window.firebaseAuth = firebase.auth();
        window.firebaseFirestore = firebase.firestore();
        window.firebaseStorage = firebase.storage();
        
        // Update global state
        window.firebaseLoaded = true;
        window.firebaseInitialized = true;
        
        console.log('🎉 Firebase services ready!');
        console.log('📊 Project ID:', firebaseConfig.projectId);
        
        // Show success message
        showFirebaseStatus('success', 'Firebase connected!');
        
        return true;
        
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        window.firebaseErrorMessage = error.message;
        
        showFirebaseStatus('error', `Firebase error: ${error.message}`);
        return false;
    }
}

// Show Firebase status message
function showFirebaseStatus(type, message) {
    const statusDiv = document.createElement('div');
    statusDiv.id = 'firebase-status-' + Date.now();
    statusDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: statusSlideIn 0.5s ease;
    `;
    
    if (type === 'success') {
        statusDiv.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
        statusDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-check-circle" style="font-size: 20px;"></i>
                <span>${message}</span>
            </div>
        `;
    } else {
        statusDiv.style.background = 'linear-gradient(135deg, #f44336, #c62828)';
        statusDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 20px;"></i>
                <span>${message}</span>
            </div>
        `;
    }
    
    document.body.appendChild(statusDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        statusDiv.style.animation = 'statusSlideOut 0.5s ease';
        setTimeout(() => statusDiv.remove(), 500);
    }, 5000);
}

// Add animation styles
if (!document.getElementById('firebase-animations')) {
    const style = document.createElement('style');
    style.id = 'firebase-animations';
    style.textContent = `
        @keyframes statusSlideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes statusSlideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Auto-initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Page loaded, waiting for Firebase SDK...');
    
    // Check if Firebase is loaded every second
    let attempts = 0;
    const maxAttempts = 10;
    
    const checkInterval = setInterval(() => {
        attempts++;
        
        if (typeof firebase !== 'undefined') {
            clearInterval(checkInterval);
            console.log('✅ Firebase SDK detected, initializing...');
            
            // Initialize Firebase
            const initialized = initializeFirebase();
            
            if (initialized) {
                // Set up auth state listener
                window.firebaseAuth.onAuthStateChanged((user) => {
                    if (user) {
                        console.log('👤 User signed in:', user.email);
                        updateUIForUser(user);
                    } else {
                        console.log('👤 No user signed in');
                        updateUIForVisitor();
                    }
                });
            }
            
        } else if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            console.error('❌ Firebase SDK not loaded after', maxAttempts, 'attempts');
            showFirebaseStatus('error', 'Firebase SDK failed to load. Check internet connection.');
        }
    }, 1000);
});

// UI update functions
function updateUIForUser(user) {
    // Hide auth buttons
    const authButtons = document.querySelectorAll('.auth-buttons, .auth-btn');
    authButtons.forEach(btn => {
        if (btn) btn.style.display = 'none';
    });
    
    // Show user info
    const userInfo = document.getElementById('user-info');
    if (userInfo) {
        userInfo.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-user-circle" style="font-size: 20px;"></i>
                <span>${user.email.split('@')[0]}</span>
                <button onclick="firebaseSignOut()" 
                        style="background: #f44336; color: white; border: none; 
                               padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                    تسجيل خروج
                </button>
            </div>
        `;
        userInfo.style.display = 'block';
    }
}

function updateUIForVisitor() {
    // Show auth buttons
    const authButtons = document.querySelectorAll('.auth-buttons, .auth-btn');
    authButtons.forEach(btn => {
        if (btn) btn.style.display = 'flex';
    });
    
    // Hide user info
    const userInfo = document.getElementById('user-info');
    if (userInfo) userInfo.style.display = 'none';
}

// Sign out function
window.firebaseSignOut = function() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        window.firebaseAuth.signOut()
            .then(() => {
                showFirebaseStatus('success', 'تم تسجيل الخروج بنجاح');
                window.location.reload();
            })
            .catch(error => {
                showFirebaseStatus('error', 'خطأ في تسجيل الخروج: ' + error.message);
            });
    }
};

// Test Firebase connection
window.testFirebaseConnection = function() {
    if (!window.firebaseInitialized) {
        const result = initializeFirebase();
        if (!result) {
            alert('❌ فشل تهيئة Firebase!\n\nتحقق من:\n1. اتصال الإنترنت\n2. API Keys\n3. Console للتفاصيل');
            return false;
        }
    }
    
    // Simple test
    try {
        const db = window.firebaseFirestore;
        const testRef = db.collection('_tests').doc('connection');
        
        testRef.set({
            test: true,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            hostname: window.location.hostname
        }).then(() => {
            alert(`✅ Firebase يعمل بشكل ممتاز!\n\nالمشروع: ${firebaseConfig.projectId}\nالدومين: ${window.location.hostname}`);
        });
        
        return true;
        
    } catch (error) {
        alert(`❌ خطأ في Firebase:\n${error.message}`);
        return false;
    }
};

// Check Firebase status
window.isFirebaseReady = function() {
    return window.firebaseInitialized === true;
};
