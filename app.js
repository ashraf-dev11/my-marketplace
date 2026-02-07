// ملف التطبيق الرئيسي - app.js

// التطبيق الرئيسي
const MARKETPLACE_APP = {
    // بيانات التطبيق
    config: {
        appName: 'منصتي',
        version: '1.0.0',
        apiBaseUrl: 'https://api.your-marketplace.com',
        isDevelopment: true
    },

    // بيانات المستخدم
    user: null,
    vendors: [],
    products: [],
    orders: [],

    // تهيئة التطبيق
    init: function() {
        console.log(`🚀 ${this.config.appName} v${this.config.version} يعمل بنجاح!`);
        
        // تحميل البيانات الأولية
        this.loadInitialData();
        
        // إعداد الأحداث
        this.setupEventListeners();
        
        // تحديث الإحصائيات
        this.updateDashboardStats();
        
        // التحقق من جلسة المستخدم
        this.checkUserSession();
    },

    // تحميل البيانات الأولية
    loadInitialData: function() {
        // بيانات تجريبية للمنتجات
        this.products = [
            {
                id: 1,
                name: 'سماعات لاسلكية',
                price: 29.99,
                category: 'إلكترونيات',
                vendor: 'متجر التقنية',
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
                amazonUrl: 'https://www.amazon.com/dp/B08XYZ123',
                description: 'سماعات لاسلكية عالية الجودة'
            },
            {
                id: 2,
                name: 'ساعة ذكية',
                price: 99.99,
                category: 'إلكترونيات',
                vendor: 'متجر الأجهزة',
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
                amazonUrl: 'https://www.amazon.com/dp/B08ABC456',
                description: 'ساعة ذكية متطورة'
            }
        ];

        // بيانات تجريبية للبائعين
        this.vendors = [
            { id: 1, name: 'أحمد محمود', email: 'ahmed@example.com', products: 45, sales: 1200, joinDate: '2024-01-15' },
            { id: 2, name: 'محمد علي', email: 'mohamed@example.com', products: 23, sales: 850, joinDate: '2024-02-10' },
            { id: 3, name: 'سارة خالد', email: 'sara@example.com', products: 67, sales: 2100, joinDate: '2024-03-01' }
        ];
    },

    // إعداد مستمعي الأحداث
    setupEventListeners: function() {
        // الأزرار العامة
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action]')) {
                const action = e.target.getAttribute('data-action');
                this.handleAction(action, e.target);
            }
        });

        // النماذج
        document.addEventListener('submit', (e) => {
            if (e.target.matches('form')) {
                e.preventDefault();
                this.handleFormSubmit(e.target);
            }
        });
    },

    // معالجة الأحداث
    handleAction: function(action, element) {
        switch(action) {
            case 'import-amazon':
                this.importFromAmazon();
                break;
            case 'add-vendor':
                this.openAddVendorModal();
                break;
            case 'view-products':
                this.showProducts();
                break;
            case 'add-to-cart':
                const productId = element.getAttribute('data-product-id');
                this.addToCart(productId);
                break;
            case 'logout':
                this.logout();
                break;
            default:
                console.log(`Action not handled: ${action}`);
        }
    },

    // معالجة إرسال النماذج
    handleFormSubmit: function(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        if (form.id === 'login-form') {
            this.login(data);
        } else if (form.id === 'register-form') {
            this.register(data);
        } else if (form.id === 'import-form') {
            this.importProduct(data);
        }
    },

    // تسجيل الدخول
    login: function(credentials) {
        console.log('جاري تسجيل الدخول:', credentials);
        this.showAlert('تم تسجيل الدخول بنجاح!', 'success');
        
        // توجيه حسب نوع المستخدم
        setTimeout(() => {
            if (credentials.email.includes('admin')) {
                window.location.href = 'admin/dashboard.html';
            } else {
                window.location.href = 'vendor/dashboard.html';
            }
        }, 1500);
    },

    // التسجيل
    register: function(data) {
        console.log('جاري التسجيل:', data);
        this.showAlert('تم إنشاء الحساب بنجاح!', 'success');
        
        setTimeout(() => {
            window.location.href = 'vendor/dashboard.html';
        }, 1500);
    },

    // استيراد من أمازون
    importFromAmazon: function() {
        this.showAlert('جاري تحويلك إلى صفحة الاستيراد من أمازون', 'info');
        
        setTimeout(() => {
            window.location.href = 'products/import.html';
        }, 1000);
    },

    // استيراد منتج
    importProduct: function(data) {
        console.log('جاري استيراد المنتج:', data);
        
        // محاكاة الاستيراد
        setTimeout(() => {
            this.showAlert('تم استيراد المنتج بنجاح!', 'success');
            
            // تحديث قائمة المنتجات
            this.products.push({
                id: this.products.length + 1,
                name: `منتج مستورد ${this.products.length + 1}`,
                price: 49.99,
                category: 'مستورد',
                vendor: 'أمازون',
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
            });
        }, 2000);
    },

    // إضافة إلى السلة
    addToCart: function(productId) {
        const product = this.products.find(p => p.id == productId);
        if (product) {
            this.showAlert(`تم إضافة ${product.name} إلى السلة`, 'success');
            
            // تحديث عداد السلة
            this.updateCartCount();
        }
    },

    // تحديث عداد السلة
    updateCartCount: function() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const current = parseInt(cartCount.textContent) || 0;
            cartCount.textContent = current + 1;
        }
    },

    // تحديث إحصائيات لوحة التحكم
    updateDashboardStats: function() {
        // تحديث إحصائيات البائعين
        const vendorCount = document.getElementById('total-vendors');
        const productCount = document.getElementById('total-products');
        const totalSales = document.getElementById('total-sales');
        const totalEarnings = document.getElementById('total-earnings');

        if (vendorCount) {
            vendorCount.textContent = this.vendors.length;
        }
        
        if (productCount) {
            productCount.textContent = this.products.length;
        }
        
        if (totalSales) {
            const sales = this.vendors.reduce((sum, v) => sum + v.sales, 0);
            totalSales.textContent = `$${sales}`;
        }
        
        if (totalEarnings) {
            const earnings = this.vendors.reduce((sum, v) => sum + (v.sales * 0.05), 0);
            totalEarnings.textContent = `$${earnings.toFixed(2)}`;
        }
    },

    // تحميل المنتجات في الشبكة
    loadProductsGrid: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';
        
        this.products.forEach(product => {
            const productCard = `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}" class="product-img">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="price">$${product.price}</p>
                        <p class="category">${product.category}</p>
                        <p class="vendor">${product.vendor}</p>
                        <button class="btn btn-primary" data-action="add-to-cart" data-product-id="${product.id}">
                            <i class="fas fa-cart-plus"></i> أضف للسلة
                        </button>
                    </div>
                </div>
            `;
            container.innerHTML += productCard;
        });
    },

    // تحميل البائعين في جدول
    loadVendorsTable: function(tableId) {
        const table = document.getElementById(tableId);
        if (!table) return;

        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>الاسم</th>
                        <th>البريد الإلكتروني</th>
                        <th>المنتجات</th>
                        <th>المبيعات</th>
                        <th>تاريخ الانضمام</th>
                    </tr>
                </thead>
                <tbody>
        `;

        this.vendors.forEach(vendor => {
            tableHTML += `
                <tr>
                    <td>${vendor.name}</td>
                    <td>${vendor.email}</td>
                    <td>${vendor.products}</td>
                    <td>$${vendor.sales}</td>
                    <td>${vendor.joinDate}</td>
                </tr>
            `;
        });

        tableHTML += '</tbody></table>';
        table.innerHTML = tableHTML;
    },

    // عرض تنبيه
    showAlert: function(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(alertDiv);
        
        // إزالة التنبيه بعد 3 ثواني
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    },

    // فتح نافذة إضافة بائع
    openAddVendorModal: function() {
        this.showAlert('ستتم إضافة صفحة إضافة بائع في الإصدار القادم', 'info');
    },

    // عرض المنتجات
    showProducts: function() {
        window.location.href = 'products/import.html';
    },

    // تسجيل الخروج
    logout: function() {
        if (confirm('هل تريد تسجيل الخروج؟')) {
            this.user = null;
            this.showAlert('تم تسجيل الخروج بنجاح', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    },

    // التحقق من جلسة المستخدم
    checkUserSession: function() {
        const currentPath = window.location.pathname;
        
        // إذا كان في صفحات تحتاج تسجيل دخول
        if (currentPath.includes('admin') || currentPath.includes('vendor')) {
            // في الإصدار الحالي، نسمح بالدخول بدون تسجيل
            // في الإصدار النهائي، نتحقق من تسجيل الدخول
            console.log('التحقق من جلسة المستخدم...');
        }
    }
};

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    MARKETPLACE_APP.init();
    
    // تحميل المنتجات إذا كانت الصفحة تحتوي على products-container
    if (document.getElementById('products-container')) {
        MARKETPLACE_APP.loadProductsGrid('products-container');
    }
    
    // تحميل البائعين إذا كانت الصفحة تحتوي على vendors-table
    if (document.getElementById('vendors-table')) {
        MARKETPLACE_APP.loadVendorsTable('vendors-table');
    }
});

// تصدير للتطوير (للاستخدام في وحدة التحكم)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MARKETPLACE_APP;
}
