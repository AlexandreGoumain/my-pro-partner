/**
 * Gestionnaire de synchronisation offline
 * Gère la queue de synchronisation et les retry
 */

export class SyncManager {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'MyProPartnerDB';
  private readonly DB_VERSION = 1;

  async init() {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;

        // Store pour les ventes en attente
        if (!db.objectStoreNames.contains('pending_sales')) {
          const salesStore = db.createObjectStore('pending_sales', { keyPath: 'id', autoIncrement: true });
          salesStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store pour les mouvements de stock
        if (!db.objectStoreNames.contains('pending_stock')) {
          const stockStore = db.createObjectStore('pending_stock', { keyPath: 'id', autoIncrement: true });
          stockStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store pour le cache des produits
        if (!db.objectStoreNames.contains('products_cache')) {
          db.createObjectStore('products_cache', { keyPath: 'id' });
        }

        // Store pour le cache des clients
        if (!db.objectStoreNames.contains('clients_cache')) {
          db.createObjectStore('clients_cache', { keyPath: 'id' });
        }
      };
    });
  }

  /**
   * Ajouter une vente à la queue de synchronisation
   */
  async queueSale(saleData: any) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('pending_sales', 'readwrite');
      const store = tx.objectStore('pending_sales');

      const request = store.add({
        ...saleData,
        timestamp: Date.now(),
        retryCount: 0,
      });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Ajouter un mouvement de stock à la queue
   */
  async queueStockMovement(movementData: any) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction('pending_stock', 'readwrite');
      const store = tx.objectStore('pending_stock');

      const request = store.add({
        ...movementData,
        timestamp: Date.now(),
        retryCount: 0,
      });

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Synchroniser toutes les données en attente
   */
  async syncAll() {
    await this.syncSales();
    await this.syncStock();
  }

  /**
   * Synchroniser les ventes
   */
  async syncSales() {
    if (!this.db) await this.init();

    const tx = this.db!.transaction('pending_sales', 'readonly');
    const store = tx.objectStore('pending_sales');
    const sales = await this.getAllFromStore(store);

    for (const sale of sales) {
      try {
        const response = await fetch('/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sale),
        });

        if (response.ok) {
          await this.removeSale(sale.id);
        } else {
          await this.incrementRetry('pending_sales', sale.id);
        }
      } catch (error) {
        console.error('Failed to sync sale:', error);
        await this.incrementRetry('pending_sales', sale.id);
      }
    }
  }

  /**
   * Synchroniser les mouvements de stock
   */
  async syncStock() {
    if (!this.db) await this.init();

    const tx = this.db!.transaction('pending_stock', 'readonly');
    const store = tx.objectStore('pending_stock');
    const movements = await this.getAllFromStore(store);

    for (const movement of movements) {
      try {
        const response = await fetch('/api/stock/movements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(movement),
        });

        if (response.ok) {
          await this.removeStockMovement(movement.id);
        } else {
          await this.incrementRetry('pending_stock', movement.id);
        }
      } catch (error) {
        console.error('Failed to sync stock:', error);
        await this.incrementRetry('pending_stock', movement.id);
      }
    }
  }

  /**
   * Obtenir le nombre d'éléments en attente de sync
   */
  async getPendingCount() {
    if (!this.db) await this.init();

    const salesTx = this.db!.transaction('pending_sales', 'readonly');
    const salesCount = await this.countStore(salesTx.objectStore('pending_sales'));

    const stockTx = this.db!.transaction('pending_stock', 'readonly');
    const stockCount = await this.countStore(stockTx.objectStore('pending_stock'));

    return {
      sales: salesCount,
      stock: stockCount,
      total: salesCount + stockCount,
    };
  }

  // Helper methods
  private getAllFromStore(store: IDBObjectStore): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private countStore(store: IDBObjectStore): Promise<number> {
    return new Promise((resolve, reject) => {
      const request = store.count();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async removeSale(id: number) {
    const tx = this.db!.transaction('pending_sales', 'readwrite');
    const store = tx.objectStore('pending_sales');
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve(undefined);
      request.onerror = () => reject(request.error);
    });
  }

  private async removeStockMovement(id: number) {
    const tx = this.db!.transaction('pending_stock', 'readwrite');
    const store = tx.objectStore('pending_stock');
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve(undefined);
      request.onerror = () => reject(request.error);
    });
  }

  private async incrementRetry(storeName: string, id: number) {
    const tx = this.db!.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);

    return new Promise((resolve, reject) => {
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (item) {
          item.retryCount = (item.retryCount || 0) + 1;
          item.lastRetry = Date.now();

          const putRequest = store.put(item);
          putRequest.onsuccess = () => resolve(undefined);
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          resolve(undefined);
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * Mettre en cache les produits pour usage offline
   */
  async cacheProducts(products: any[]) {
    if (!this.db) await this.init();

    const tx = this.db!.transaction('products_cache', 'readwrite');
    const store = tx.objectStore('products_cache');

    for (const product of products) {
      await new Promise((resolve, reject) => {
        const request = store.put(product);
        request.onsuccess = () => resolve(undefined);
        request.onerror = () => reject(request.error);
      });
    }
  }

  /**
   * Obtenir les produits depuis le cache
   */
  async getCachedProducts() {
    if (!this.db) await this.init();

    const tx = this.db!.transaction('products_cache', 'readonly');
    const store = tx.objectStore('products_cache');

    return this.getAllFromStore(store);
  }
}

export const syncManager = new SyncManager();
