/**
 * Apple-style Email Templates for Repair Notifications
 * Clean, minimal design with clear information hierarchy
 */

interface RepairDepositedData {
  clientName: string;
  repairNumber: string;
  deviceType: string;
  deviceBrand: string;
  deviceModel: string;
  problemDescription: string;
  estimatedReturnDate?: string;
  storeName: string;
  storeAddress: string;
  storePhone: string;
}

interface DiagnosticCompleteData {
  clientName: string;
  repairNumber: string;
  deviceType: string;
  diagnosticDetail: string;
  estimatedCost?: number;
  repairDelay?: number;
  storeName: string;
  storePhone: string;
  quoteAcceptUrl?: string;
}

interface ReadyForPickupData {
  clientName: string;
  repairNumber: string;
  deviceType: string;
  totalCost: number;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeHours: string;
}

interface DelayedRepairData {
  clientName: string;
  repairNumber: string;
  deviceType: string;
  reason: string;
  newEstimatedDate: string;
  storeName: string;
  storePhone: string;
}

interface DeliveredRepairData {
  clientName: string;
  repairNumber: string;
  deviceType: string;
  warrantyDays: number;
  storeName: string;
  storePhone: string;
  feedbackUrl?: string;
}

const baseStyles = `
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    background-color: #ffffff;
    color: #1d1d1f;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 40px 20px;
  }
  .header {
    text-align: center;
    padding-bottom: 32px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }
  .logo {
    font-size: 24px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: #1d1d1f;
  }
  .content {
    padding: 32px 0;
  }
  h1 {
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: #1d1d1f;
    margin: 0 0 16px 0;
  }
  p {
    font-size: 15px;
    line-height: 1.6;
    color: rgba(0, 0, 0, 0.6);
    margin: 0 0 16px 0;
  }
  .info-box {
    background-color: rgba(0, 0, 0, 0.02);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    padding: 20px;
    margin: 24px 0;
  }
  .info-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
  .info-row:last-child {
    border-bottom: none;
  }
  .info-label {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.4);
  }
  .info-value {
    font-size: 14px;
    font-weight: 500;
    color: #1d1d1f;
    text-align: right;
  }
  .button {
    display: inline-block;
    background-color: #1d1d1f;
    color: #ffffff;
    text-decoration: none;
    padding: 14px 28px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    margin: 16px 0;
    transition: background-color 200ms;
  }
  .button:hover {
    background-color: rgba(0, 0, 0, 0.9);
  }
  .footer {
    padding-top: 32px;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    text-align: center;
  }
  .footer p {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.4);
  }
  .status-badge {
    display: inline-block;
    padding: 6px 12px;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    margin: 8px 0;
  }
  .highlight {
    color: #1d1d1f;
    font-weight: 500;
  }
`;

export function getRepairDepositedTemplate(data: RepairDepositedData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">${data.storeName}</div>
    </div>

    <div class="content">
      <h1>Votre appareil est bien enregistré</h1>
      <p>Bonjour ${data.clientName},</p>
      <p>Nous avons bien réceptionné votre <span class="highlight">${data.deviceBrand} ${data.deviceModel}</span> et allons procéder au diagnostic dans les plus brefs délais.</p>

      <div class="info-box">
        <div class="info-row">
          <span class="info-label">Numéro de réparation</span>
          <span class="info-value">${data.repairNumber}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Type d'appareil</span>
          <span class="info-value">${data.deviceType}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Problème signalé</span>
          <span class="info-value">${data.problemDescription}</span>
        </div>
        ${data.estimatedReturnDate ? `
        <div class="info-row">
          <span class="info-label">Date estimée de retour</span>
          <span class="info-value">${data.estimatedReturnDate}</span>
        </div>
        ` : ''}
      </div>

      <p>Vous serez informé par email dès que le diagnostic sera terminé et qu'un devis vous sera proposé.</p>

      <p><span class="highlight">Conservez votre numéro de réparation ${data.repairNumber}</span> pour toute question concernant votre appareil.</p>
    </div>

    <div class="footer">
      <p>${data.storeName}<br>${data.storeAddress}<br>${data.storePhone}</p>
      <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function getDiagnosticCompleteTemplate(data: DiagnosticCompleteData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">${data.storeName}</div>
    </div>

    <div class="content">
      <h1>Diagnostic terminé</h1>
      <div class="status-badge">Devis disponible</div>

      <p>Bonjour ${data.clientName},</p>
      <p>Le diagnostic de votre <span class="highlight">${data.deviceType}</span> est terminé.</p>

      <div class="info-box">
        <div class="info-row">
          <span class="info-label">Numéro de réparation</span>
          <span class="info-value">${data.repairNumber}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Diagnostic</span>
          <span class="info-value">${data.diagnosticDetail}</span>
        </div>
        ${data.estimatedCost ? `
        <div class="info-row">
          <span class="info-label">Coût estimé</span>
          <span class="info-value">${data.estimatedCost.toFixed(2)} €</span>
        </div>
        ` : ''}
        ${data.repairDelay ? `
        <div class="info-row">
          <span class="info-label">Délai de réparation</span>
          <span class="info-value">${data.repairDelay} jours</span>
        </div>
        ` : ''}
      </div>

      ${data.quoteAcceptUrl ? `
      <div style="text-align: center;">
        <a href="${data.quoteAcceptUrl}" class="button">Accepter le devis</a>
      </div>
      ` : ''}

      <p>Pour toute question ou pour valider le devis, contactez-nous au <span class="highlight">${data.storePhone}</span>.</p>

      <p style="font-size: 13px; color: rgba(0, 0, 0, 0.4);">Si vous refusez le devis, des frais de diagnostic peuvent s'appliquer selon nos conditions générales.</p>
    </div>

    <div class="footer">
      <p>${data.storeName}<br>${data.storePhone}</p>
      <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function getReadyForPickupTemplate(data: ReadyForPickupData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">${data.storeName}</div>
    </div>

    <div class="content">
      <h1>Votre appareil est prêt !</h1>
      <div class="status-badge">À récupérer</div>

      <p>Bonjour ${data.clientName},</p>
      <p>Bonne nouvelle ! La réparation de votre <span class="highlight">${data.deviceType}</span> est terminée et votre appareil est prêt à être récupéré.</p>

      <div class="info-box">
        <div class="info-row">
          <span class="info-label">Numéro de réparation</span>
          <span class="info-value">${data.repairNumber}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Montant total</span>
          <span class="info-value">${data.totalCost.toFixed(2)} €</span>
        </div>
      </div>

      <p><span class="highlight">Où nous trouver ?</span></p>
      <p>${data.storeAddress}</p>

      <p><span class="highlight">Nos horaires :</span></p>
      <p>${data.storeHours}</p>

      <p>N'oubliez pas d'apporter une pièce d'identité et votre numéro de réparation <span class="highlight">${data.repairNumber}</span>.</p>

      <p>À très bientôt !</p>
    </div>

    <div class="footer">
      <p>${data.storeName}<br>${data.storeAddress}<br>${data.storePhone}</p>
      <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function getDelayedRepairTemplate(data: DelayedRepairData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">${data.storeName}</div>
    </div>

    <div class="content">
      <h1>Mise à jour de votre réparation</h1>
      <div class="status-badge">Délai prolongé</div>

      <p>Bonjour ${data.clientName},</p>
      <p>Nous souhaitons vous informer que la réparation de votre <span class="highlight">${data.deviceType}</span> prend un peu plus de temps que prévu.</p>

      <div class="info-box">
        <div class="info-row">
          <span class="info-label">Numéro de réparation</span>
          <span class="info-value">${data.repairNumber}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Raison du retard</span>
          <span class="info-value">${data.reason}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Nouvelle date estimée</span>
          <span class="info-value">${data.newEstimatedDate}</span>
        </div>
      </div>

      <p>Nous nous excusons pour ce désagrément et mettons tout en œuvre pour finaliser votre réparation dans les meilleurs délais.</p>

      <p>Pour toute question, n'hésitez pas à nous contacter au <span class="highlight">${data.storePhone}</span>.</p>

      <p>Merci de votre compréhension.</p>
    </div>

    <div class="footer">
      <p>${data.storeName}<br>${data.storePhone}</p>
      <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function getRepairDeliveredTemplate(data: DeliveredRepairData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">${data.storeName}</div>
    </div>

    <div class="content">
      <h1>Merci pour votre confiance</h1>
      <div class="status-badge">Réparation terminée</div>

      <p>Bonjour ${data.clientName},</p>
      <p>Nous espérons que vous êtes satisfait de la réparation de votre <span class="highlight">${data.deviceType}</span>.</p>

      <div class="info-box">
        <div class="info-row">
          <span class="info-label">Numéro de réparation</span>
          <span class="info-value">${data.repairNumber}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Garantie</span>
          <span class="info-value">${data.warrantyDays} jours</span>
        </div>
      </div>

      <p><span class="highlight">Garantie de réparation</span></p>
      <p>Cette réparation est garantie ${data.warrantyDays} jours. Si vous rencontrez le moindre problème, n'hésitez pas à revenir nous voir.</p>

      ${data.feedbackUrl ? `
      <p><span class="highlight">Votre avis compte</span></p>
      <p>Aidez-nous à améliorer nos services en nous laissant votre avis :</p>
      <div style="text-align: center;">
        <a href="${data.feedbackUrl}" class="button">Laisser un avis</a>
      </div>
      ` : ''}

      <p>Au plaisir de vous revoir !</p>
    </div>

    <div class="footer">
      <p>${data.storeName}<br>${data.storePhone}</p>
      <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
    </div>
  </div>
</body>
</html>
  `;
}
