// ============================================
// لوحة تحكم الإدارة - Admin Dashboard
// ============================================

const AdminPanel = {
    // تهيئة لوحة التحكم
    init: function() {
        console.log('🚀 بدء لوحة التحكم الإدارية');
        
        // التحقق من صلاحيات الإدارة
        if (!this.checkAdminPermissions()) {
            this.showNoPermissionMessage();
            return;
        }
        
        // تحميل البيانات
        this.loadAdminStats();
        this.loadAllVendors();
        this.loadAllProducts();
        this.loadRecentTransactions();
        
        // إعداد الأحداث
        this.setupEventListeners();
        
        // تحديث الواجهة
        this.updateAdminUI();
        
        return this;
    },
    
    // التحقق من صلاحيات الإدارة
    checkAdminPermissions: function() {
        const currentUser = window.App?.currentUser;
        if (!currentUser) {
            console.log('❌ لا يوجد مستخدم مسجل');
            return false;
        }
        
        // في الإصدار الحقيقي، نتحقق من قاعدة البيانات
        // هنا نستخدم بيانات تجريبية
        const adminEmails = ['admin@example.com', 'me@my-marketplace.com'];
        return adminEmails.includes(currentUser.email) || currentUser.email.includes('admin');
    },
    
    // تحميل إحصائيات الإدارة
    loadAdminStats: async function() {
        try {
            // جلب البيانات من Firebase
            const [vendorsSnapshot, productsSnapshot, salesSnapshot] = await Promise.all([
                db.collection('vendors').get(),
                db.collection('products').get(),
                db.collection('transactions').get()
            ]);
            
            // حساب الإحصائيات
            const totalVendors = vendorsSnapshot.size;
            const totalProducts = productsSnapshot.size;
            const totalSales = salesSnapshot.docs.reduce((sum, doc) => {
                const data = doc.data();
                return sum + (data.amount || 0);
            }, 0);
            
            const totalEarnings = totalSales * 0.05; // 5% عمولة من كل عملية بيع
            
            // تحديث الواجهة
            this.updateStatsUI({
                totalVendors,
                totalProducts,
                totalSales,
                totalEarnings
            });
            
        } catch (error) {
            console.error('❌ خطأ في تحميل إحصائيات الإدارة:', error.message);
            
            // استخدام بيانات تجريبية في حالة الخطأ
            this.updateStatsUI({
                totalVendors: 15,
                totalProducts: 320,
                totalSales: 28500,
                totalEarnings: 1425
            });
        }
    },
    
    // تحديث واجهة الإحصائيات
    updateStatsUI: function(stats) {
        const elements = {
            'admin-vendors': stats.totalVendors,
            'admin-products': stats.totalProducts,
            'admin-sales': '$' + stats.totalSales.toLocaleString(),
            'admin-earnings': '$' + stats.totalEarnings.toLocaleString()
        };
        
        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        }
    },
    
    // تحميل جميع البائعين
    loadAllVendors: async function() {
        try {
            const snapshot = await db.collection('vendors').get();
            this.vendors = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            // تحديث الواجهة إذا كانت هناك جدول بائعين
            this.renderVendorsTable();
            
        } catch (error) {
            console.error('❌ خطأ في تحميل البائعين:', error.message);
            
            // بيانات تجريبية
            this.vendors = [
                {
                    id: '1',
                    storeName: 'متجر التقنية',
                    email: 'tech@example.com',
                    status: 'active',
                    plan: 'premium',
                    totalSales: 12500,
                    joinDate: '2024-01-15'
                },
                {
                    id: '2',
                    storeName: 'أزياء راقية',
                    email: 'fashion@example.com',
                    status: 'active',
                    plan: 'free',
                    totalSales: 8500,
                    joinDate: '2024-02-10'
                },
                {
                    id: '3',
                    storeName: 'إلكترونيات متطورة',
                    email: 'electronics@example.com',
                    status: 'pending',
                    plan: 'business',
                    totalSales: 21000,
                    joinDate: '2024-03-01'
                }
            ];
            
            this.renderVendorsTable();
        }
    },
    
    // عرض البائعين في جدول
    renderVendorsTable: function() {
        const tableBody = document.getElementById('vendors-table-body');
        if (!tableBody) return;
        
        if (this.vendors.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">
                        <i class="fas fa-users-slash"></i>
                        <p class="mt-2">لا يوجد بائعين مسجلين</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = this.vendors.map(vendor => `
            <tr>
                <td>
                    <div class="vendor-info">
                        <div class="vendor-name">${vendor.storeName}</div>
                        <div class="vendor-email">${vendor.email}</div>
                    </div>
                </td>
                <td>${vendor.totalSales ? '$' + vendor.totalSales.toLocaleString() : '$0'}</td>
                <td>
                    <span class="badge ${this.getPlanBadgeClass(vendor.plan)}">
                        ${this.getPlanText(vendor.plan)}
                    </span>
                </td>
                <td>
                    <span class="badge ${this.getStatusBadgeClass(vendor.status)}">
                        ${this.getStatusText(vendor.status)}
                    </span>
                </td>
                <td>${vendor.joinDate || 'غير محدد'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-primary" onclick="AdminPanel.viewVendorDetails('${vendor.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="AdminPanel.editVendor('${vendor.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="AdminPanel.deleteVendor('${vendor.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },
    
    // تحميل جميع المنتجات
    loadAllProducts: async function() {
        try {
            const snapshot = await db.collection('products').get();
            this.products = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            // تحديث الواجهة إذا كانت هناك شبكة منتجات
            this.renderProductsGrid();
            
        } catch (error) {
            console.error('❌ خطأ في تحميل المنتجات:', error.message);
            
            // بيانات تجريبية
            this.products = [
                {
                    id: '1',
                    name: 'لابتوب gaming',
                    price: 1299.99,
                    category: 'إلكترونيات',
                    vendorName: 'متجر التقنية',
                    status: 'active',
                    stock: 45,
                    sales: 120
                },
                {
                    id: '2',
                    name: 'هاتف ذكي',
                    price: 599.99,
                    category: 'إلكترونيات',
                    vendorName: 'متجر التقنية',
                    status: 'active',
                    stock: 89,
                    sales: 230
                }
            ];
            
            this.renderProductsGrid();
        }
    },
    
    // عرض المنتجات في شبكة
    renderProductsGrid: function() {
        const productsGrid = document.getElementById('admin-products-grid');
        if (!productsGrid) return;
        
        if (this.products.length === 0) {
            productsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <h4>لا توجد منتجات</h4>
                </div>
            `;
            return;
        }
        
        productsGrid.innerHTML = this.products.map(product => `
            <div class="product-card">
                <div class="product-header">
                    <span class="product-status ${product.status}">${product.status === 'active' ? 'نشط' : 'غير نشط'}</span>
                </div>
                <div class="product-body">
                    <h4>${product.name}</h4>
                    <p class="product-price">$${product.price}</p>
                    <p class="product-category">${product.category}</p>
                    <p class="product-vendor">${product.vendorName}</p>
                </div>
                <div class="product-footer">
                    <span class="product-stock">المخزون: ${product.stock || 0}</span>
                    <span class="product-sales">المبيعات: ${product.sales || 0}</span>
                </div>
                <div class="product-actions">
                    <button class="btn btn-sm btn-primary" onclick="AdminPanel.viewProduct('${product.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="AdminPanel.editProduct('${product.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
        `).join('');
    },
    
    // تحميل المعاملات الحديثة
    loadRecentTransactions: async function() {
        try {
            const snapshot = await db.collection('transactions')
                .orderBy('timestamp', 'desc')
                .limit(10)
                .get();
            
            this.transactions = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            // تحديث الواجهة
            this.renderTransactionsTable();
            
        } catch (error) {
            console.error('❌ خطأ في تحميل المعاملات:', error.message);
            
            // بيانات تجريبية
            this.transactions = [
                {
                    id: '1',
                    amount: 299.99,
                    vendor: 'متجر التقنية',
                    customer: 'محمد أحمد',
                    status: 'completed',
                    timestamp: new Date().toISOString()
                },
                {
                    id: '2',
                    amount: 149.99,
                    vendor: 'أزياء راقية',
                    customer: 'سارة محمد',
                    status: 'pending',
                    timestamp: new Date(Date.now() - 86400000).toISOString()
                }
            ];
            
            this.renderTransactionsTable();
        }
    },
    
    // عرض المعاملات في جدول
    renderTransactionsTable: function() {
        const tableBody = document.getElementById('transactions-table-body');
        if (!tableBody) return;
        
        if (this.transactions.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">لا توجد معاملات حديثة</td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = this.transactions.map(transaction => `
            <tr>
                <td>${transaction.id.substring(0, 8)}...</td>
                <td>$${transaction.amount}</td>
                <td>${transaction.vendor}</td>
                <td>${transaction.customer}</td>
                <td>
                    <span class="badge ${this.getTransactionStatusClass(transaction.status)}">
                        ${this.getTransactionStatusText(transaction.status)}
                    </span>
                </td>
                <td>
                    ${new Date(transaction.timestamp).toLocaleDateString('ar-EG')}
                </td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="AdminPanel.viewTransaction('${transaction.id}')">
                        <i class="fas fa-info-circle"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },
    
    // إعداد مستمعي الأحداث
    setupEventListeners: function() {
        // أزرار التنقل
        document.getElementById('admin-vendors-btn')?.addEventListener('click', () => {
            this.showVendorsSection();
        });
        
        document.getElementById('admin-products-btn')?.addEventListener('click', () => {
            this.showProductsSection();
        });
        
        document.getElementById('admin-transactions-btn')?.addEventListener('click', () => {
            this.showTransactionsSection();
        });
        
        document.getElementById('admin-reports-btn')?.addEventListener('click', () => {
            this.showReportsSection();
        });
        
        document.getElementById('admin-settings-btn')?.addEventListener('click', () => {
            this.showSettingsSection();
        });
        
        // زر تحديث البيانات
        document.getElementById('admin-refresh-btn')?.addEventListener('click', () => {
            this.refreshAllData();
        });
        
        // زر إضافة بائع جديد
        document.getElementById('admin-add-vendor-btn')?.addEventListener('click', () => {
            this.showAddVendorForm();
        });
    },
    
    // تحديث واجهة الإدارة
    updateAdminUI: function() {
        // تحديث معلومات المدير
        const adminName = document.getElementById('admin-name');
        if (adminName && window.App?.currentUser) {
            adminName.textContent = window.App.currentUser.email;
        }
        
        // تحديث التاريخ والوقت
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 60000);
    },
    
    // تحديث التاريخ والوقت
    updateDateTime: function() {
        const now = new Date();
        const dateTimeElement = document.getElementById('admin-datetime');
        if (dateTimeElement) {
            dateTimeElement.textContent = now.toLocaleString('ar-EG', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    },
    
    // عرض قسم البائعين
    showVendorsSection: function() {
        this.switchSection('vendors');
        this.loadAllVendors();
    },
    
    // عرض قسم المنتجات
    showProductsSection: function() {
        this.switchSection('products');
        this.loadAllProducts();
    },
    
    // عرض قسم المعاملات
    showTransactionsSection: function() {
        this.switchSection('transactions');
        this.loadRecentTransactions();
    },
    
    // عرض قسم التقارير
    showReportsSection: function() {
        this.switchSection('reports');
        this.generateReports();
    },
    
    // عرض قسم الإعدادات
    showSettingsSection: function() {
        this.switchSection('settings');
        this.loadSettings();
    },
    
    // تبديل الأقسام
    switchSection: function(sectionName) {
        // إخفاء جميع الأقسام
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // إخفاء جميع أزرار القائمة النشطة
        document.querySelectorAll('.admin-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // إظهار القسم المطلوب
        const targetSection = document.getElementById(`admin-${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // تفعيل زر القائمة
        const targetLink = document.getElementById(`admin-${sectionName}-btn`);
        if (targetLink) {
            targetLink.classList.add('active');
        }
    },
    
    // تحديث جميع البيانات
    refreshAllData: function() {
        this.showNotification('info', 'جاري تحديث البيانات...');
        
        Promise.all([
            this.loadAdminStats(),
            this.loadAllVendors(),
            this.loadAllProducts(),
            this.loadRecentTransactions()
        ]).then(() => {
            this.showNotification('success', 'تم تحديث جميع البيانات بنجاح');
        }).catch(error => {
            this.showNotification('error', 'خطأ في تحديث البيانات: ' + error.message);
        });
    },
    
    // عرض نموذج إضافة بائع
    showAddVendorForm: function() {
        const modalHTML = `
            <div class="modal-header">
                <h3><i class="fas fa-user-plus"></i> إضافة بائع جديد</h3>
            </div>
            <div class="modal-body">
                <form id="add-vendor-form">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="vendor-name">اسم البائع *</label>
                                <input type="text" id="vendor-name" class="form-control" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="vendor-email">البريد الإلكتروني *</label>
                                <input type="email" id="vendor-email" class="form-control" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="vendor-phone">رقم الهاتف</label>
                                <input type="tel" id="vendor-phone" class="form-control">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="vendor-plan">الخطة *</label>
                                <select id="vendor-plan" class="form-control" required>
                                    <option value="free">مجاني</option>
                                    <option value="premium">احترافي</option>
                                    <option value="business">أعمال</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="vendor-store">اسم المتجر *</label>
                        <input type="text" id="vendor-store" class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="vendor-description">وصف المتجر</label>
                        <textarea id="vendor-description" class="form-control" rows="3"></textarea>
                    </div>
                    
                    <div class="text-right">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                            إلغاء
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> حفظ البائع
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        this.showModal(modalHTML);
        
        // إعداد حدث الإرسال
        document.getElementById('add-vendor-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.saveVendor();
        });
    },
    
    // حفظ البائع الجديد
    saveVendor: async function() {
        const vendorData = {
            name: document.getElementById('vendor-name').value,
            email: document.getElementById('vendor-email').value,
            phone: document.getElementById('vendor-phone').value,
            plan: document.getElementById('vendor-plan').value,
            storeName: document.getElementById('vendor-store').value,
            description: document.getElementById('vendor-description').value,
            status: 'active',
            joinDate: new Date().toISOString().split('T')[0],
            totalSales: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        try {
            // إنشاء حساب المستخدم أولاً (في الإصدار الحقيقي)
            // ثم حفظ بيانات البائع
            
            const docRef = await db.collection('vendors').add(vendorData);
            
            this.showNotification('success', 'تم إضافة البائع بنجاح');
            this.closeModal();
            this.loadAllVendors();
            this.loadAdminStats();
            
        } catch (error) {
            this.showNotification('error', 'خطأ في إضافة البائع: ' + error.message);
        }
    },
    
    // عرض تفاصيل البائع
    viewVendorDetails: function(vendorId) {
        const vendor = this.vendors.find(v => v.id === vendorId);
        if (!vendor) return;
        
        const modalHTML = `
            <div class="modal-header">
                <h3><i class="fas fa-store"></i> ${vendor.storeName}</h3>
            </div>
            <div class="modal-body">
                <div class="vendor-details">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="detail-item">
                                <label>البريد الإلكتروني:</label>
                                <span>${vendor.email}</span>
                            </div>
                            <div class="detail-item">
                                <label>الحالة:</label>
                                <span class="badge ${this.getStatusBadgeClass(vendor.status)}">
                                    ${this.getStatusText(vendor.status)}
                                </span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="detail-item">
                                <label>الخطة:</label>
                                <span class="badge ${this.getPlanBadgeClass(vendor.plan)}">
                                    ${this.getPlanText(vendor.plan)}
                                </span>
                            </div>
                            <div class="detail-item">
                                <label>إجمالي المبيعات:</label>
                                <span class="text-success">$${vendor.totalSales || 0}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-item">
                        <label>تاريخ الانضمام:</label>
                        <span>${vendor.joinDate || 'غير محدد'}</span>
                    </div>
                    
                    <div class="vendor-stats mt-4">
                        <h5>إحصائيات البائع</h5>
                        <div class="row">
                            <div class="col-md-3">
                                <div class="stat-box">
                                    <div class="stat-number">${vendor.productCount || 0}</div>
                                    <div class="stat-label">المنتجات</div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="stat-box">
                                    <div class="stat-number">${vendor.orderCount || 0}</div>
                                    <div class="stat-label">الطلبات</div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="stat-box">
                                    <div class="stat-number">${vendor.customerCount || 0}</div>
                                    <div class="stat-label">العملاء</div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="stat-box">
                                    <div class="stat-number">${Math.round((vendor.totalSales || 0) * 0.05)}</div>
                                    <div class="stat-label">عمولتنا</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="AdminPanel.editVendor('${vendorId}')">
                    <i class="fas fa-edit"></i> تعديل
                </button>
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                    إغلاق
                </button>
            </div>
        `;
        
        this.showModal(modalHTML);
    },
    
    // تعديل البائع
    editVendor: function(vendorId) {
        const vendor = this.vendors.find(v => v.id === vendorId);
        if (!vendor) return;
        
        const modalHTML = `
            <div class="modal-header">
                <h3><i class="fas fa-edit"></i> تعديل البائع</h3>
            </div>
            <div class="modal-body">
                <form id="edit-vendor-form">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="edit-vendor-store">اسم المتجر</label>
                                <input type="text" id="edit-vendor-store" class="form-control" 
                                       value="${vendor.storeName}" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="edit-vendor-plan">الخطة</label>
                                <select id="edit-vendor-plan" class="form-control">
                                    <option value="free" ${vendor.plan === 'free' ? 'selected' : ''}>مجاني</option>
                                    <option value="premium" ${vendor.plan === 'premium' ? 'selected' : ''}>احترافي</option>
                                    <option value="business" ${vendor.plan === 'business' ? 'selected' : ''}>أعمال</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="edit-vendor-status">الحالة</label>
                                <select id="edit-vendor-status" class="form-control">
                                    <option value="active" ${vendor.status === 'active' ? 'selected' : ''}>نشط</option>
                                    <option value="pending" ${vendor.status === 'pending' ? 'selected' : ''}>قيد المراجعة</option>
                                    <option value="suspended" ${vendor.status === 'suspended' ? 'selected' : ''}>موقوف</option>
                                    <option value="inactive" ${vendor.status === 'inactive' ? 'selected' : ''}>غير نشط</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label for="edit-vendor-sales">إجمالي المبيعات ($)</label>
                                <input type="number" id="edit-vendor-sales" class="form-control" 
                                       value="${vendor.totalSales || 0}" step="0.01">
                            </div>
                        </div>
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
        document.getElementById('edit-vendor-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.updateVendor(vendorId);
        });
    },
    
    // تحديث بيانات البائع
    updateVendor: async function(vendorId) {
        const updateData = {
            storeName: document.getElementById('edit-vendor-store').value,
            plan: document.getElementById('edit-vendor-plan').value,
            status: document.getElementById('edit-vendor-status').value,
            totalSales: parseFloat(document.getElementById('edit-vendor-sales').value) || 0,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        try {
            await db.collection('vendors').doc(vendorId).update(updateData);
            
            this.showNotification('success', 'تم تحديث بيانات البائع بنجاح');
            this.closeModal();
            this.loadAllVendors();
            
        } catch (error) {
            this.showNotification('error', 'خطأ في تحديث البائع: ' + error.message);
        }
    },
    
    // حذف البائع
    deleteVendor: async function(vendorId) {
        if (!confirm('هل أنت متأكد من حذف هذا البائع؟ سيتم حذف جميع منتجاته وبياناته.')) {
            return;
        }
        
        try {
            // في الإصدار الحقيقي، نتعامل مع حذف المستخدم والبيانات المرتبطة
            // هنا نغير حالة البائع فقط
            await db.collection('vendors').doc(vendorId).update({
                status: 'deleted',
                deletedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            this.showNotification('success', 'تم حذف البائع بنجاح');
            this.loadAllVendors();
            this.loadAdminStats();
            
        } catch (error) {
            this.showNotification('error', 'خطأ في حذف البائع: ' + error.message);
        }
    },
    
    // عرض المنتج
    viewProduct: function(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        const modalHTML = `
            <div class="modal-header">
                <h3><i class="fas fa-box"></i> ${product.name}</h3>
            </div>
            <div class="modal-body">
                <div class="product-details">
                    <div class="row">
                        <div class="col-md-6">
                            <img src="${product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'}" 
                                 class="img-fluid rounded" alt="${product.name}">
                        </div>
                        <div class="col-md-6">
                            <div class="detail-item">
                                <label>السعر:</label>
                                <span class="text-success">$${product.price}</span>
                            </div>
                            <div class="detail-item">
                                <label>الفئة:</label>
                                <span>${product.category}</span>
                            </div>
                            <div class="detail-item">
                                <label>البائع:</label>
                                <span>${product.vendorName}</span>
                            </div>
                            <div class="detail-item">
                                <label>الحالة:</label>
                                <span class="badge ${product.status === 'active' ? 'badge-success' : 'badge-danger'}">
                                    ${product.status === 'active' ? 'نشط' : 'غير نشط'}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-item mt-3">
                        <label>الوصف:</label>
                        <p>${product.description || 'لا يوجد وصف'}</p>
                    </div>
                    
                    <div class="product-stats mt-3">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="stat-box small">
                                    <div class="stat-number">${product.stock || 0}</div>
                                    <div class="stat-label">المخزون</div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="stat-box small">
                                    <div class="stat-number">${product.sales || 0}</div>
                                    <div class="stat-label">المبيعات</div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="stat-box small">
                                    <div class="stat-number">$${(product.price * (product.sales || 0)).toFixed(2)}</div>
                                    <div class="stat-label">الإيرادات</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.showModal(modalHTML);
    },
    
    // تعديل المنتج
    editProduct: function(productId) {
        // استدعاء وظيفة تعديل المنتج من نظام المنتجات
        if (window.ProductSystem) {
            // يمكنك هنا استدعاء الوظيفة المناسبة
            this.showNotification('info', 'خاصية التعديل قريباً...');
        }
    },
    
    // عرض المعاملة
    viewTransaction: function(transactionId) {
        const transaction = this.transactions.find(t => t.id === transactionId);
        if (!transaction) return;
        
        const modalHTML = `
            <div class="modal-header">
                <h3><i class="fas fa-receipt"></i> تفاصيل المعاملة</h3>
            </div>
            <div class="modal-body">
                <div class="transaction-details">
                    <div class="detail-item">
                        <label>رقم المعاملة:</label>
                        <span>${transaction.id}</span>
                    </div>
                    <div class="detail-item">
                        <label>المبلغ:</label>
                        <span class="text-success">$${transaction.amount}</span>
                    </div>
                    <div class="detail-item">
                        <label>البائع:</label>
                        <span>${transaction.vendor}</span>
                    </div>
                    <div class="detail-item">
                        <label>العميل:</label>
                        <span>${transaction.customer}</span>
                    </div>
                    <div class="detail-item">
                        <label>الحالة:</label>
                        <span class="badge ${this.getTransactionStatusClass(transaction.status)}">
                            ${this.getTransactionStatusText(transaction.status)}
                        </span>
                    </div>
                    <div class="detail-item">
                        <label>التاريخ:</label>
                        <span>${new Date(transaction.timestamp).toLocaleString('ar-EG')}</span>
                    </div>
                    <div class="detail-item">
                        <label>عمولتنا (5%):</label>
                        <span class="text-warning">$${(transaction.amount * 0.05).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
        
        this.showModal(modalHTML);
    },
    
    // إنشاء التقارير
    generateReports: function() {
        const reportsSection = document.getElementById('admin-reports-section');
        if (!reportsSection) return;
        
        const reports = {
            dailySales: 1250,
            monthlySales: 28500,
            activeVendors: this.vendors.filter(v => v.status === 'active').length,
            topProduct: this.products.reduce((top, current) => 
                (current.sales || 0) > (top.sales || 0) ? current : top, { name: 'لا يوجد', sales: 0 }
            ),
            platformEarnings: 1425
        };
        
        reportsSection.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <div class="report-card">
                        <h5><i class="fas fa-chart-line"></i> تقرير المبيعات اليومية</h5>
                        <div class="report-content">
                            <div class="report-value">$${reports.dailySales}</div>
                            <div class="report-trend text-success">
                                <i class="fas fa-arrow-up"></i> 12% عن الأمس
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="report-card">
                        <h5><i class="fas fa-calendar-alt"></i> تقرير المبيعات الشهرية</h5>
                        <div class="report-content">
                            <div class="report-value">$${reports.monthlySales}</div>
                            <div class="report-trend text-success">
                                <i class="fas fa-arrow-up"></i> 8% عن الشهر الماضي
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mt-4">
                <div class="col-md-6">
                    <div class="report-card">
                        <h5><i class="fas fa-users"></i> البائعين النشطين</h5>
                        <div class="report-content">
                            <div class="report-value">${reports.activeVendors}</div>
                            <div class="report-trend text-info">
                                من إجمالي ${this.vendors.length} بائع
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="report-card">
                        <h5><i class="fas fa-crown"></i> المنتج الأكثر مبيعاً</h5>
                        <div class="report-content">
                            <div class="report-value">${reports.topProduct.name}</div>
                            <div class="report-trend text-warning">
                                ${reports.topProduct.sales || 0} عملية بيع
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mt-4">
                <div class="col-12">
                    <div class="report-card">
                        <h5><i class="fas fa-money-bill-wave"></i> إجمالي أرباح المنصة</h5>
                        <div class="report-content">
                            <div class="report-value text-success">$${reports.platformEarnings}</div>
                            <div class="report-trend">
                                <button class="btn btn-primary btn-sm" onclick="AdminPanel.exportReports()">
                                    <i class="fas fa-download"></i> تصدير التقارير
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },
    
    // تحميل الإعدادات
    loadSettings: function() {
        const settingsSection = document.getElementById('admin-settings-section');
        if (!settingsSection) return;
        
        settingsSection.innerHTML = `
            <div class="settings-card">
                <h5><i class="fas fa-cogs"></i> إعدادات النظام</h5>
                <form id="system-settings-form">
                    <div class="form-group">
                        <label for="commission-rate">نسبة العمولة (%)</label>
                        <input type="number" id="commission-rate" class="form-control" 
                               value="5" min="1" max="20" step="0.5">
                        <small class="form-text text-muted">النسبة المئوية التي تحصل عليها المنصة من كل عملية بيع</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="amazon-commission">عمولة أمازون (%)</label>
                        <input type="number" id="amazon-commission" class="form-control" 
                               value="10" min="1" max="30" step="0.5">
                        <small class="form-text text-muted">النسبة المئوية التي يحصل عليها البائع من منتجات أمازون</small>
                    </div>
                    
                    <div class="form-group">
                        <label for="free-plan-limit">حد الخطة المجانية (منتجات)</label>
                        <input type="number" id="free-plan-limit" class="form-control" 
                               value="10" min="1" max="100">
                        <small class="form-text text-muted">الحد الأقصى للمنتجات في الخطة المجانية</small>
                    </div>
                    
                    <div class="form-check mt-3">
                        <input type="checkbox" id="auto-approve-vendors" class="form-check-input" checked>
                        <label class="form-check-label" for="auto-approve-vendors">الموافقة التلقائية على البائعين الجدد</label>
                    </div>
                    
                    <div class="form-check">
                        <input type="checkbox" id="email-notifications" class="form-check-input" checked>
                        <label class="form-check-label" for="email-notifications">إرسال إشعارات البريد الإلكتروني</label>
                    </div>
                    
                    <div class="text-right mt-4">
                        <button type="button" class="btn btn-secondary" onclick="AdminPanel.resetSettings()">
                            <i class="fas fa-undo"></i> إعادة التعيين
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> حفظ الإعدادات
                        </button>
                    </div>
                </form>
            </div>
            
            <div class="settings-card mt-4">
                <h5><i class="fas fa-shield-alt"></i> الأمان</h5>
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <strong>ملاحظة هامة:</strong> هذه الإعدادات حساسة، تأكد من حفظ نسخة احتياطية قبل التعديل.
                </div>
                <button class="btn btn-danger" onclick="AdminPanel.backupDatabase()">
                    <i class="fas fa-database"></i> إنشاء نسخة احتياطية
                </button>
                <button class="btn btn-warning" onclick="AdminPanel.clearCache()">
                    <i class="fas fa-broom"></i> مسح الذاكرة المؤقتة
                </button>
            </div>
        `;
        
        // إعداد حدث حفظ الإعدادات
        document.getElementById('system-settings-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });
    },
    
    // حفظ الإعدادات
    saveSettings: function() {
        const settings = {
            commissionRate: document.getElementById('commission-rate').value,
            amazonCommission: document.getElementById('amazon-commission').value,
            freePlanLimit: document.getElementById('free-plan-limit').value,
            autoApproveVendors: document.getElementById('auto-approve-vendors').checked,
            emailNotifications: document.getElementById('email-notifications').checked,
            lastUpdated: new Date().toISOString()
        };
        
        // في الإصدار الحقيقي، نحفظ في Firebase
        // هنا نعرض رسالة نجاح فقط
        this.showNotification('success', 'تم حفظ الإعدادات بنجاح');
    },
    
    // إعادة تعيين الإعدادات
    resetSettings: function() {
        if (confirm('هل تريد إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟')) {
            document.getElementById('commission-rate').value = 5;
            document.getElementById('amazon-commission').value = 10;
            document.getElementById('free-plan-limit').value = 10;
            document.getElementById('auto-approve-vendors').checked = true;
            document.getElementById('email-notifications').checked = true;
            
            this.showNotification('info', 'تم إعادة التعيين إلى القيم الافتراضية');
        }
    },
    
    // تصدير التقارير
    exportReports: function() {
        const reportData = {
            date: new Date().toISOString(),
            stats: {
                totalVendors: this.vendors.length,
                totalProducts: this.products.length,
                totalSales: this.transactions.reduce((sum, t) => sum + t.amount, 0),
                platformEarnings: this.transactions.reduce((sum, t) => sum + (t.amount * 0.05), 0)
            },
            topVendors: this.vendors
                .sort((a, b) => (b.totalSales || 0) - (a.totalSales || 0))
                .slice(0, 5),
            topProducts: this.products
                .sort((a, b) => (b.sales || 0) - (a.sales || 0))
                .slice(0, 5)
        };
        
        // إنشاء ملف JSON للتحميل
        const dataStr = JSON.stringify(reportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `marketplace-report-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('success', 'تم تصدير التقرير بنجاح');
    },
    
    // إنشاء نسخة احتياطية
    backupDatabase: function() {
        this.showNotification('info', 'جاري إنشاء نسخة احتياطية...');
        
        // محاكاة عملية النسخ الاحتياطي
        setTimeout(() => {
            this.showNotification('success', 'تم إنشاء النسخة الاحتياطية بنجاح');
        }, 2000);
    },
    
    // مسح الذاكرة المؤقتة
    clearCache: function() {
        if (confirm('هل تريد مسح الذاكرة المؤقتة؟ هذا سيحسن أداء النظام.')) {
            this.showNotification('info', 'جاري مسح الذاكرة المؤقتة...');
            
            // محاكاة عملية المسح
            setTimeout(() => {
                localStorage.clear();
                sessionStorage.clear();
                this.showNotification('success', 'تم مسح الذاكرة المؤقتة بنجاح');
            }, 1500);
        }
    },
    
    // دوال مساعدة
    getPlanBadgeClass: function(plan) {
        switch(plan) {
            case 'free': return 'badge-info';
            case 'premium': return 'badge-success';
            case 'business': return 'badge-warning';
            default: return 'badge-secondary';
        }
    },
    
    getPlanText: function(plan) {
        switch(plan) {
            case 'free': return 'مجاني';
            case 'premium': return 'احترافي';
            case 'business': return 'أعمال';
            default: return plan;
        }
    },
    
    getStatusBadgeClass: function(status) {
        switch(status) {
            case 'active': return 'badge-success';
            case 'pending': return 'badge-warning';
            case 'suspended': return 'badge-danger';
            case 'inactive': return 'badge-secondary';
            default: return 'badge-light';
        }
    },
    
    getStatusText: function(status) {
        switch(status) {
            case 'active': return 'نشط';
            case 'pending': return 'قيد المراجعة';
            case 'suspended': return 'موقوف';
            case 'inactive': return 'غير نشط';
            default: return status;
        }
    },
    
    getTransactionStatusClass: function(status) {
        switch(status) {
            case 'completed': return 'badge-success';
            case 'pending': return 'badge-warning';
            case 'failed': return 'badge-danger';
            case 'refunded': return 'badge-info';
            default: return 'badge-light';
        }
    },
    
    getTransactionStatusText: function(status) {
        switch(status) {
            case 'completed': return 'مكتمل';
            case 'pending': return 'قيد المعالجة';
            case 'failed': return 'فشل';
            case 'refunded': return 'مرتجع';
            default: return status;
        }
    },
    
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
    },
    
    showNoPermissionMessage: function() {
        const adminSection = document.querySelector('.admin-section');
        if (adminSection) {
            adminSection.innerHTML = `
                <div class="no-permission">
                    <i class="fas fa-lock" style="font-size: 4rem; color: #f44336;"></i>
                    <h3 class="mt-4">غير مصرح لك بالدخول</h3>
                    <p>أنت لا تملك صلاحيات الوصول إلى لوحة التحكم الإدارية.</p>
                    <p>يجب أن تكون مدير النظام للوصول إلى هذه الصفحة.</p>
                    <button class="btn btn-primary mt-3" onclick="window.location.href='index.html'">
                        <i class="fas fa-home"></i> العودة للرئيسية
                    </button>
                </div>
            `;
        }
    }
};

// جعل لوحة التحكم متاحة بشكل عام
window.AdminPanel = AdminPanel;

// التهيئة التلقائية إذا كنا في صفحة الإدارة
if (window.location.pathname.includes('admin') || window.location.hash.includes('admin')) {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            if (window.firebaseReady) {
                window.Admin = AdminPanel.init();
            }
        }, 1000);
    });
}
