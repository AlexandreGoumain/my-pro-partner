/**
 * Service d'intégration Shopify
 * Synchronisation bidirectionnelle des produits, commandes et stocks
 */

export interface ShopifyConfig {
  shopDomain: string;
  apiKey: string;
  apiSecret: string;
  accessToken: string;
}

export class ShopifyService {
  private config: ShopifyConfig;
  private baseUrl: string;

  constructor(config: ShopifyConfig) {
    this.config = config;
    this.baseUrl = `https://${config.shopDomain}/admin/api/2024-01`;
  }

  /**
   * Importer les produits Shopify
   */
  async importProducts() {
    const response = await this.fetch('/products.json');
    const data = await response.json();

    return data.products.map((product: any) => ({
      reference: `SHOP-${product.id}`,
      nom: product.title,
      description: product.body_html,
      prix_ht: parseFloat(product.variants[0].price),
      stock_actuel: product.variants[0].inventory_quantity,
      externalId: product.id,
      source: 'SHOPIFY',
    }));
  }

  /**
   * Importer les commandes Shopify
   */
  async importOrders(since?: Date) {
    const params = since ? `?created_at_min=${since.toISOString()}` : '';
    const response = await this.fetch(`/orders.json${params}`);
    const data = await response.json();

    return data.orders.map((order: any) => ({
      type: 'FACTURE',
      numero: `SHOP-${order.order_number}`,
      dateEmission: new Date(order.created_at),
      total_ttc: parseFloat(order.total_price),
      client: {
        nom: order.customer?.last_name || 'Client Shopify',
        prenom: order.customer?.first_name,
        email: order.customer?.email,
        telephone: order.customer?.phone,
      },
      lignes: order.line_items.map((item: any) => ({
        designation: item.name,
        quantite: item.quantity,
        prix_unitaire_ht: parseFloat(item.price),
      })),
      externalId: order.id,
      source: 'SHOPIFY',
    }));
  }

  /**
   * Synchroniser le stock vers Shopify
   */
  async syncStockToShopify(productId: string, locationId: string, quantity: number) {
    const inventoryItemId = await this.getInventoryItemId(productId);

    return await this.fetch('/inventory_levels/set.json', {
      method: 'POST',
      body: JSON.stringify({
        location_id: locationId,
        inventory_item_id: inventoryItemId,
        available: quantity,
      }),
    });
  }

  /**
   * Créer un webhook pour les mises à jour automatiques
   */
  async createWebhook(topic: string, address: string) {
    return await this.fetch('/webhooks.json', {
      method: 'POST',
      body: JSON.stringify({
        webhook: {
          topic,
          address,
          format: 'json',
        },
      }),
    });
  }

  /**
   * Obtenir l'inventory_item_id depuis le product_id
   */
  private async getInventoryItemId(productId: string) {
    const response = await this.fetch(`/products/${productId}.json`);
    const data = await response.json();
    return data.product.variants[0].inventory_item_id;
  }

  /**
   * Fetch helper avec authentification
   */
  private async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': this.config.accessToken,
        ...options.headers,
      },
    });
  }
}

/**
 * Hooks Shopify pour synchronisation automatique
 */
export const SHOPIFY_WEBHOOKS = {
  PRODUCTS_CREATE: 'products/create',
  PRODUCTS_UPDATE: 'products/update',
  PRODUCTS_DELETE: 'products/delete',
  ORDERS_CREATE: 'orders/create',
  ORDERS_UPDATED: 'orders/updated',
  INVENTORY_LEVELS_UPDATE: 'inventory_levels/update',
};
