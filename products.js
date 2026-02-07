// ============================================
// نظام المنتجات - Products
// ============================================ 

const ProductSystem = {
    // جلب جميع المنتجات
    getAllProducts: async function() {
        try {
            const snapshot = await db.collection('products')
                .where('status', '==', 'active')
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
        } catch (error) {
            console.error('❌ خطأ في جلب المنتجات:', error.message);
            return [];
        }
    },
    
    // جلب منتجات بائع معين
    getVendorProducts: async function(vendorId) {
        try {
            const snapshot = await db.collection('products')
                .where('vendorId', '==', vendorId)
                .where('status', '==', 'active')
                .get();
            
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
        } catch (error) {
            console.error('❌ خطأ في جلب منتجات البائع:', error.message);
            return [];
        }
    },
    
    // إضافة منتج جديد
    addProduct: async function(productData) {
        try {
            const docRef = await db.collection('products').add({
                ...productData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'active'
            });
            
            console.log('✅ تم إضافة المنتج:', docRef.id);
            return { success: true, productId: docRef.id };
            
        } catch (error) {
            console.error('❌ خطأ في إضافة المنتج:', error.message);
            return { success: false, error: error.message };
        }
    },
    
    // تحديث منتج
    updateProduct: async function(productId, updateData) {
        try {
            await db.collection('products').doc(productId).update({
                ...updateData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('✅ تم تحديث المنتج:', productId);
            return { success: true };
            
        } catch (error) {
            console.error('❌ خطأ في تحديث المنتج:', error.message);
            return { success: false, error: error.message };
        }
    },
    
    // حذف منتج (تغيير حالة)
    deleteProduct: async function(productId) {
        try {
            await db.collection('products').doc(productId).update({
                status: 'deleted',
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('✅ تم حذف المنتج:', productId);
            return { success: true };
            
        } catch (error) {
            console.error('❌ خطأ في حذف المنتج:', error.message);
            return { success: false, error: error.message };
        }
    },
    
    // استيراد منتج من أمازون
    importFromAmazon: async function(amazonUrl) {
        try {
            // هنا ستكون عملية الاستيراد الفعلية من أمازون
            // في الوقت الحالي، نعود بمنتج تجريبي
            
            const productData = {
                name: 'منتج مستورد من أمازون',
                price: 49.99,
                category: 'مستورد',
                description: 'تم استيراد هذا المنتج من أمازون',
                amazonUrl: amazonUrl,
                source: 'amazon',
                status: 'active'
            };
            
            const result = await this.addProduct(productData);
            return result;
            
        } catch (error) {
            console.error('❌ خطأ في استيراد المنتج:', error.message);
            return { success: false, error: error.message };
        }
    },
    
    // البحث عن منتجات
    searchProducts: async function(query) {
        try {
            const snapshot = await db.collection('products')
                .where('status', '==', 'active')
                .get();
            
            const products = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            // بحث بسيط في الذاكرة (في الإصدار الحقيقي، استخدم Firebase search)
            const results = products.filter(product => 
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.description.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase())
            );
            
            return results;
            
        } catch (error) {
            console.error('❌ خطأ في البحث:', error.message);
            return [];
        }
    }
};

// جعل النظام متاحاً بشكل عام
window.ProductSystem = ProductSystem;
