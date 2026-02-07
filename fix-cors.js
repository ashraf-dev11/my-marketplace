// حل مشاكل CORS لـ Firebase على GitHub Pages
(function() {
  'use strict';
  
  console.log('🛡️ تحميل إصلاحات CORS لـ Firebase...');
  
  // إصلاح fetch API
  const originalFetch = window.fetch;
  window.fetch = function(resource, init) {
    // إضافة headers لطلبات Firebase
    if (typeof resource === 'string' && 
        (resource.includes('firebase') || 
         resource.includes('googleapis') || 
         resource.includes('google.com'))) {
      
      const options = init || {};
      options.mode = 'cors';
      options.credentials = 'omit';
      
      if (!options.headers) {
        options.headers = {};
      }
      
      // إضافة headers للتحكم في CORS
      options.headers['Accept'] = 'application/json, text/plain, */*';
      options.headers['Content-Type'] = 'application/json';
      
      console.log('🔧 تطبيق إصلاح CORS على:', resource.substring(0, 50) + '...');
    }
    
    return originalFetch.call(this, resource, init);
  };
  
  // إصلاح XMLHttpRequest
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    if (url && (url.includes('firebase') || url.includes('googleapis'))) {
      this._isFirebaseRequest = true;
    }
    return originalXHROpen.apply(this, arguments);
  };
  
  const originalXHRSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function(body) {
    if (this._isFirebaseRequest) {
      // إضافة headers إذا لزم الأمر
      this.setRequestHeader('Accept', 'application/json, text/plain, */*');
    }
    return originalXHRSend.apply(this, arguments);
  };
  
  console.log('✅ تم تطبيق إصلاحات CORS');
  
  // إضافة event listener لالتقاط أخطاء CORS
  window.addEventListener('error', function(event) {
    if (event.message && event.message.includes('CORS') || 
        event.message && event.message.includes('Access-Control')) {
      console.warn('⚠️ تم اكتشاف خطأ CORS:', event.message);
      
      // محاولة إعادة تحميل Firebase
      if (typeof firebase !== 'undefined' && !window._firebaseRetried) {
        window._firebaseRetried = true;
        setTimeout(() => {
          if (firebase.apps.length > 0) {
            console.log('🔄 محاولة إعادة تهيئة Firebase...');
            window.location.reload();
          }
        }, 3000);
      }
    }
  }, true);
  
})();
