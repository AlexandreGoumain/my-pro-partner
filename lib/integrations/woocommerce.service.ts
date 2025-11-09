/**
 * Service d'intégration WooCommerce
 * Synchronisation bidirectionnelle via REST API
 */

export interface WooCommerceConfig {
  storeUrl: string;
  consumerKey: string;
  consumerSecret: string;
}

export class WooCommerceService {
  private config: WooCommerceConfig;
  private baseUrl: string;

  constructor(config: WooCommerceConfig) {
    this.config = config;
    this.baseUrl = `${config.storeUrl}/wp-json/wc/v3`;
  }

  /**
   * Importer les produits WooCommerce
   */
  async importProducts(page: number = 1, perPage: number = 100) {
    const response = await this.fetch(`/products?page=${page}&per_page=${perPage}`);
    const products = await response.json();

    return products.map((product: any) => ({
      reference: `WOO-${product.id}`,
      nom: product.name,
      description: product.description,
      prix_ht: parseFloat(product.regular_price || product.price),
      stock_actuel: product.stock_quantity || 0,
      gestion_stock: product.manage_stock,
      externalId: product.id,
      source: 'WOOCOMMERCE',
    }));
  }

  /**
   * Importer les commandes WooCommerce
   */
  async importOrders(status: string = 'any', page: number = 1) {
    const response = await this.fetch(`/orders?status=${status}&page=${page}&per_page=100`);
    const orders = await response.json();

    return orders.map((order: any) => ({
      type: 'FACTURE',
      numero: `WOO-${order.number}`,
      dateEmission: new Date(order.date_created),
      total_ttc: parseFloat(order.total),
      statut: this.mapStatus(order.status),
      client: {
        nom: order.billing.last_name,
        prenom: order.billing.first_name,
        email: order.billing.email,
        telephone: order.billing.phone,
        adresse: order.billing.address_1,
        codePostal: order.billing.postcode,
        ville: order.billing.city,
      },
      lignes: order.line_items.map((item: any) => ({
        designation: item.name,
        quantite: item.quantity,
        prix_unitaire_ht: parseFloat(item.price),
      })),
      externalId: order.id,
      source: 'WOOCOMMERCE',
    }));
  }

  /**
   * Mettre à jour le stock sur WooCommerce
   */
  async updateStock(productId: string, quantity: number) {
    return await this.fetch(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({
        stock_quantity: quantity,
      }),
    });
  }

  /**
   * Mettre à jour le statut d'une commande
   */
  async updateOrderStatus(orderId: string, status: string) {
    return await this.fetch(`/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({
        status: this.mapStatusToWoo(status),
      }),
    });
  }

  /**
   * Créer un webhook WooCommerce
   */
  async createWebhook(topic: string, deliveryUrl: string) {
    return await this.fetch('/webhooks', {
      method: 'POST',
      body: JSON.stringify({
        name: `MyProPartner - ${topic}`,
        topic,
        delivery_url: deliveryUrl,
        secret: process.env.WEBHOOK_SECRET,
      }),
    });
  }

  /**
   * Mapper le statut WooCommerce vers notre système
   */
  private mapStatus(wooStatus: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'BROUILLON',
      'processing': 'ENVOYE',
      'on-hold': 'ENVOYE',
      'completed': 'PAYE',
      'cancelled': 'ANNULE',
      'refunded': 'ANNULE',
      'failed': 'ANNULE',
    };

    return statusMap[wooStatus] || 'BROUILLON';
  }

  /**
   * Mapper notre statut vers WooCommerce
   */
  private mapStatusToWoo(status: string): string {
    const statusMap: Record<string, string> = {
      'BROUILLON': 'pending',
      'ENVOYE': 'processing',
      'PAYE': 'completed',
      'ANNULE': 'cancelled',
    };

    return statusMap[status] || 'pending';
  }

  /**
   * Fetch helper avec authentification
   */
  private async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const auth = Buffer.from(`${this.config.consumerKey}:${this.config.consumerSecret}`).toString('base64');

    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
        ...options.headers,
      },
    });
  }
}

/**
 * Topics webhook WooCommerce
 */
export const WOOCOMMERCE_WEBHOOKS = {
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  PRODUCT_DELETED: 'product.deleted',
  ORDER_CREATED: 'order.created',
  ORDER_UPDATED: 'order.updated',
  ORDER_DELETED: 'order.deleted',
};
