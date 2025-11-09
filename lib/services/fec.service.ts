import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

/**
 * Service de génération du Fichier des Écritures Comptables (FEC)
 * Conforme à l'article A47 A-1 du Livre des procédures fiscales
 *
 * Le FEC est obligatoire pour toutes les entreprises tenant leur comptabilité au moyen de systèmes informatisés.
 */

export interface FECLine {
  JournalCode: string;           // Code du journal (VE, AC, BQ, OD, etc.)
  JournalLib: string;             // Libellé du journal
  EcritureNum: string;            // Numéro d'écriture (unique)
  EcritureDate: string;           // Date d'écriture (YYYYMMDD)
  CompteNum: string;              // Numéro de compte (plan comptable)
  CompteLib: string;              // Libellé du compte
  CompAuxNum: string;             // Compte auxiliaire (code client/fournisseur)
  CompAuxLib: string;             // Libellé compte auxiliaire
  PieceRef: string;               // Référence de la pièce (numéro facture)
  PieceDate: string;              // Date de la pièce (YYYYMMDD)
  EcritureLib: string;            // Libellé de l'écriture
  Debit: string;                  // Montant au débit
  Credit: string;                 // Montant au crédit
  EcritureLet: string;            // Lettrage (optionnel)
  DateLet: string;                // Date de lettrage (optionnel)
  ValidDate: string;              // Date de validation (YYYYMMDD)
  Montantdevise: string;          // Montant en devise (optionnel)
  Idevise: string;                // Code devise (optionnel)
}

export class FECService {
  // Plan comptable français (comptes principaux)
  private static readonly COMPTES = {
    CLIENT: "411000",              // Clients
    VENTE_PRESTATIONS: "706000",   // Prestations de services
    VENTE_MARCHANDISES: "707000",  // Ventes de marchandises
    TVA_COLLECTEE: "445710",       // TVA collectée
    BANQUE: "512000",              // Banque
    CAISSE: "531000",              // Caisse
    AVOIR_CLIENT: "709000",        // Avoirs sur ventes
  };

  private static readonly JOURNAUX = {
    VENTE: { code: "VE", lib: "Journal des ventes" },
    BANQUE: { code: "BQ", lib: "Journal de banque" },
    CAISSE: { code: "CA", lib: "Journal de caisse" },
    OD: { code: "OD", lib: "Opérations diverses" },
  };

  /**
   * Génère le fichier FEC pour une période donnée
   */
  static async generateFEC({
    entrepriseId,
    dateDebut,
    dateFin,
  }: {
    entrepriseId: string;
    dateDebut: Date;
    dateFin: Date;
  }): Promise<string> {
    const lines: FECLine[] = [];

    // 1. Récupérer tous les documents de la période
    const documents = await prisma.document.findMany({
      where: {
        entrepriseId,
        dateEmission: {
          gte: dateDebut,
          lte: dateFin,
        },
        type: { in: ["FACTURE", "AVOIR"] },
        statut: { not: "BROUILLON" }, // Exclure les brouillons
      },
      include: {
        client: true,
        lignes: {
          include: {
            article: true,
          },
        },
        paiements: true,
      },
      orderBy: {
        dateEmission: "asc",
      },
    });

    // 2. Générer les écritures pour chaque document
    for (const doc of documents) {
      const isAvoir = doc.type === "AVOIR";
      const journal = this.JOURNAUX.VENTE;
      const ecritureNum = `${journal.code}${doc.numero}`;
      const ecritureDate = this.formatDate(doc.dateEmission);
      const pieceRef = doc.numero;
      const pieceDate = ecritureDate;
      const validDate = ecritureDate;

      // Compte auxiliaire client
      const compAuxNum = `C${doc.client.id.slice(0, 6)}`;
      const compAuxLib = doc.client.nom;

      // 2.1. Écriture CLIENT (débit pour facture, crédit pour avoir)
      lines.push({
        JournalCode: journal.code,
        JournalLib: journal.lib,
        EcritureNum: ecritureNum,
        EcritureDate: ecritureDate,
        CompteNum: this.COMPTES.CLIENT,
        CompteLib: "Clients",
        CompAuxNum: compAuxNum,
        CompAuxLib: compAuxLib,
        PieceRef: pieceRef,
        PieceDate: pieceDate,
        EcritureLib: `${doc.type} ${doc.numero} - ${doc.client.nom}`,
        Debit: isAvoir ? "" : this.formatMontant(doc.total_ttc),
        Credit: isAvoir ? this.formatMontant(doc.total_ttc) : "",
        EcritureLet: "",
        DateLet: "",
        ValidDate: validDate,
        Montantdevise: "",
        Idevise: "",
      });

      // 2.2. Écriture VENTE HT (crédit pour facture, débit pour avoir)
      const compteVente = isAvoir ? this.COMPTES.AVOIR_CLIENT : this.COMPTES.VENTE_PRESTATIONS;
      const compteVenteLib = isAvoir ? "Avoirs sur ventes" : "Ventes de prestations";

      lines.push({
        JournalCode: journal.code,
        JournalLib: journal.lib,
        EcritureNum: ecritureNum,
        EcritureDate: ecritureDate,
        CompteNum: compteVente,
        CompteLib: compteVenteLib,
        CompAuxNum: "",
        CompAuxLib: "",
        PieceRef: pieceRef,
        PieceDate: pieceDate,
        EcritureLib: `${doc.type} ${doc.numero} - ${doc.client.nom}`,
        Debit: isAvoir ? this.formatMontant(doc.total_ht) : "",
        Credit: isAvoir ? "" : this.formatMontant(doc.total_ht),
        EcritureLet: "",
        DateLet: "",
        ValidDate: validDate,
        Montantdevise: "",
        Idevise: "",
      });

      // 2.3. Écriture TVA COLLECTÉE (crédit pour facture, débit pour avoir)
      if (Number(doc.total_tva) > 0) {
        lines.push({
          JournalCode: journal.code,
          JournalLib: journal.lib,
          EcritureNum: ecritureNum,
          EcritureDate: ecritureDate,
          CompteNum: this.COMPTES.TVA_COLLECTEE,
          CompteLib: "TVA collectée",
          CompAuxNum: "",
          CompAuxLib: "",
          PieceRef: pieceRef,
          PieceDate: pieceDate,
          EcritureLib: `TVA ${doc.type} ${doc.numero}`,
          Debit: isAvoir ? this.formatMontant(doc.total_tva) : "",
          Credit: isAvoir ? "" : this.formatMontant(doc.total_tva),
          EcritureLet: "",
          DateLet: "",
          ValidDate: validDate,
          Montantdevise: "",
          Idevise: "",
        });
      }

      // 2.4. Écritures de PAIEMENT
      for (const paiement of doc.paiements) {
        const journalPaiement =
          paiement.moyen_paiement === "ESPECES"
            ? this.JOURNAUX.CAISSE
            : this.JOURNAUX.BANQUE;

        const comptePaiement =
          paiement.moyen_paiement === "ESPECES"
            ? this.COMPTES.CAISSE
            : this.COMPTES.BANQUE;

        const comptePaiementLib =
          paiement.moyen_paiement === "ESPECES" ? "Caisse" : "Banque";

        const ecritureNumPaiement = `${journalPaiement.code}${doc.numero}-${paiement.id.slice(0, 4)}`;
        const paiementDate = this.formatDate(paiement.date_paiement);

        // Débit BANQUE/CAISSE
        lines.push({
          JournalCode: journalPaiement.code,
          JournalLib: journalPaiement.lib,
          EcritureNum: ecritureNumPaiement,
          EcritureDate: paiementDate,
          CompteNum: comptePaiement,
          CompteLib: comptePaiementLib,
          CompAuxNum: "",
          CompAuxLib: "",
          PieceRef: pieceRef,
          PieceDate: paiementDate,
          EcritureLib: `Paiement ${doc.numero} - ${paiement.moyen_paiement}`,
          Debit: this.formatMontant(paiement.montant),
          Credit: "",
          EcritureLet: "",
          DateLet: "",
          ValidDate: paiementDate,
          Montantdevise: "",
          Idevise: "",
        });

        // Crédit CLIENT
        lines.push({
          JournalCode: journalPaiement.code,
          JournalLib: journalPaiement.lib,
          EcritureNum: ecritureNumPaiement,
          EcritureDate: paiementDate,
          CompteNum: this.COMPTES.CLIENT,
          CompteLib: "Clients",
          CompAuxNum: compAuxNum,
          CompAuxLib: compAuxLib,
          PieceRef: pieceRef,
          PieceDate: paiementDate,
          EcritureLib: `Paiement ${doc.numero} - ${paiement.moyen_paiement}`,
          Debit: "",
          Credit: this.formatMontant(paiement.montant),
          EcritureLet: "",
          DateLet: "",
          ValidDate: paiementDate,
          Montantdevise: "",
          Idevise: "",
        });
      }
    }

    // 3. Générer le contenu du fichier FEC
    return this.generateFECContent(lines);
  }

  /**
   * Génère le contenu du fichier FEC au format texte
   */
  private static generateFECContent(lines: FECLine[]): string {
    // En-tête
    const header = [
      "JournalCode",
      "JournalLib",
      "EcritureNum",
      "EcritureDate",
      "CompteNum",
      "CompteLib",
      "CompAuxNum",
      "CompAuxLib",
      "PieceRef",
      "PieceDate",
      "EcritureLib",
      "Debit",
      "Credit",
      "EcritureLet",
      "DateLet",
      "ValidDate",
      "Montantdevise",
      "Idevise",
    ].join("|");

    // Lignes de données
    const dataLines = lines.map((line) =>
      [
        line.JournalCode,
        line.JournalLib,
        line.EcritureNum,
        line.EcritureDate,
        line.CompteNum,
        line.CompteLib,
        line.CompAuxNum,
        line.CompAuxLib,
        line.PieceRef,
        line.PieceDate,
        line.EcritureLib,
        line.Debit,
        line.Credit,
        line.EcritureLet,
        line.DateLet,
        line.ValidDate,
        line.Montantdevise,
        line.Idevise,
      ].join("|")
    );

    return [header, ...dataLines].join("\n");
  }

  /**
   * Valide le fichier FEC généré
   */
  static validateFEC(fecContent: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const lines = fecContent.split("\n");

    if (lines.length < 2) {
      errors.push("Le fichier FEC doit contenir au moins une ligne de données");
      return { valid: false, errors };
    }

    // Vérifier l'en-tête
    const header = lines[0].split("|");
    const expectedHeader = [
      "JournalCode",
      "JournalLib",
      "EcritureNum",
      "EcritureDate",
      "CompteNum",
      "CompteLib",
      "CompAuxNum",
      "CompAuxLib",
      "PieceRef",
      "PieceDate",
      "EcritureLib",
      "Debit",
      "Credit",
      "EcritureLet",
      "DateLet",
      "ValidDate",
      "Montantdevise",
      "Idevise",
    ];

    if (header.length !== expectedHeader.length) {
      errors.push(`En-tête invalide : ${header.length} colonnes au lieu de ${expectedHeader.length}`);
    }

    // Vérifier quelques lignes de données
    for (let i = 1; i < Math.min(lines.length, 10); i++) {
      const fields = lines[i].split("|");
      if (fields.length !== expectedHeader.length) {
        errors.push(`Ligne ${i + 1} : ${fields.length} colonnes au lieu de ${expectedHeader.length}`);
      }

      // Vérifier que les dates sont au bon format (YYYYMMDD)
      const dateRegex = /^\d{8}$/;
      if (fields[3] && !dateRegex.test(fields[3])) {
        errors.push(`Ligne ${i + 1} : Date d'écriture invalide (${fields[3]})`);
      }
    }

    // Vérifier l'équilibre comptable (débit = crédit)
    let totalDebit = 0;
    let totalCredit = 0;

    for (let i = 1; i < lines.length; i++) {
      const fields = lines[i].split("|");
      if (fields[11]) totalDebit += parseFloat(fields[11].replace(",", "."));
      if (fields[12]) totalCredit += parseFloat(fields[12].replace(",", "."));
    }

    const diff = Math.abs(totalDebit - totalCredit);
    if (diff > 0.01) {
      errors.push(
        `Balance non équilibrée : Débit=${totalDebit.toFixed(2)}, Crédit=${totalCredit.toFixed(2)}, Diff=${diff.toFixed(2)}`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Formate une date au format FEC (YYYYMMDD)
   */
  private static formatDate(date: Date): string {
    return format(date, "yyyyMMdd");
  }

  /**
   * Formate un montant au format FEC (avec virgule, 2 décimales)
   */
  private static formatMontant(montant: any): string {
    const num = Number(montant);
    if (num === 0) return "";
    return num.toFixed(2).replace(".", ",");
  }

  /**
   * Génère le nom du fichier FEC selon la nomenclature légale
   * Format : SiretFECAAAAMMJJ (AAAA = année de clôture, MM = mois, JJ = jour)
   */
  static generateFileName(siret: string, dateFin: Date): string {
    const dateStr = format(dateFin, "yyyyMMdd");
    const siretClean = siret.replace(/\s/g, "");
    return `${siretClean}FEC${dateStr}.txt`;
  }

  /**
   * Statistiques sur le FEC généré
   */
  static async getFECStats({
    entrepriseId,
    dateDebut,
    dateFin,
  }: {
    entrepriseId: string;
    dateDebut: Date;
    dateFin: Date;
  }) {
    const documents = await prisma.document.findMany({
      where: {
        entrepriseId,
        dateEmission: {
          gte: dateDebut,
          lte: dateFin,
        },
        type: { in: ["FACTURE", "AVOIR"] },
        statut: { not: "BROUILLON" },
      },
      include: {
        paiements: true,
      },
    });

    const totalFactures = documents.filter((d) => d.type === "FACTURE").length;
    const totalAvoirs = documents.filter((d) => d.type === "AVOIR").length;
    const totalPaiements = documents.reduce((sum, d) => sum + d.paiements.length, 0);

    // Nombre d'écritures = chaque doc génère 3 écritures (client, vente HT, TVA)
    // + 2 écritures par paiement (banque/caisse + client)
    const nbEcritures = documents.length * 3 + totalPaiements * 2;

    const totalVentesHT = documents
      .filter((d) => d.type === "FACTURE")
      .reduce((sum, d) => sum + Number(d.total_ht), 0);

    const totalTVA = documents
      .filter((d) => d.type === "FACTURE")
      .reduce((sum, d) => sum + Number(d.total_tva), 0);

    return {
      periode: {
        debut: format(dateDebut, "dd/MM/yyyy"),
        fin: format(dateFin, "dd/MM/yyyy"),
      },
      documents: {
        factures: totalFactures,
        avoirs: totalAvoirs,
        total: documents.length,
      },
      paiements: totalPaiements,
      ecritures: nbEcritures,
      montants: {
        ventesHT: totalVentesHT.toFixed(2),
        tva: totalTVA.toFixed(2),
        ventesTTC: (totalVentesHT + totalTVA).toFixed(2),
      },
    };
  }
}
