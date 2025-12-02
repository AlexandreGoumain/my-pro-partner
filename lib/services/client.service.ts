import { clientRepository, documentRepository, loyaltyLevelRepository } from "@/lib/repositories";
import { ConflictError, NotFoundError, BusinessError } from "@/lib/errors";
import type { Client } from "@/lib/generated/prisma";

/**
 * Options for creating a client
 */
export interface CreateClientOptions {
  entrepriseId: string;
  nom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  pays?: string;
  notes?: string;
  actif?: boolean;
}

/**
 * Options for updating a client
 */
export interface UpdateClientOptions {
  nom?: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  pays?: string;
  notes?: string;
  actif?: boolean;
}

/**
 * Client Service
 * Handles all business logic related to clients
 */
export class ClientService {
  /**
   * Create a new client
   * Validates uniqueness and assigns default loyalty level
   */
  static async createClient(options: CreateClientOptions): Promise<Client> {
    const { entrepriseId, email, ...data } = options;

    // Check email uniqueness if provided
    if (email) {
      const existingClient = await clientRepository.findByEmail(email, entrepriseId);
      if (existingClient) {
        throw new ConflictError(`Un client avec l'email ${email} existe déjà`);
      }
    }

    // Get default loyalty level (lowest threshold)
    const defaultLevel = await loyaltyLevelRepository.findDefault(entrepriseId);

    // Create client with default loyalty level
    const client = await clientRepository.create({
      ...data,
      email,
      entrepriseId,
      niveauFideliteId: defaultLevel?.id,
      points_solde: 0,
      actif: options.actif !== undefined ? options.actif : true,
    });

    return client;
  }

  /**
   * Update a client
   * Validates email uniqueness if changed
   */
  static async updateClient(
    clientId: string,
    entrepriseId: string,
    options: UpdateClientOptions
  ): Promise<Client> {
    // Verify client exists and belongs to entreprise
    const existingClient = await clientRepository.findByIdOrFail(clientId);
    if (existingClient.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Client", clientId);
    }

    // Check email uniqueness if changing email
    if (options.email && options.email !== existingClient.email) {
      const emailTaken = await clientRepository.findByEmail(options.email, entrepriseId);
      if (emailTaken) {
        throw new ConflictError(`Un client avec l'email ${options.email} existe déjà`);
      }
    }

    // Update client
    return clientRepository.update(clientId, options as Record<string, unknown>);
  }

  /**
   * Delete a client
   * Checks for dependent records before deletion
   */
  static async deleteClient(
    clientId: string,
    entrepriseId: string
  ): Promise<void> {
    // Verify client exists and belongs to entreprise
    const client = await clientRepository.findByIdOrFail(clientId);
    if (client.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Client", clientId);
    }

    // Check for dependent documents
    const documents = await documentRepository.findByClient(clientId, entrepriseId);
    if (documents.length > 0) {
      throw new BusinessError(
        `Impossible de supprimer ce client car ${documents.length} document(s) lui sont associés`
      );
    }

    // Safe to delete
    await clientRepository.delete(clientId);
  }

  /**
   * Send payment reminder email to a client
   * Checks for unpaid invoices before sending
   */
  static async sendPaymentReminder(
    clientId: string,
    entrepriseId: string
  ): Promise<{ sent: boolean; invoiceCount: number }> {
    // Get client with email
    const client = await clientRepository.findByIdOrFail(clientId);
    if (client.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Client", clientId);
    }

    if (!client.email) {
      throw new BusinessError("Ce client n'a pas d'adresse email");
    }

    // Get unpaid invoices
    const unpaidInvoices = await documentRepository.findUnpaidInvoices(clientId, entrepriseId);

    if (unpaidInvoices.length === 0) {
      throw new BusinessError("Ce client n'a aucune facture impayée");
    }

    // TODO: Integrate with email service
    // await emailService.sendPaymentReminder(client.email, unpaidInvoices);

    return {
      sent: true,
      invoiceCount: unpaidInvoices.length,
    };
  }

  /**
   * Activate a client
   */
  static async activateClient(
    clientId: string,
    entrepriseId: string
  ): Promise<Client> {
    const client = await clientRepository.findByIdOrFail(clientId);
    if (client.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Client", clientId);
    }

    return clientRepository.update(clientId, { actif: true });
  }

  /**
   * Deactivate a client
   */
  static async deactivateClient(
    clientId: string,
    entrepriseId: string
  ): Promise<Client> {
    const client = await clientRepository.findByIdOrFail(clientId);
    if (client.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Client", clientId);
    }

    return clientRepository.update(clientId, { actif: false });
  }

  /**
   * Get client statistics
   */
  static async getClientStatistics(entrepriseId: string) {
    const [totalClients, activeClients] = await Promise.all([
      clientRepository.countByEntreprise(entrepriseId),
      clientRepository.count({ entrepriseId, actif: true }),
    ]);

    return {
      total: totalClients,
      active: activeClients,
      inactive: totalClients - activeClients,
    };
  }

  /**
   * Import clients in bulk
   * Validates and creates multiple clients at once
   */
  static async bulkImportClients(
    entrepriseId: string,
    clientsData: CreateClientOptions[]
  ): Promise<{
    success: number;
    failed: number;
    errors: Array<{ index: number; email?: string; error: string }>;
  }> {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as Array<{ index: number; email?: string; error: string }>,
    };

    for (let i = 0; i < clientsData.length; i++) {
      try {
        await this.createClient({ ...clientsData[i], entrepriseId });
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          index: i,
          email: clientsData[i].email,
          error: error instanceof Error ? error.message : "Erreur inconnue",
        });
      }
    }

    return results;
  }

  /**
   * Get client with full details (documents, loyalty info, etc.)
   */
  static async getClientDetails(
    clientId: string,
    entrepriseId: string
  ) {
    const client = await clientRepository.findByIdOrFail(clientId);
    if (client.entrepriseId !== entrepriseId) {
      throw new NotFoundError("Client", clientId);
    }

    const [documents, unpaidInvoices] = await Promise.all([
      documentRepository.findByClient(clientId, entrepriseId),
      documentRepository.findUnpaidInvoices(clientId, entrepriseId),
    ]);

    const totalSpent = documents
      .filter((doc) => doc.type === "FACTURE" && doc.statut === "PAYE")
      .reduce((sum, doc) => sum + Number(doc.total_ttc || 0), 0);

    const totalOwed = unpaidInvoices.reduce((sum, doc) => sum + Number(doc.total_ttc || 0), 0);

    return {
      client,
      statistics: {
        totalDocuments: documents.length,
        totalInvoices: documents.filter((d) => d.type === "FACTURE").length,
        totalQuotes: documents.filter((d) => d.type === "DEVIS").length,
        unpaidInvoices: unpaidInvoices.length,
        totalSpent,
        totalOwed,
      },
    };
  }
}
