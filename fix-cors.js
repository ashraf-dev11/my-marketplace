// حل مشكلة CORS لـ Firebase
(function() {
    // إصلاح CORS لـ GitHub Pages
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (url.includes('firebase') || url.includes('googleapis')) {
            if (!options) options = {};
            if (!options.headers) options.headers = {};
            options.headers['Access-Control-Allow-Origin'] = '*';
            options.mode = 'cors';
        }
        return originalFetch(url, options);
    };
    
    console.log('✅ تم إصلاح مشاكل CORS');
})();
