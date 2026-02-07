// ============================================
// لوحة تحكم البائع - Vendor Dashboard
// ============================================

const VendorPanel = {
    // تهيئة لوحة البائع
    init: function(vendorId) {
        console.log('🚀 بدء لوحة البائع:', vendorId);
        this.vendorId = vendorId;
        
        // تحميل البيانات
        this.loadVendorData();
        this.loadVendorProducts();
        this.loadVendorStats();
        
        // إعداد الأحداث
        this.setupEventListeners();
        
        return this;
    },
    
    // تحميل بيانات البائع
    loadVendorData: async function() {
        try {
            const vendorDoc = await db.collection('vendors').doc(this.vendorId).get();
            
            if (vendorDoc.exists) {
                this.vendorData = vendorDoc.data();
                console.log('📊 بيانات البائع:', this.vendorData);
                
                // تحديث الواجهة
                this.updateVendorUI();
            }
            
        } catch (error) {
            console.error('❌ خطأ في تحميل بيانات البائع:', error.message);
        }
    },
    
    // تحميل منتجات البائع
    loadVendorProducts: async function() {
        try {
            const products = await ProductSystem.getVendorProducts(this.vendorId);
            this.products = products;
            
            // تحديث الواجهة
            this.renderProductsGrid();
            
        } catch (error) {
            console.error('❌ خطأ في تحميل المنتجات:', error.message);
        }
    },
    
    // تحميل إحصائيات البائع
    loadVendorStats: async function() {
        try {
            // حساب الإحصائيات
            const totalProducts = this.products.length;
            const totalSales = this.vendorData?.totalSales || 0;
            const totalOrders = this.vendorData?.totalOrders || 0;
            
            // تحديث الواجهة
            document.getElementById('my-products').textContent = totalProducts;
            document.getElementById('my-sales').textContent = '$' + totalSales;
            document.getElementById('my-orders').textContent = totalOrders;
            
        } catch (error) {
            console.error('❌ خطأ في تحميل الإحصائيات:', error.message);
        }
    },
    
    // تحديث واجهة البائع
    updateVendorUI: function() {
        // تحديث اسم المتجر
        const storeNameElement = document.getElementById('store-name');
        if (storeNameElement && this.vendorData) {
            storeNameElement.textContent = this.vendorData.storeName;
        }
        
        // تحديث حالة الخطة
        const planElement = document.getElementById('vendor-plan');
        if (planElement && this.vendorData) {
            planElement.textContent = this.vendorData.plan === 'free' ? 'مجاني' : 'مدفوع';
            planElement.className = `badge ${this.vendorData.plan === 'free' ? 'badge-info' : 'badge-success'}`;
        }
    },
    
    // عرض المنتجات في شبكة
    renderProductsGrid: function() {
        const productsGrid = document.getElementById('vendor-products-grid');
        if (!productsGrid) return;
        
        if (this.products.length === 0) {
            productsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <h4>لا توجد منتجات</h4>
                    <p>ابدأ بإضافة منتجك الأول</p>
                    <button class="btn btn-primary" onclick="VendorPanel.showAddProductForm()">
                        <i class="fas fa-plus"></i> إضافة منتج
                    </button>
                </div>
            `;
            return;
        }
        
        productsGrid.innerHTML = this.products.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <img src="${product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'}" 
                     class="product-img" 
                     alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-meta">
                        <span class="price">$${product.price}</span>
                        <span class="category">${product.category}</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-sm btn-primary" onclick="VendorPanel.editProduct('${product.id}')">
                            <i class="fas fa-edit"></i> تعديل
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="VendorPanel.deleteProduct('${product.id}')">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },
    
    // إعداد الأحداث
    setupEventListeners: function() {
        // زر إضافة منتج
        document.getElementById('add-product-btn')?.addEventListener('click', () => {
            this.showAddProductForm();
        });
        
        // زر استيراد من أمازون
        document.getElementById('import-amazon-btn')?.addEventListener('click', () => {
            this.showAmazonImportForm();
        });
        
        // زر تحديث الإحصائيات
        document.getElementById('refresh-stats-btn')?.addEventListener('click', () => {
            this.loadVendorStats();
            this.showNotification('info', 'تم تحديث الإحصائيات');
        });
    },
    
    // عرض نموذج إضافة منتج
    showAddProductForm: function() {
        const modalHTML = `
            <div class="modal-header">
                <h3><i class="fas fa-plus"></i> إضافة منتج جديد</h3>
            </div>
            <div class="modal-body">
                <form id="add-product-form">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="product-name">اسم المنتج *</label>
                                <input type="text" id="product-name" class="form-control" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="product-price">السعر ($) *</label>
                                <input type="number" id="product-price" class="form-control" step="0.01" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="product-category">الفئة</label>
                        <select id="product-category" class="form-control">
                            <option value="electronics">إلكترونيات</option>
                            <option value="fashion">أزياء</option>
                            <option value="home">منزل</option>
                            <option value="beauty">جمال</option>
                            <option value="sports">رياضة</option>
                            <option value="books">كتب</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="product-description">الوصف</label>
                        <textarea id="product-description" class="form-control" rows="3"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="product-stock">الكمية المتاحة</label>
                        <input type="number" id="product-stock" class="form-control" value="100">
                    </div>
                    
                    <div class="form-group">
                        <label for="product-images">رابط الصورة</label>
                        <input type="url" id="product-images" class="form-control" 
                               placeholder="https://example.com/image.jpg">
                    </div>
                    
                    <div class="form-group">
                        <label for="product-tags">الكلمات الدلالية (مفصولة بفواصل)</label>
                        <input type="text" id="product-tags" class="form-control" 
                               placeholder="جديد, مميز, عرض خاص">
                    </div>
                    
                    <div class="text-right">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                            إلغاء
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> حفظ المنتج
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        this.showModal(modalHTML);
        
        // إعداد حدث الإرسال
        document.getElementById('add-product-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.saveProduct();
        });
    },
    
    // حفظ المنتج
    saveProduct: async function() {
        const productData = {
            name: document.getElementById('product-name').value,
            price: parseFloat(document.getElementById('product-price').value),
            category: document.getElementById('product-category').value,
            description: document.getElementById('product-description').value,
            stock: parseInt(document.getElementById('product-stock').value) || 100,
            tags: document.getElementById('product-tags').value.split(',').map(tag => tag.trim()),
            vendorId: this.vendorId,
            vendorName: this.vendorData?.storeName || 'غير معروف',
            status: 'active'
        };
        
        // إضافة الصورة إذا وجدت
        const imageUrl = document.getElementById('product-images').value;
        if (imageUrl) {
            productData.images = [imageUrl];
        }
        
        const result = await ProductSystem.addProduct(productData);
        
        if (result.success) {
            this.showNotification('success', 'تم إضافة المنتج بنجاح');
            this.closeModal();
            this.loadVendorProducts();
            this.loadVendorStats();
        } else {
            this.showNotification('error', result.error);
        }
    },
    
    // عرض نموذج استيراد من أمازون
    showAmazonImportForm: function() {
        const modalHTML = `
            <div class="modal-header">
                <h3><i class="fab fa-amazon"></i> استيراد من أمازون</h3>
            </div>
            <div class="modal-body">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    <strong>كيف تعمل؟</strong>
                    <p>1. اذهب إلى أمازون وابحث عن المنتج المطلوب</p>
                    <p>2. انسخ رابط المنتج من شريط العنوان</p>
                    <p>3. الصق الرابط هنا لاستيراد المنتج</p>
                    <p>4. ستحصل على عمولة 10% من كل عملية بيع</p>
                </div>
                
                <form id="import-amazon-form">
                    <div class="form-group">
                        <label for="amazon-url">رابط منتج أمازون *</label>
                        <input type="url" id="amazon-url" class="form-control" 
                               placeholder="https://www.amazon.com/dp/xxxxxxxx" required>
                    </div>
                    
                    <div class="text-right">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                            إلغاء
                        </button>
                        <button type="submit" class="btn btn-warning">
                            <i class="fab fa-amazon"></i> استيراد المنتج
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        this.showModal(modalHTML);
        
        // إعداد حدث الإرسال
        document.getElementById('import-amazon-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.importAmazonProduct();
        });
    },
    
    // استيراد منتج من أمازون
    importAmazonProduct: async function() {
        const amazonUrl = document.getElementById('amazon-url').value;
        
        if (!amazonUrl.includes('amazon.com') && !amazonUrl.includes('amazon.')) {
            this.showNotification('error', 'الرجاء إدخال رابط صحيح من أمازون');
            return;
        }
        
        // عرض تحميل
        this.showNotification('info', 'جاري استيراد المنتج من أمازون...');
        
        const result = await ProductSystem.importFromAmazon(amazonUrl);
        
        if (result.success) {
            this.showNotification('success', 'تم استيراد المنتج بنجاح');
            this.closeModal();
            this.loadVendorProducts();
        } else {
            this.showNotification('error', result.error);
        }
    },
    
    // تعديل منتج
    editProduct: function(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const modalHTML = `
            <div class="modal-header">
                <h3><i class="fas fa-edit"></i> تعديل المنتج</h3>
            </div>
            <div class="modal-body">
                <form id="edit-product-form">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="edit-product-name">اسم المنتج</label>
                                <input type="text" id="edit-product-name" class="form-control" 
                                       value="${product.name}" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="edit-product-price">السعر ($)</label>
                                <input type="number" id="edit-product-price" class="form-control" 
                                       value="${product.price}" step="0.01" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-product-category">الفئة</label>
                        <select id="edit-product-category" class="form-control">
                            <option value="electronics" ${product.category === 'electronics' ? 'selected' : ''}>إلكترونيات</option>
                            <option value="fashion" ${product.category === 'fashion' ? 'selected' : ''}>أزياء</option>
                            <option value="home" ${product.category === 'home' ? 'selected' : ''}>منزل</option>
                            <option value="beauty" ${product.category === 'beauty' ? 'selected' : ''}>جمال</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-product-description">الوصف</label>
                        <textarea id="edit-product-description" class="form-control" rows="3">${product.description || ''}</textarea>
                    </div>
                    
                    <div class="text-right">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                            إلغاء
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> حفظ التعديلات
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        this.showModal(modalHTML);
        
        // إعداد حدث الإرسال
        document.getElementById('edit-product-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.updateProduct(productId);
        });
    },
    
    // تحديث المنتج
    updateProduct: async function(productId) {
        const updateData = {
            name: document.getElementById('edit-product-name').value,
            price: parseFloat(document.getElementById('edit-product-price').value),
            category: document.getElementById('edit-product-category').value,
            description: document.getElementById('edit-product-description').value
        };
        
        const result = await ProductSystem.updateProduct(productId, updateData);
        
        if (result.success) {
            this.showNotification('success', 'تم تحديث المنتج بنجاح');
            this.closeModal();
            this.loadVendorProducts();
        } else {
            this.showNotification('error', result.error);
        }
    },
    
    // حذف منتج
    deleteProduct: async function(productId) {
        if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
            return;
        }
        
        const result = await ProductSystem.deleteProduct(productId);
        
        if (result.success) {
            this.showNotification('success', 'تم حذف المنتج بنجاح');
            this.loadVendorProducts();
            this.loadVendorStats();
        } else {
            this.showNotification('error', result.error);
        }
    },
    
    // دوال مساعدة
    showModal: function(content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay show';
        modal.innerHTML = `
            <div class="modal">
                ${content}
            </div>
        `;
        
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        };
        
        document.body.appendChild(modal);
    },
    
    closeModal: function() {
        const modal = document.querySelector('.modal-overlay.show');
        if (modal) {
            modal.remove();
        }
    },
    
    showNotification: function(type, message) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
};

// جعل لوحة البائع متاحة بشكل عام
window.VendorPanel = VendorPanel;
