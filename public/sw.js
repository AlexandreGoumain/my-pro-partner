/**
 * Service Worker pour mode offline
 * Gère la mise en cache et la synchronisation en arrière-plan
 */

const CACHE_NAME = 'mypropartner-v1';
const OFFLINE_URL = '/offline';

const CACHE_URLS = [
  '/',
  '/offline',
  '/dashboard',
  '/manifest.json',
];

// Installation - mise en cache des ressources essentielles
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activation - nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch - stratégie Network First avec fallback sur cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone la réponse
        const responseToCache = response.clone();

        // Mise en cache de la réponse
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // Si le réseau échoue, utiliser le cache
        return caches.match(event.request).then((response) => {
          return response || caches.match(OFFLINE_URL);
        });
      })
  );
});

// Background Sync pour synchronisation des données
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-sales') {
    event.waitUntil(syncSales());
  }
  if (event.tag === 'sync-stock') {
    event.waitUntil(syncStock());
  }
});

async function syncSales() {
  try {
    const db = await openDB();
    const tx = db.transaction('pending_sales', 'readonly');
    const sales = await tx.objectStore('pending_sales').getAll();

    for (const sale of sales) {
      await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sale),
      });

      // Supprimer de la queue après sync réussie
      const deleteTx = db.transaction('pending_sales', 'readwrite');
      await deleteTx.objectStore('pending_sales').delete(sale.id);
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

async function syncStock() {
  // Synchronisation des mouvements de stock
  try {
    const db = await openDB();
    const tx = db.transaction('pending_stock', 'readonly');
    const movements = await tx.objectStore('pending_stock').getAll();

    for (const movement of movements) {
      await fetch('/api/stock/movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movement),
      });

      const deleteTx = db.transaction('pending_stock', 'readwrite');
      await deleteTx.objectStore('pending_stock').delete(movement.id);
    }
  } catch (error) {
    console.error('Stock sync failed:', error);
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MyProPartnerDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('pending_sales')) {
        db.createObjectStore('pending_sales', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('pending_stock')) {
        db.createObjectStore('pending_stock', { keyPath: 'id' });
      }
    };
  });
}
