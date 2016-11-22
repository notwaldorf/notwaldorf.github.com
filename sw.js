var VERSION = '0.0.3';

this.addEventListener('install', function(e) {
  e.waitUntil(caches.open(VERSION).then(cache => {
    return cache.addAll([
      '/',
      '/index.html',
      '/css/base.css',
      '/css/mobile.css',
      '/css/pygments.css',
      '/manifest.json',
      '/images/favicon.png',
      '/images/avatar.jpeg',
      '/elements/emoji-rain.html',
      '/bower_components/webcomponentsjs/webcomponents-lite.js',
    ]).then(_ => this.skipWaiting());
}))});

this.addEventListener('fetch', function(e) {
  e.respondWith(caches.match(e.request).then((res) => {
    // If there is no match in the cache, we get undefined back,
    // in that case go to the network!
    return res ? res : fetch(e.request);
  }));
});

this.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then((keys) => {
    return Promise.all(keys.map(k => {
      if (k !== VERSION) {
        return caches.delete(k);
      }
    })).then(_ => {
      return this.clients.claim()
    });
}))});

// fetch from network
// and put into our cache
function handleNoCacheMatch(e) {
  return fetch(e.request).then(res => {
    var origin = location.origin;
    var weCare =
        res.url.indexOf(origin + '/images') !== -1 ||
        res.url.indexOf(origin + '/fonts') !== -1 ||
        res.url.indexOf(origin + '/about') !== -1 ||
        res.url.indexOf(origin + '/talks') !== -1 ||
        res.url.indexOf(origin + '/posts') !== -1;

    if (!weCare)
      return res;

    return caches.open(VERSION).then(cache => {
      cache.put(e.request, res.clone());
      return res;
    });
  });
}
