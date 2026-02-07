// ============================================
// نظام المصادقة - Authentication
// ============================================

const AuthSystem = {
    // تسجيل دخول
    login: async function(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            console.log('✅ تم تسجيل الدخول:', userCredential.user.email);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error('❌ خطأ في تسجيل الدخول:', error.message);
            return { success: false, error: error.message };
        }
    },
    
    // تسجيل مستخدم جديد
    register: async function(userData) {
        try {
            // إنشاء المستخدم
            const userCredential = await auth.createUserWithEmailAndPassword(
                userData.email,
                userData.password
            );
            
            // حفظ البيانات الإضافية
            await db.collection('users').doc(userCredential.user.uid).set({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                userType: userData.userType || 'vendor',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'active'
            });
            
            // إذا كان بائعاً، ننشئ له متجر
            if (userData.userType === 'vendor') {
                await db.collection('vendors').doc(userCredential.user.uid).set({
                    vendorId: userCredential.user.uid,
                    storeName: userData.storeName || `متجر ${userData.name}`,
                    email: userData.email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    status: 'active',
                    plan: 'free'
                });
            }
            
            console.log('✅ تم التسجيل بنجاح:', userCredential.user.email);
            return { success: true, user: userCredential.user };
            
        } catch (error) {
            console.error('❌ خطأ في التسجيل:', error.message);
            return { success: false, error: error.message };
        }
    },
    
    // تسجيل خروج
    logout: async function() {
        try {
            await auth.signOut();
            console.log('✅ تم تسجيل الخروج');
            return { success: true };
        } catch (error) {
            console.error('❌ خطأ في تسجيل الخروج:', error.message);
            return { success: false, error: error.message };
        }
    },
    
    // إعادة تعيين كلمة المرور
    resetPassword: async function(email) {
        try {
            await auth.sendPasswordResetEmail(email);
            console.log('✅ تم إرسال رابط إعادة التعيين');
            return { success: true };
        } catch (error) {
            console.error('❌ خطأ في إعادة التعيين:', error.message);
            return { success: false, error: error.message };
        }
    },
    
    // تحديث ملف المستخدم
    updateProfile: async function(userId, data) {
        try {
            await db.collection('users').doc(userId).update(data);
            console.log('✅ تم تحديث الملف الشخصي');
            return { success: true };
        } catch (error) {
            console.error('❌ خطأ في تحديث الملف:', error.message);
            return { success: false, error: error.message };
        }
    },
    
    // التحقق من صلاحيات المستخدم
    checkPermission: async function(userId, requiredRole) {
        try {
            const userDoc = await db.collection('users').doc(userId).get();
            
            if (!userDoc.exists) {
                return { hasPermission: false, error: 'المستخدم غير موجود' };
            }
            
            const userData = userDoc.data();
            const hasPermission = userData.userType === requiredRole || 
                                 userData.userType === 'admin';
            
            return { 
                hasPermission: hasPermission, 
                userType: userData.userType 
            };
            
        } catch (error) {
            console.error('❌ خطأ في التحقق من الصلاحيات:', error.message);
            return { hasPermission: false, error: error.message };
        }
    }
};

// جعل النظام متاحاً بشكل عام
window.AuthSystem = AuthSystem;
