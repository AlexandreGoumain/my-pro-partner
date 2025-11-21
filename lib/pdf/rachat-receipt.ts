import type { RachatArticle } from "@/hooks/use-rachats";

interface CompanyInfo {
  nom_entreprise: string | null;
  siret: string | null;
  adresse: string | null;
  code_postal: string | null;
  ville: string | null;
  telephone: string | null;
  email: string | null;
  logo_url: string | null;
}

/**
 * Generate a buyback receipt PDF
 * Returns HTML that can be converted to PDF
 */
export function generateRachatReceiptHTML(
  rachat: RachatArticle,
  companyInfo: CompanyInfo
): string {
  const dateRachat = new Date(rachat.dateRachat).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const etatLabels: Record<string, string> = {
    COMME_NEUF: "Comme neuf",
    TRES_BON: "Très bon état",
    BON: "Bon état",
    CORRECT: "État correct",
    POUR_PIECES: "Pour pièces détachées",
  };

  const provenanceLabels: Record<string, string> = {
    RACHAT_CLIENT: "Rachat client",
    MARKETPLACE_OCCASION: "Marketplace (occasion)",
    REPRISE: "Reprise",
    DON: "Don",
    RETOUR_SAV: "Retour SAV",
    AUTRE: "Autre",
  };

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reçu de rachat - ${rachat.article.reference}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 12px;
      line-height: 1.6;
      color: #1a1a1a;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e5e5e5;
    }

    .company-info {
      flex: 1;
    }

    .company-name {
      font-size: 20px;
      font-weight: 700;
      color: #000;
      margin-bottom: 8px;
    }

    .company-details {
      color: #666;
      font-size: 11px;
      line-height: 1.5;
    }

    .document-title {
      text-align: right;
      flex: 1;
    }

    .document-title h1 {
      font-size: 28px;
      font-weight: 700;
      color: #000;
      margin-bottom: 4px;
    }

    .document-ref {
      color: #666;
      font-size: 11px;
    }

    .main-info {
      display: flex;
      gap: 30px;
      margin-bottom: 30px;
    }

    .info-box {
      flex: 1;
      background: #f9f9f9;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      padding: 15px;
    }

    .info-box h3 {
      font-size: 11px;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
    }

    .info-box p {
      margin: 4px 0;
      color: #1a1a1a;
    }

    .article-details {
      background: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .article-details h2 {
      font-size: 16px;
      font-weight: 600;
      color: #000;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e5e5e5;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px 30px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
    }

    .detail-label {
      font-size: 10px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .detail-value {
      font-size: 13px;
      color: #1a1a1a;
      font-weight: 500;
    }

    .price-section {
      background: #000;
      color: #fff;
      border-radius: 4px;
      padding: 20px;
      text-align: center;
      margin: 30px 0;
    }

    .price-label {
      font-size: 12px;
      font-weight: 500;
      opacity: 0.8;
      margin-bottom: 8px;
    }

    .price-amount {
      font-size: 36px;
      font-weight: 700;
      letter-spacing: -1px;
    }

    .notes {
      background: #fffbeb;
      border: 1px solid #fbbf24;
      border-radius: 4px;
      padding: 15px;
      margin: 20px 0;
    }

    .notes-title {
      font-size: 11px;
      font-weight: 600;
      color: #92400e;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .notes-content {
      color: #78350f;
      line-height: 1.6;
    }

    .conditions {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
    }

    .conditions h3 {
      font-size: 12px;
      font-weight: 600;
      color: #000;
      margin-bottom: 10px;
    }

    .conditions-list {
      list-style: none;
      padding: 0;
    }

    .conditions-list li {
      padding-left: 15px;
      position: relative;
      margin-bottom: 6px;
      color: #666;
      font-size: 10px;
      line-height: 1.5;
    }

    .conditions-list li:before {
      content: "•";
      position: absolute;
      left: 0;
      color: #1a1a1a;
      font-weight: bold;
    }

    .footer {
      margin-top: 50px;
      text-align: center;
      color: #999;
      font-size: 10px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
    }

    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-success {
      background: #d1fae5;
      color: #065f46;
    }

    .badge-warning {
      background: #fef3c7;
      color: #92400e;
    }

    .badge-danger {
      background: #fee2e2;
      color: #991b1b;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-info">
      <div class="company-name">${companyInfo.nom_entreprise || "Entreprise"}</div>
      <div class="company-details">
        ${companyInfo.siret ? `SIRET : ${companyInfo.siret}<br>` : ""}
        ${companyInfo.adresse ? `${companyInfo.adresse}<br>` : ""}
        ${companyInfo.code_postal && companyInfo.ville ? `${companyInfo.code_postal} ${companyInfo.ville}<br>` : ""}
        ${companyInfo.telephone ? `Tél : ${companyInfo.telephone}<br>` : ""}
        ${companyInfo.email ? `Email : ${companyInfo.email}` : ""}
      </div>
    </div>
    <div class="document-title">
      <h1>Reçu de rachat</h1>
      <div class="document-ref">Ref. ${rachat.article.reference}</div>
      <div class="document-ref">Date : ${dateRachat}</div>
    </div>
  </div>

  <div class="main-info">
    ${
      rachat.client
        ? `
    <div class="info-box">
      <h3>Client</h3>
      <p style="font-weight: 600; font-size: 14px;">${rachat.client.nom}</p>
      ${rachat.client.telephone ? `<p>Tél : ${rachat.client.telephone}</p>` : ""}
      ${rachat.client.email ? `<p>Email : ${rachat.client.email}</p>` : ""}
    </div>
    `
        : ""
    }
    <div class="info-box">
      <h3>Informations du rachat</h3>
      <p><strong>Provenance :</strong> ${provenanceLabels[rachat.provenance]}</p>
      <p><strong>Date :</strong> ${dateRachat}</p>
      ${rachat.dureeGarantie ? `<p><strong>Garantie :</strong> ${rachat.dureeGarantie} mois</p>` : ""}
    </div>
  </div>

  <div class="article-details">
    <h2>Détails de l'article</h2>
    <div class="detail-grid">
      <div class="detail-item">
        <div class="detail-label">Article</div>
        <div class="detail-value">${rachat.article.nom}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Référence</div>
        <div class="detail-value">${rachat.article.reference}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">État</div>
        <div class="detail-value">${etatLabels[rachat.etat]}</div>
      </div>
      ${
        rachat.numeroSerie
          ? `
      <div class="detail-item">
        <div class="detail-label">N° de série / IMEI</div>
        <div class="detail-value" style="font-family: monospace;">${rachat.numeroSerie}</div>
      </div>
      `
          : ""
      }
      ${
        rachat.article.categorie
          ? `
      <div class="detail-item">
        <div class="detail-label">Catégorie</div>
        <div class="detail-value">${rachat.article.categorie.nom}</div>
      </div>
      `
          : ""
      }
      ${
        rachat.article.description
          ? `
      <div class="detail-item" style="grid-column: 1 / -1;">
        <div class="detail-label">Description</div>
        <div class="detail-value">${rachat.article.description}</div>
      </div>
      `
          : ""
      }
    </div>
  </div>

  ${
    rachat.notes
      ? `
  <div class="notes">
    <div class="notes-title">Notes</div>
    <div class="notes-content">${rachat.notes.replace(/\n/g, "<br>")}</div>
  </div>
  `
      : ""
  }

  <div class="price-section">
    <div class="price-label">Montant du rachat</div>
    <div class="price-amount">${Number(rachat.prixRachat).toFixed(2)} €</div>
  </div>

  <div class="conditions">
    <h3>Conditions générales</h3>
    <ul class="conditions-list">
      <li>L'article a été évalué selon son état physique et fonctionnel au moment du rachat.</li>
      <li>Le vendeur certifie être le propriétaire légitime de l'article et qu'il est libre de tout gage ou charge.</li>
      <li>Le vendeur garantit que l'article n'est pas volé, contrefait ou obtenu frauduleusement.</li>
      ${rachat.dureeGarantie ? `<li>Une garantie de ${rachat.dureeGarantie} mois est offerte sur cet article d'occasion.</li>` : ""}
      <li>Ce reçu fait foi en cas de litige et doit être conservé précieusement.</li>
    </ul>
  </div>

  <div class="footer">
    Document généré le ${new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
    <br>
    ${companyInfo.nom_entreprise || "Entreprise"} - Tous droits réservés
  </div>
</body>
</html>
  `.trim();
}
