/* Service Worker - QM Relatorio Fotografico - offline real (pre-cache do app) */
var C='qm-rf-v2';
self.addEventListener('install',function(e){
  e.waitUntil(
    caches.open(C).then(function(c){return c.add('./')})
      .then(function(){return self.skipWaiting()})
      .catch(function(){return self.skipWaiting()})
  );
});
self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(ks){return Promise.all(ks.map(function(k){return k!==C?caches.delete(k):null}))})
      .then(function(){return self.clients.claim()})
  );
});
self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET')return;
  if(r.mode==='navigate'){
    e.respondWith(
      caches.open(C).then(function(c){
        return c.match('./').then(function(cached){
          var net=fetch(r).then(function(res){try{c.put('./',res.clone())}catch(x){}return res}).catch(function(){return cached});
          return cached||net;
        });
      })
    );
    return;
  }
  e.respondWith(
    caches.match(r).then(function(cached){
      return cached||fetch(r).catch(function(){return cached});
    })
  );
});
