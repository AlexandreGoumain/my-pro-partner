import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailNotificationService {
  private static async sendEmail({ to, subject, html }: EmailOptions) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || "noreply@mypropartner.com",
        to,
        subject,
        html,
      });

      if (error) {
        console.error("[EMAIL_ERROR]", error);
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error("[SEND_EMAIL_ERROR]", error);
      throw error;
    }
  }

  /**
   * Confirmation d'abonnement
   */
  static async sendSubscriptionConfirmation({
    email,
    entrepriseName,
    plan,
    trialEnd,
  }: {
    email: string;
    entrepriseName: string;
    plan: string;
    trialEnd?: Date;
  }) {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #000; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #000; color: #fff; padding: 30px; text-align: center; }
    .content { background: #fff; padding: 30px; border: 1px solid #eee; }
    .button { display: inline-block; background: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; color: #999; font-size: 12px; padding: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Bienvenue sur MyProPartner !</h1>
    </div>
    <div class="content">
      <h2>Bonjour ${entrepriseName} 👋</h2>

      <p>Merci d'avoir choisi MyProPartner ! Votre abonnement <strong>${plan}</strong> est maintenant actif.</p>

      ${
        trialEnd
          ? `
      <p>Vous bénéficiez d'une période d'essai gratuite jusqu'au <strong>${new Date(trialEnd).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}</strong>.</p>
      <p>Aucun paiement ne sera effectué avant la fin de votre période d'essai.</p>
      `
          : ""
      }

      <p>Vous pouvez dès maintenant profiter de toutes les fonctionnalités :</p>
      <ul>
        <li>Gestion complète de vos clients</li>
        <li>Factures et devis professionnels</li>
        <li>Point de vente (POS) tactile</li>
        <li>Liens de paiement partageables</li>
        <li>Rapprochement bancaire automatique</li>
        <li>Et bien plus encore...</li>
      </ul>

      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">
          Accéder au tableau de bord
        </a>
      </div>

      <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>

      <p>À bientôt,<br>L'équipe MyProPartner</p>
    </div>
    <div class="footer">
      <p>MyProPartner - Votre partenaire pour la gestion d'entreprise</p>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendEmail({
      to: email,
      subject: `Bienvenue sur MyProPartner ! 🎉`,
      html,
    });
  }

  /**
   * Alerte avant fin d'essai
   */
  static async sendTrialEndingWarning({
    email,
    entrepriseName,
    daysRemaining,
    plan,
  }: {
    email: string;
    entrepriseName: string;
    daysRemaining: number;
    plan: string;
  }) {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #000; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #ff9500; color: #fff; padding: 30px; text-align: center; }
    .content { background: #fff; padding: 30px; border: 1px solid #eee; }
    .button { display: inline-block; background: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; color: #999; font-size: 12px; padding: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Votre essai se termine bientôt</h1>
    </div>
    <div class="content">
      <h2>Bonjour ${entrepriseName},</h2>

      <div class="warning">
        <strong>⏰ Il vous reste ${daysRemaining} jour${daysRemaining > 1 ? "s" : ""} d'essai gratuit</strong>
      </div>

      <p>Votre période d'essai du plan <strong>${plan}</strong> prend fin dans ${daysRemaining} jour${daysRemaining > 1 ? "s" : ""}.</p>

      <p>Pour continuer à profiter de MyProPartner sans interruption :</p>
      <ul>
        <li>Aucune action n'est requise si vous souhaitez poursuivre</li>
        <li>Le paiement sera automatique après la fin de l'essai</li>
        <li>Vous pouvez annuler à tout moment depuis votre compte</li>
      </ul>

      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription" class="button">
          Gérer mon abonnement
        </a>
      </div>

      <p>Merci de votre confiance,<br>L'équipe MyProPartner</p>
    </div>
    <div class="footer">
      <p>MyProPartner - Votre partenaire pour la gestion d'entreprise</p>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendEmail({
      to: email,
      subject: `⏰ Votre essai se termine dans ${daysRemaining} jour${daysRemaining > 1 ? "s" : ""}`,
      html,
    });
  }

  /**
   * Paiement échoué
   */
  static async sendPaymentFailed({
    email,
    entrepriseName,
    amount,
    reason,
  }: {
    email: string;
    entrepriseName: string;
    amount: number;
    reason?: string;
  }) {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #000; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #dc3545; color: #fff; padding: 30px; text-align: center; }
    .content { background: #fff; padding: 30px; border: 1px solid #eee; }
    .button { display: inline-block; background: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .alert { background: #f8d7da; border: 1px solid #dc3545; padding: 15px; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; color: #999; font-size: 12px; padding: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Échec de paiement</h1>
    </div>
    <div class="content">
      <h2>Bonjour ${entrepriseName},</h2>

      <div class="alert">
        <strong>❌ Le paiement de ${amount.toFixed(2)}€ a échoué</strong>
      </div>

      <p>Nous n'avons pas pu prélever le montant de votre abonnement.</p>

      ${reason ? `<p><strong>Raison :</strong> ${reason}</p>` : ""}

      <p>Pour éviter toute interruption de service, veuillez :</p>
      <ul>
        <li>Vérifier que votre carte bancaire est valide</li>
        <li>Mettre à jour vos informations de paiement</li>
        <li>Vérifier que vous avez suffisamment de fonds</li>
      </ul>

      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription" class="button">
          Mettre à jour mon moyen de paiement
        </a>
      </div>

      <p>Cordialement,<br>L'équipe MyProPartner</p>
    </div>
    <div class="footer">
      <p>MyProPartner - Votre partenaire pour la gestion d'entreprise</p>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendEmail({
      to: email,
      subject: `❌ Échec de paiement - Action requise`,
      html,
    });
  }

  /**
   * Notification de nouvelle vente POS
   */
  static async sendNewSaleNotification({
    email,
    entrepriseName,
    montant,
    numeroFacture,
    moyenPaiement,
  }: {
    email: string;
    entrepriseName: string;
    montant: number;
    numeroFacture: string;
    moyenPaiement: string;
  }) {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #000; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #28a745; color: #fff; padding: 30px; text-align: center; }
    .content { background: #fff; padding: 30px; border: 1px solid #eee; }
    .amount { font-size: 36px; font-weight: bold; color: #28a745; text-align: center; margin: 20px 0; }
    .footer { text-align: center; color: #999; font-size: 12px; padding: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💰 Nouvelle vente enregistrée</h1>
    </div>
    <div class="content">
      <h2>Bonjour ${entrepriseName},</h2>

      <p>Une nouvelle vente vient d'être enregistrée !</p>

      <div class="amount">${montant.toFixed(2)}€</div>

      <table style="width: 100%; margin: 20px 0;">
        <tr>
          <td style="padding: 8px 0;"><strong>Facture :</strong></td>
          <td style="text-align: right;">${numeroFacture}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Moyen de paiement :</strong></td>
          <td style="text-align: right;">${moyenPaiement}</td>
        </tr>
      </table>

      <p style="text-align: center; color: #999; font-size: 14px;">
        Ceci est une notification automatique de votre système POS
      </p>
    </div>
    <div class="footer">
      <p>MyProPartner - Votre partenaire pour la gestion d'entreprise</p>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendEmail({
      to: email,
      subject: `💰 Nouvelle vente : ${montant.toFixed(2)}€`,
      html,
    });
  }

  /**
   * Anomalie bancaire détectée
   */
  static async sendBankAnomalyNotification({
    email,
    entrepriseName,
    transaction,
    notes,
  }: {
    email: string;
    entrepriseName: string;
    transaction: {
      libelle: string;
      montant: number;
      date: Date;
    };
    notes: string;
  }) {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #000; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #ffc107; color: #000; padding: 30px; text-align: center; }
    .content { background: #fff; padding: 30px; border: 1px solid #eee; }
    .button { display: inline-block; background: #000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; color: #999; font-size: 12px; padding: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ Anomalie bancaire détectée</h1>
    </div>
    <div class="content">
      <h2>Bonjour ${entrepriseName},</h2>

      <div class="warning">
        <strong>Une anomalie a été détectée dans votre rapprochement bancaire</strong>
      </div>

      <p>Détails de la transaction :</p>
      <table style="width: 100%; margin: 20px 0; border: 1px solid #eee;">
        <tr style="background: #f8f9fa;">
          <td style="padding: 8px;"><strong>Date :</strong></td>
          <td style="padding: 8px;">${new Date(transaction.date).toLocaleDateString("fr-FR")}</td>
        </tr>
        <tr>
          <td style="padding: 8px;"><strong>Libellé :</strong></td>
          <td style="padding: 8px;">${transaction.libelle}</td>
        </tr>
        <tr style="background: #f8f9fa;">
          <td style="padding: 8px;"><strong>Montant :</strong></td>
          <td style="padding: 8px;"><strong>${transaction.montant.toFixed(2)}€</strong></td>
        </tr>
      </table>

      <p><strong>Notes :</strong></p>
      <p style="background: #f8f9fa; padding: 15px; border-radius: 6px;">${notes}</p>

      <p>Veuillez vérifier cette transaction et la traiter manuellement.</p>

      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/bank-reconciliation" class="button">
          Voir le rapprochement bancaire
        </a>
      </div>

      <p>Cordialement,<br>L'équipe MyProPartner</p>
    </div>
    <div class="footer">
      <p>MyProPartner - Votre partenaire pour la gestion d'entreprise</p>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendEmail({
      to: email,
      subject: `⚠️ Anomalie bancaire détectée`,
      html,
    });
  }
}
