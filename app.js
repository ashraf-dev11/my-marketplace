// ============================================
// التطبيق الرئيسي - منصتي
// ============================================

const MarketplaceApp = {
    // البيانات
    currentUser: null,
    products: [],
    vendors: [],
    stats: {
        totalVendors: 0,
        totalProducts: 0,
        totalSales: 0
    },
    
    // التهيئة
    init: function() {
        console.log('🚀 تطبيق منصتي يبدأ التشغيل...');
        
        // إعداد الأحداث
        this.setupEventListeners();
        
        // تحديث الوقت
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
        
        // مراقبة حالة المستخدم
        this.setupAuthListener();
        
        // تحميل البيانات
        this.loadInitialData();
        
        // إعداد لوحة Firebase
        this.setupFirebasePanel();
        
        console.log('✅ التطبيق جاهز للاستخدام');
        return this;
    },
    
    // إعداد الأحداث
    setupEventListeners: function() {
        // زر القائمة في الموبايل
        document.querySelector('.menu-toggle')?.addEventListener('click', () => {
            document.querySelector('nav').classList.toggle('active');
        });
        
        // أزرار التسجيل
        document.addEventListener('click', (e) => {
            if (e.target.closest('#start-free-btn')) {
                this.openRegisterModal();
            }
            
            if (e.target.closest('#watch-demo-btn')) {
                this.showDemoVideo();
            }
            
            if (e.target.closest('#firebase-test-btn')) {
                window.testFirebaseConnection?.();
            }
        });
        
        // الروابط في الفوتر
        document.getElementById('vendor-dashboard-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showVendorDashboard();
        });
        
        document.getElementById('admin-dashboard-link')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showAdminDashboard();
        });
    },
    
    // تحديث الوقت
    updateTime: function() {
        const now = new Date();
        const timeElement = document.getElementById('current-date') || document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = now.toLocaleDateString('ar-EG') + ' - ' + now.toLocaleTimeString('ar-EG');
        }
    },
    
    // مراقبة المصادقة
    setupAuthListener: function() {
        if (!window.auth) {
            setTimeout(() => this.setupAuthListener(), 1000);
            return;
        }
        
        auth.onAuthStateChanged((user) => {
            this.currentUser = user;
            this.updateAuthUI();
            
            if (user) {
                console.log('👤 مستخدم مسجل:', user.email);
                this.loadUserData(user.uid);
            } else {
                console.log('👤 لا يوجد مستخدم مسجل');
            }
        });
    },
    
    // تحديث واجهة المصادقة
    updateAuthUI: function() {
        const authButtons = document.getElementById('auth-buttons');
        if (!authButtons) return;
        
        if (this.currentUser) {
            authButtons.innerHTML = `
                <div class="user-info">
                    <span>مرحباً، ${this.currentUser.email}</span>
                    <button onclick="MarketplaceApp.logout()" class="btn-logout">
                        <i class="fas fa-sign-out-alt"></i> خروج
                    </button>
                </div>
            `;
        } else {
            authButtons.innerHTML = `
                <a href="#" onclick="MarketplaceApp.showLoginModal()" class="btn-login">
                    <i class="fas fa-sign-in-alt"></i> دخول
                </a>
                <a href="#" onclick="MarketplaceApp.openRegisterModal()" class="btn-login" style="background: #4CAF50;">
                    <i class="fas fa-user-plus"></i> سجل مجاناً
                </a>
            `;
        }
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
        
        // تحديث الإحصائيات
        this.updateStats();
        
        // تحميل المميزات
        this.loadFeatures();
        
        // تحميل خطوات العمل
        this.loadHowItWorks();
        
        // تحميل خطط الأسعار
        this.loadPricing();
        
        // تحميل الأسئلة الشائعة
        this.loadFAQ();
    },
    
    // تحديث الإحصائيات
    updateStats: function() {
        this.stats.totalProducts = this.products.length;
        this.stats.totalVendors = 12; // بيانات تجريبية
        this.stats.totalSales = 3850;
        
        // تحديث الواجهة
        document.getElementById('total-vendors')?.textContent = this.stats.totalVendors;
        document.getElementById('total-products')?.textContent = this.stats.totalProducts;
        document.getElementById('total-sales')?.textContent = '$' + this.stats.totalSales;
    },
    
    // تحميل المميزات
    loadFeatures: function() {
        const featuresGrid = document.querySelector('.features-grid');
        if (!featuresGrid) return;
        
        const features = [
            {
                icon: 'fa-fire',
                title: 'Firebase مجاني',
                description: 'قاعدة بيانات حقيقية مجانية من جوجل'
            },
            {
                icon: 'fab fa-amazon',
                title: 'أمازون مباشرة',
                description: 'استيراد منتجات وربح عمولة 10% فوراً'
            },
            {
                icon: 'fa-money-bill-wave',
                title: 'ربح مزدوج',
                description: 'اربح من أمازون والبائعين معاً'
            },
            {
                icon: 'fa-chart-line',
                title: 'إحصائيات حية',
                description: 'تابع أداء متجرك في الوقت الحقيقي'
            },
            {
                icon: 'fa-mobile-alt',
                title: 'متجاوب تماماً',
                description: 'يعمل على جميع الأجهزة والشاشات'
            },
            {
                icon: 'fa-headset',
                title: 'دعم فني 24/7',
                description: 'فريق دعم متاح على مدار الساعة'
            }
        ];
        
        featuresGrid.innerHTML = features.map(feature => `
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="${feature.icon}"></i>
                </div>
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
            </div>
        `).join('');
    },
    
    // تحميل كيف تعمل
    loadHowItWorks: function() {
        const stepsContainer = document.querySelector('.steps-timeline');
        if (!stepsContainer) return;
        
        const steps = [
            {
                number: '1',
                title: 'سجل مجاناً',
                description: 'أنشئ حساب بائع في دقيقة واحدة'
            },
            {
                number: '2',
                title: 'استورد من أمازون',
                description: 'اختر منتجات من أمازون واربح عمولة'
            },
            {
                number: '3',
                title: 'انشر منتجاتك',
                description: 'عرض المنتجات في متجرك الخاص'
            },
            {
                number: '4',
                title: 'اربح عمولات',
                description: 'اربح من أمازون ومن مبيعاتك'
            }
        ];
        
        stepsContainer.innerHTML = steps.map(step => `
            <div class="step">
                <div class="step-number">${step.number}</div>
                <div class="step-content">
                    <h3>${step.title}</h3>
                    <p>${step.description}</p>
                </div>
            </div>
        `).join('');
    },
    
    // تحميل خطط الأسعار
    loadPricing: function() {
        const pricingCards = document.getElementById('pricing-cards');
        if (!pricingCards) return;
        
        const plans = [
            {
                name: 'مجاني',
                price: '0',
                period: 'شهر',
                features: [
                    { text: '10 منتجات', available: true },
                    { text: 'لوحة تحكم أساسية', available: true },
                    { text: 'تقارير متقدمة', available: false },
                    { text: 'دعم فوري', available: false }
                ],
                buttonText: 'ابدأ مجاناً',
                popular: false
            },
            {
                name: 'احترافي',
                price: '9.99',
                period: 'شهر',
                features: [
                    { text: '100 منتج', available: true },
                    { text: 'لوحة تحكم متقدمة', available: true },
                    { text: 'تقارير متقدمة', available: true },
                    { text: 'دعم فوري', available: true }
                ],
                buttonText: 'اختر الاحترافي',
                popular: true
            },
            {
                name: 'أعمال',
                price: '29.99',
                period: 'شهر',
                features: [
                    { text: 'منتجات غير محدودة', available: true },
                    { text: 'جميع المميزات', available: true },
                    { text: 'دعم 24/7', available: true },
                    { text: 'تحليلات متقدمة', available: true }
                ],
                buttonText: 'للشركات',
                popular: false
            }
        ];
        
        pricingCards.innerHTML = plans.map(plan => `
            <div class="price-card ${plan.popular ? 'popular' : ''}">
                ${plan.popular ? '<div class="popular-badge">الأكثر شيوعاً</div>' : ''}
                <div class="price-header">
                    <h3>${plan.name}</h3>
                    <div class="price">${plan.price}$ <span>/${plan.period}</span></div>
                </div>
                <ul class="price-features">
                    ${plan.features.map(feature => `
                        <li><i class="fas fa-${feature.available ? 'check' : 'times'}"></i> ${feature.text}</li>
                    `).join('')}
                </ul>
                <a href="#" class="btn-price" onclick="MarketplaceApp.selectPlan('${plan.name}')">
                    ${plan.buttonText}
                </a>
            </div>
        `).join('');
    },
    
    // تحميل الأسئلة الشائعة
    loadFAQ: function() {
        const faqContainer = document.querySelector('.faq-container');
        if (!faqContainer) return;
        
        const faqs = [
            {
                question: 'كيف أربح من أمازون؟',
                answer: 'عندما تضيف منتج من أمازون، تحصل على عمولة 10% من كل عملية بيع تتم عبر رابطك.'
            },
            {
                question: 'هل هناك رسوم شهرية؟',
                answer: 'نعم، لدينا خطة مجانية وخطط مدفوعة. يمكنك البدء مجاناً والترقية لاحقاً.'
            },
            {
                question: 'كيف أستورد المنتجات؟',
                answer: 'يمكنك استيراد المنتجات من أمازون بسهولة عن طريق رابط المنتج أو البحث المباشر.'
            },
            {
                question: 'هل يمكنني إضافة منتجات خاصة بي؟',
                answer: 'نعم، يمكنك إضافة منتجاتك الخاصة بالإضافة إلى منتجات أمازون.'
            }
        ];
        
        faqContainer.innerHTML = faqs.map((faq, index) => `
            <div class="faq-item" onclick="MarketplaceApp.toggleFAQ(${index})">
                <div class="faq-question">
                    <span>${faq.question}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="faq-answer">
                    <p>${faq.answer}</p>
                </div>
            </div>
        `).join('');
    },
    
    // دوال الواجهة
    toggleFAQ: function(index) {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach((item, i) => {
            if (i === index) {
                item.classList.toggle('active');
            } else {
                item.classList.remove('active');
            }
        });
    },
    
    openRegisterModal: function() {
        this.showModal('تسجيل حساب جديد', `
            <form id="register-form">
                <div class="form-group">
                    <label for="name">الاسم الكامل</label>
                    <input type="text" id="name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="email">البريد الإلكتروني</label>
                    <input type="email" id="email" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="password">كلمة المرور</label>
                    <input type="password" id="password" class="form-control" required minlength="6">
                </div>
                <div class="form-group">
                    <label for="phone">رقم الهاتف</label>
                    <input type="tel" id="phone" class="form-control">
                </div>
                <button type="submit" class="btn btn-primary w-100">
                    <i class="fas fa-user-plus"></i> إنشاء حساب
                </button>
            </form>
        `);
        
        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.registerUser();
        });
    },
    
    showLoginModal: function() {
        this.showModal('تسجيل الدخول', `
            <form id="login-form">
                <div class="form-group">
                    <label for="login-email">البريد الإلكتروني</label>
                    <input type="email" id="login-email" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="login-password">كلمة المرور</label>
                    <input type="password" id="login-password" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">
                    <i class="fas fa-sign-in-alt"></i> تسجيل الدخول
                </button>
            </form>
            <div class="text-center mt-3">
                <a href="#" onclick="MarketplaceApp.forgotPassword()">نسيت كلمة المرور؟</a>
            </div>
        `);
        
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.loginUser();
        });
    },
    
    registerUser: async function() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const phone = document.getElementById('phone').value;
        
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            
            // حفظ البيانات الإضافية
            await db.collection('users').doc(userCredential.user.uid).set({
                name: name,
                email: email,
                phone: phone,
                userType: 'vendor',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'active'
            });
            
            // إنشاء متجر افتراضي
            await db.collection('vendors').doc(userCredential.user.uid).set({
                vendorId: userCredential.user.uid,
                storeName: `متجر ${name}`,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'active',
                plan: 'free'
            });
            
            this.showNotification('success', 'تم إنشاء الحساب بنجاح!');
            this.closeModal();
            
        } catch (error) {
            this.showNotification('error', error.message);
        }
    },
    
    loginUser: async function() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        try {
            await auth.signInWithEmailAndPassword(email, password);
            this.showNotification('success', 'تم تسجيل الدخول بنجاح!');
            this.closeModal();
        } catch (error) {
            this.showNotification('error', error.message);
        }
    },
    
    logout: async function() {
        try {
            await auth.signOut();
            this.showNotification('success', 'تم تسجيل الخروج بنجاح');
        } catch (error) {
            this.showNotification('error', error.message);
        }
    },
    
    forgotPassword: function() {
        const email = prompt('أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور:');
        if (email) {
            auth.sendPasswordResetEmail(email)
                .then(() => alert('تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني'))
                .catch(error => alert('خطأ: ' + error.message));
        }
    },
    
    selectPlan: function(planName) {
        if (!this.currentUser) {
            this.openRegisterModal();
            return;
        }
        
        this.showNotification('info', `تم اختيار الخطة: ${planName}`);
    },
    
    showDemoVideo: function() {
        this.showModal('شرح النظام', `
            <div class="text-center">
                <i class="fas fa-video" style="font-size: 4rem; color: var(--primary); margin-bottom: 1rem;"></i>
                <p>فيديو شرح النظام قريباً...</p>
                <p>يمكنك تجربة النظام مباشرة عن طريق إنشاء حساب تجريبي</p>
                <button class="btn btn-primary mt-3" onclick="window.createTestUser()">
                    <i class="fas fa-user-plus"></i> إنشاء حساب تجريبي
                </button>
            </div>
        `);
    },
    
    showVendorDashboard: function() {
        if (!this.currentUser) {
            this.showLoginModal();
            return;
        }
        
        this.showModal('لوحة البائع', `
            <div class="dashboard">
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <h3 id="my-products">0</h3>
                        <p>منتجات</p>
                    </div>
                    <div class="stat-card">
                        <h3 id="my-sales">$0</h3>
                        <p>مبيعات</p>
                    </div>
                    <div class="stat-card">
                        <h3 id="my-orders">0</h3>
                        <p>طلبات</p>
                    </div>
                </div>
                <div class="mt-4">
                    <button class="btn btn-primary" onclick="MarketplaceApp.addProduct()">
                        <i class="fas fa-plus"></i> إضافة منتج
                    </button>
                    <button class="btn btn-secondary" onclick="MarketplaceApp.viewProducts()">
                        <i class="fas fa-box"></i> عرض المنتجات
                    </button>
                </div>
            </div>
        `);
        
        // تحميل بيانات البائع
        this.loadVendorData();
    },
    
    showAdminDashboard: function() {
        if (!this.currentUser) {
            this.showLoginModal();
            return;
        }
        
        this.showModal('لوحة التحكم', `
            <div class="dashboard">
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <h3 id="admin-vendors">0</h3>
                        <p>بائعين</p>
                    </div>
                    <div class="stat-card">
                        <h3 id="admin-products">0</h3>
                        <p>منتجات</p>
                    </div>
                    <div class="stat-card">
                        <h3 id="admin-sales">$0</h3>
                        <p>مبيعات</p>
                    </div>
                    <div class="stat-card">
                        <h3 id="admin-earnings">$0</h3>
                        <p>أرباح</p>
                    </div>
                </div>
                <div class="mt-4">
                    <button class="btn btn-primary" onclick="MarketplaceApp.viewAllVendors()">
                        <i class="fas fa-users"></i> عرض البائعين
                    </button>
                    <button class="btn btn-secondary" onclick="MarketplaceApp.viewReports()">
                        <i class="fas fa-chart-bar"></i> التقارير
                    </button>
                </div>
            </div>
        `);
    },
    
    loadVendorData: function() {
        if (!this.currentUser) return;
        
        // بيانات تجريبية
        document.getElementById('my-products').textContent = '24';
        document.getElementById('my-sales').textContent = '$1,250';
        document.getElementById('my-orders').textContent = '8';
    },
    
    addProduct: function() {
        this.showModal('إضافة منتج جديد', `
            <form id="add-product-form">
                <div class="form-group">
                    <label for="product-name">اسم المنتج</label>
                    <input type="text" id="product-name" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="product-price">السعر ($)</label>
                    <input type="number" id="product-price" class="form-control" step="0.01" required>
                </div>
                <div class="form-group">
                    <label for="product-category">الفئة</label>
                    <select id="product-category" class="form-control">
                        <option value="electronics">إلكترونيات</option>
                        <option value="fashion">أزياء</option>
                        <option value="home">منزل</option>
                        <option value="beauty">جمال</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="product-description">الوصف</label>
                    <textarea id="product-description" class="form-control" rows="3"></textarea>
                </div>
                <button type="submit" class="btn btn-primary w-100">
                    <i class="fas fa-plus"></i> إضافة المنتج
                </button>
            </form>
        `);
        
        document.getElementById('add-product-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            this.saveProduct();
        });
    },
    
    saveProduct: async function() {
        if (!this.currentUser) return;
        
        const productData = {
            name: document.getElementById('product-name').value,
            price: parseFloat(document.getElementById('product-price').value),
            category: document.getElementById('product-category').value,
            description: document.getElementById('product-description').value,
            vendorId: this.currentUser.uid,
            vendorName: this.currentUser.email,
            status: 'active',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        try {
            await db.collection('products').add(productData);
            this.showNotification('success', 'تم إضافة المنتج بنجاح!');
            this.closeModal();
        } catch (error) {
            this.showNotification('error', error.message);
        }
    },
    
    viewProducts: function() {
        this.showModal('المنتجات', `
            <div class="products-grid" id="vendor-products-grid">
                <!-- سيتم تحميل المنتجات هنا -->
            </div>
        `);
        
        this.loadVendorProducts();
    },
    
    loadVendorProducts: async function() {
        if (!this.currentUser) return;
        
        try {
            const snapshot = await db.collection('products')
                .where('vendorId', '==', this.currentUser.uid)
                .get();
            
            const productsGrid = document.getElementById('vendor-products-grid');
            if (!productsGrid) return;
            
            if (snapshot.empty) {
                productsGrid.innerHTML = `
                    <div class="text-center p-5">
                        <i class="fas fa-box-open" style="font-size: 3rem; color: #ccc;"></i>
                        <p class="mt-3">لا توجد منتجات</p>
                        <button class="btn btn-primary mt-2" onclick="MarketplaceApp.addProduct()">
                            <i class="fas fa-plus"></i> أضف منتجك الأول
                        </button>
                    </div>
                `;
                return;
            }
            
            productsGrid.innerHTML = snapshot.docs.map(doc => {
                const data = doc.data();
                return `
                    <div class="product-card">
                        <img src="${data.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'}" 
                             class="product-img" alt="${data.name}">
                        <div class="product-info">
                            <h3>${data.name}</h3>
                            <p class="price">$${data.price}</p>
                            <p class="category">${data.category}</p>
                        </div>
                    </div>
                `;
            }).join('');
            
        } catch (error) {
            console.error('Error loading products:', error);
        }
    },
    
    viewAllVendors: function() {
        this.showModal('جميع البائعين', `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>اسم المتجر</th>
                            <th>البريد الإلكتروني</th>
                            <th>المنتجات</th>
                            <th>المبيعات</th>
                            <th>الحالة</th>
                        </tr>
                    </thead>
                    <tbody id="vendors-table-body">
                        <!-- سيتم تحميل البائعين هنا -->
                    </tbody>
                </table>
            </div>
        `);
        
        this.loadAllVendors();
    },
    
    loadAllVendors: async function() {
        try {
            const snapshot = await db.collection('vendors').get();
            const tbody = document.getElementById('vendors-table-body');
            
            if (!tbody) return;
            
            if (snapshot.empty) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center">لا يوجد بائعين مسجلين</td>
                    </tr>
                `;
                return;
            }
            
            tbody.innerHTML = snapshot.docs.map(doc => {
                const data = doc.data();
                return `
                    <tr>
                        <td>${data.storeName}</td>
                        <td>${data.email}</td>
                        <td>24</td>
                        <td>$${data.totalSales || 0}</td>
                        <td><span class="badge ${data.status === 'active' ? 'badge-success' : 'badge-danger'}">
                            ${data.status === 'active' ? 'نشط' : 'غير نشط'}
                        </span></td>
                    </tr>
                `;
            }).join('');
            
        } catch (error) {
            console.error('Error loading vendors:', error);
        }
    },
    
    viewReports: function() {
        this.showModal('تقارير المبيعات', `
            <div class="text-center">
                <i class="fas fa-chart-bar" style="font-size: 4rem; color: var(--primary); margin-bottom: 1rem;"></i>
                <p>تقارير المبيقات قريباً...</p>
                <p>يمكنك متابعة إحصائياتك من خلال لوحة التحكم</p>
            </div>
        `);
    },
    
    loadUserData: async function(userId) {
        try {
            const userDoc = await db.collection('users').doc(userId).get();
            if (userDoc.exists) {
                console.log('User data:', userDoc.data());
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    },
    
    // إظهار النماذج المنبثقة
    showModal: function(title, content) {
        const modalHTML = `
            <div class="modal-overlay" id="modal-overlay" onclick="MarketplaceApp.closeModal()">
                <div class="modal" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        <button class="modal-close" onclick="MarketplaceApp.closeModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            </div>
        `;
        
        // إزالة أي نافذة سابقة
        this.closeModal();
        
        // إضافة النافذة الجديدة
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },
    
    closeModal: function() {
        const modalOverlay = document.getElementById('modal-overlay');
        if (modalOverlay) {
            modalOverlay.remove();
        }
    },
    
    // إظهار الإشعارات
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
    
    // إعداد لوحة Firebase
    setupFirebasePanel: function() {
        // زر Firebase
        const firebaseBtn = document.createElement('button');
        firebaseBtn.className = 'firebase-panel-btn';
        firebaseBtn.innerHTML = '🔥';
        firebaseBtn.title = 'تحكم في Firebase';
        firebaseBtn.onclick = this.toggleFirebasePanel.bind(this);
        
        // لوحة التحكم
        const panelHTML = `
            <div class="firebase-panel-content" id="firebase-panel">
                <div class="firebase-status">
                    <div class="firebase-status-indicator ${window.firebaseReady ? 'connected' : ''}"></div>
                    <span>${window.firebaseReady ? 'Firebase متصل' : 'Firebase غير متصل'}</span>
                </div>
                <div class="firebase-controls">
                    <button class="firebase-btn test" onclick="window.testFirebaseConnection()">
                        <i class="fas fa-plug"></i> اختبار الاتصال
                    </button>
                    <button class="firebase-btn create-user" onclick="window.createTestUser()">
                        <i class="fas fa-user-plus"></i> مستخدم تجريبي
                    </button>
                    <button class="firebase-btn create-product" onclick="window.addTestProduct()">
                        <i class="fas fa-box"></i> منتج تجريبي
                    </button>
                    ${this.currentUser ? `
                    <button class="firebase-btn logout" onclick="MarketplaceApp.logout()">
                        <i class="fas fa-sign-out-alt"></i> تسجيل خروج
                    </button>
                    ` : ''}
                </div>
                <div class="firebase-stats mt-3">
                    <div class="row">
                        <div class="col-6">
                            <small>المنتجات:</small>
                            <div id="panel-products">0</div>
                        </div>
                        <div class="col-6">
                            <small>البائعون:</small>
                            <div id="panel-vendors">0</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // إضافة إلى الصفحة
        const panelContainer = document.createElement('div');
        panelContainer.id = 'firebase-control-panel';
        panelContainer.innerHTML = panelHTML;
        
        document.body.appendChild(firebaseBtn);
        document.body.appendChild(panelContainer);
        
        // تحديث الإحصائيات
        this.updatePanelStats();
    },
    
    toggleFirebasePanel: function() {
        const panel = document.getElementById('firebase-panel');
        panel.classList.toggle('show');
    },
    
    updatePanelStats: async function() {
        if (!window.firebaseReady) return;
        
        try {
            // عدد المنتجات
            const productsSnapshot = await db.collection('products').get();
            document.getElementById('panel-products').textContent = productsSnapshot.size;
            
            // عدد البائعين
            const vendorsSnapshot = await db.collection('vendors').get();
            document.getElementById('panel-vendors').textContent = vendorsSnapshot.size;
            
        } catch (error) {
            console.log('⚠️ لا يمكن تحديث إحصائيات اللوحة');
        }
    },
    
    showNotification: function(type, message) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // إزالة بعد 3 ثواني
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// بدء التطبيق
document.addEventListener('DOMContentLoaded', function() {
    // انتظار Firebase
    const checkFirebase = setInterval(() => {
        if (window.firebaseReady) {
            clearInterval(checkFirebase);
            window.App = MarketplaceApp.init();
        }
    }, 500);
});
