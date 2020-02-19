var APP_PREFIX = 'MEOWNICA_';     // Identifier for this app (this needs to be consistent across every cache update)
var VERSION = '0.0.2';                    // Version of the off-line cache (change this value everytime you want to update cache)
var CACHE_NAME = APP_PREFIX + VERSION;
var URLS = [                            // Add URL you want to cache in this list.
  '/',
  '/index.html',
  '/css/base.css',
  '/css/mobile.css',
  '/css/pygments.css',
  '/manifest.json',
  '/images/favicon.png',
  '/images/avatar.jpg',
  '/elements/emoji-rain.html',
  '/bower_components/webcomponentsjs/webcomponents-lite.js',
]

var debug = false;

// Respond with cached resources
self.addEventListener('fetch', function (e) {
  if (debug) console.log('fetch request : ' + e.request.url)
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) { // if cache is available, respond with cache
        if (debug) console.log('responding with cache : ' + e.request.url)
        return request
      } else {       // if there are no cache, try fetching request
        if (debug) console.log('file is not cached, fetching : ' + e.request.url)
        return fetch(e.request)
      }
    })
  )
})

// Cache resources
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      if (debug) console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(URLS)
    })
  )
})

// Delete outdated caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create white list
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      })
      // add current cache name to white list
      cacheWhitelist.push(CACHE_NAME)

      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          if (debug) console.log('deleting cache : ' + keyList[i] )
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})
