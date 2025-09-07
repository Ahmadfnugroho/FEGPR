// Service Worker for Global Photo Rental PWA
// Version 1.0.0

const CACHE_NAME = 'gpr-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/LOGO-GPR.png',
  // Add critical CSS and JS files
  // Note: These will be populated automatically by build process
];

// API endpoints that should be cached
const API_CACHE_PATTERNS = [
  /\/api\/categories$/,
  /\/api\/brands$/,
  /\/api\/products\?.*$/,
  /\/api\/product\/[^\/]+$/,
];

// Images and media patterns
const MEDIA_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
  /\/storage\/.*\.(png|jpg|jpeg|gif|webp|avif)$/,
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      
      try {
        // Cache critical static assets
        await cache.addAll(STATIC_ASSETS);
        console.log('✅ Critical assets cached successfully');
      } catch (error) {
        console.error('❌ Failed to cache critical assets:', error);
        // Continue anyway, don't block installation
      }
      
      // Skip waiting to activate immediately
      self.skipWaiting();
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      const oldCaches = cacheNames.filter(name => name !== CACHE_NAME);
      
      await Promise.all(
        oldCaches.map(name => {
          console.log('🗑️ Deleting old cache:', name);
          return caches.delete(name);
        })
      );
      
      // Take control of all clients
      await clients.claim();
      console.log('✅ Service Worker activated and controlling all clients');
    })()
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests (unless it's our API)
  if (url.origin !== location.origin && !url.hostname.includes('gpr-b5n3q.sevalla.app')) {
    return;
  }
  
  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: API Requests - Network First with Cache Fallback
    if (isApiRequest(url)) {
      return await networkFirstStrategy(request);
    }
    
    // Strategy 2: Media Files - Cache First
    if (isMediaRequest(url)) {
      return await cacheFirstStrategy(request);
    }
    
    // Strategy 3: Navigation Requests - Network First with Offline Fallback
    if (request.mode === 'navigate') {
      return await navigationStrategy(request);
    }
    
    // Strategy 4: Static Assets - Cache First with Network Fallback
    return await cacheFirstStrategy(request);
    
  } catch (error) {
    console.error('Fetch handler error:', error);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return await caches.match(OFFLINE_URL);
    }
    
    // Return cached version if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Last resort: return a basic error response
    return new Response('Network error occurred', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

// Network First Strategy - for API requests
async function networkFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache for:', request.url);
    
    // Fallback to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Cache First Strategy - for static assets and media
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Fallback to network
    const networkResponse = await fetch(request);
    
    // Cache the response for future use
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Both cache and network failed for:', request.url);
    throw error;
  }
}

// Navigation Strategy - for page requests
async function navigationStrategy(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful page responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Navigation request failed, showing offline page');
    
    // Show offline page
    const offlineResponse = await caches.match(OFFLINE_URL);
    if (offlineResponse) {
      return offlineResponse;
    }
    
    // If offline page is not cached, return a basic offline response
    return new Response(`
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Offline - Global Photo Rental</title>
          <style>
            body { 
              font-family: system-ui, sans-serif; 
              text-align: center; 
              padding: 2rem; 
              background: #0a173b; 
              color: white; 
            }
            .container { 
              max-width: 400px; 
              margin: 0 auto; 
              padding: 2rem; 
              background: rgba(255,255,255,0.1); 
              border-radius: 1rem; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>📵 Anda Sedang Offline</h1>
            <p>Periksa koneksi internet Anda dan coba lagi.</p>
            <button onclick="window.location.reload()">Coba Lagi</button>
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

// Helper functions
function isApiRequest(url) {
  return API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname + url.search));
}

function isMediaRequest(url) {
  return MEDIA_PATTERNS.some(pattern => pattern.test(url.pathname));
}

// Background Sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('🔄 Performing background sync...');
  
  try {
    // Sync any pending offline actions
    // This could include booking requests, contact forms, etc.
    const pendingActions = await getStoredActions();
    
    for (const action of pendingActions) {
      try {
        await syncAction(action);
        await removeStoredAction(action.id);
      } catch (error) {
        console.error('Failed to sync action:', action, error);
      }
    }
    
    // Show success notification
    self.registration.showNotification('Global Photo Rental', {
      body: 'Data berhasil disinkronkan!',
      icon: '/LOGO-GPR.png',
      badge: '/LOGO-GPR.png',
    });
    
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Notifikasi dari Global Photo Rental',
    icon: '/LOGO-GPR.png',
    badge: '/LOGO-GPR.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Lihat Produk',
        icon: '/icons/camera.png'
      },
      {
        action: 'close',
        title: 'Tutup',
        icon: '/icons/close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Global Photo Rental', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/browse-product')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper functions for storing offline actions
async function getStoredActions() {
  // In a real implementation, this would read from IndexedDB
  return [];
}

async function syncAction(action) {
  // In a real implementation, this would send the action to the server
  console.log('Syncing action:', action);
}

async function removeStoredAction(actionId) {
  // In a real implementation, this would remove the action from IndexedDB
  console.log('Removing stored action:', actionId);
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(updateContent());
  }
});

async function updateContent() {
  console.log('🔄 Updating content in background...');
  
  try {
    // Update cached product data, categories, etc.
    const cache = await caches.open(CACHE_NAME);
    
    const endpoints = [
      '/api/categories',
      '/api/brands',
      '/api/products?featured=true'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          await cache.put(endpoint, response.clone());
        }
      } catch (error) {
        console.error('Failed to update', endpoint, error);
      }
    }
    
  } catch (error) {
    console.error('Content update failed:', error);
  }
}

console.log('📱 Global Photo Rental Service Worker loaded successfully!');
