// التطبيق الرئيسي

// روابط الصفحات
const PAGES = {
    HOME: 'index.html',
    ADMIN: 'admin/dashboard.html',
    VENDOR: 'vendor/dashboard.html',
    LOGIN: 'auth/login.html',
    REGISTER: 'auth/register.html',
    PRODUCTS: 'products/index.html'
};

// بيانات تجريبية للبداية
const SAMPLE_PRODUCTS = [
    {
        id: 1,
        name: 'سماعات لاسلكية',
        price: 29.99,
        category: 'إلكترونيات',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
        vendor: 'متجر التقنية'
    },
    {
        id: 2,
        name: 'ساعة ذكية',
        price: 99.99,
        category: 'إلكترونيات',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w-400&h=300&fit=crop',
        vendor: 'متجر الأجهزة'
    }
];

// وظائف عامة
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    // تصميم Alert
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// تحميل المنتجات
function loadProducts() {
    if (!document.getElementById('products-container')) return;
    
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    SAMPLE_PRODUCTS.forEach(product => {
        const productHTML = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-img">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price}</p>
                    <p>${product.category}</p>
                    <button onclick="addToCart(${product.id})" class="btn btn-primary">أضف للسلة</button>
                </div>
            </div>
        `;
        container.innerHTML += productHTML;
    });
}

// إضافة للسلة
function addToCart(productId) {
    const product = SAMPLE_PRODUCTS.find(p => p.id === productId);
    if (product) {
        showAlert(`تم إضافة ${product.name} إلى السلة`, 'success');
    }
}

// تحميل المستخدمين (تجريبي)
function loadVendors() {
    const vendors = [
        { name: 'أحمد محمود', products: 45, sales: 1200 },
        { name: 'محمد علي', products: 23, sales: 850 },
        { name: 'سارة خالد', products: 67, sales: 2100 }
    ];
    
    // عرض الإحصائيات
    updateStats(vendors);
}

// تحديث الإحصائيات
function updateStats(vendors) {
    const totalProducts = vendors.reduce((sum, v) => sum + v.products, 0);
    const totalSales = vendors.reduce((sum, v) => sum + v.sales, 0);
    
    document.getElementById('total-vendors').textContent = vendors.length;
    document.getElementById('total-products').textContent = totalProducts;
    document.getElementById('total-sales').textContent = `$${totalSales}`;
}

// بدء التطبيق
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ التطبيق يعمل بنجاح!');
    
    // تحميل المنتجات إذا كانت الصفحة تحتوي على container
    loadProducts();
    
    // تحميل البائعين إذا كانت صفحة الإدارة
    if (document.getElementById('vendors-stats')) {
        loadVendors();
    }
    
    // تفعيل الأزرار
    document.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleAction(action);
        });
    });
});

// معالجة الأحداث
function handleAction(action) {
    switch(action) {
        case 'import-amazon':
            showAlert('جاري استيراد المنتجات من أمازون...', 'info');
            // سيتم إضافة كود الاستيراد لاحقاً
            break;
        case 'add-vendor':
            window.location.href = PAGES.REGISTER;
            break;
        case 'view-products':
            window.location.href = PAGES.PRODUCTS;
            break;
    }
}

// تصدير للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { loadProducts, showAlert };
}
