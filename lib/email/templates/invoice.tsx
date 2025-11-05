import * as React from 'react';
import { Text, Section, Button, Hr } from '@react-email/components';
import { EmailLayout } from './_components/email-layout';

interface InvoiceEmailProps {
  documentType: 'FACTURE' | 'DEVIS' | 'AVOIR';
  documentNumber: string;
  clientName: string;
  clientFirstName?: string;
  totalTTC: number;
  dateEmission: string;
  dateEcheance?: string;
  entrepriseName?: string;
  entrepriseEmail?: string;
  paymentInstructions?: string;
  viewUrl?: string;
}

/**
 * Invoice/Quote Email Template
 * Used for sending invoices, quotes, and credit notes to clients
 */
export function InvoiceEmail({
  documentType,
  documentNumber,
  clientName,
  clientFirstName,
  totalTTC,
  dateEmission,
  dateEcheance,
  entrepriseName = 'MyProPartner',
  entrepriseEmail,
  paymentInstructions,
  viewUrl,
}: InvoiceEmailProps) {
  const docTypeLabel =
    documentType === 'FACTURE'
      ? 'Facture'
      : documentType === 'DEVIS'
      ? 'Devis'
      : 'Avoir';

  const greeting = clientFirstName
    ? `Bonjour ${clientFirstName},`
    : `Bonjour ${clientName},`;

  const introText =
    documentType === 'FACTURE'
      ? `Veuillez trouver ci-joint votre facture n°${documentNumber}.`
      : documentType === 'DEVIS'
      ? `Veuillez trouver ci-joint votre devis n°${documentNumber}.`
      : `Veuillez trouver ci-joint votre avoir n°${documentNumber}.`;

  return (
    <EmailLayout
      preview={`${docTypeLabel} n°${documentNumber} - ${entrepriseName}`}
      entrepriseName={entrepriseName}
    >
      {/* Greeting */}
      <Text style={styles.greeting}>{greeting}</Text>

      {/* Introduction */}
      <Text style={styles.paragraph}>{introText}</Text>

      {/* Document Details Card */}
      <Section style={styles.card}>
        <Text style={styles.cardTitle}>
          {docTypeLabel} n°{documentNumber}
        </Text>

        <Hr style={styles.divider} />

        <table style={styles.detailsTable}>
          <tbody>
            <tr>
              <td style={styles.labelCell}>Montant total TTC :</td>
              <td style={styles.valueCell}>
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(totalTTC)}
              </td>
            </tr>
            <tr>
              <td style={styles.labelCell}>Date d&apos;émission :</td>
              <td style={styles.valueCell}>{dateEmission}</td>
            </tr>
            {dateEcheance && documentType === 'FACTURE' && (
              <tr>
                <td style={styles.labelCell}>Date d&apos;échéance :</td>
                <td style={styles.valueCell}>{dateEcheance}</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* View Button */}
        {viewUrl && (
          <Section style={{ marginTop: '24px' }}>
            <Button href={viewUrl} style={styles.button}>
              Voir le {docTypeLabel.toLowerCase()}
            </Button>
          </Section>
        )}
      </Section>

      {/* Payment Instructions */}
      {paymentInstructions && documentType === 'FACTURE' && (
        <>
          <Text style={styles.sectionTitle}>Modalités de paiement</Text>
          <Text style={styles.paragraph}>{paymentInstructions}</Text>
        </>
      )}

      {/* Call to Action based on document type */}
      {documentType === 'DEVIS' && (
        <Section style={styles.ctaCard}>
          <Text style={styles.ctaText}>
            Pour accepter ce devis, veuillez nous contacter par retour d&apos;email ou
            par téléphone.
          </Text>
        </Section>
      )}

      {documentType === 'FACTURE' && (
        <Section style={styles.ctaCard}>
          <Text style={styles.ctaText}>
            Merci de procéder au règlement avant le {dateEcheance || 'date d&apos;échéance'}.
          </Text>
        </Section>
      )}

      {/* Closing */}
      <Text style={styles.paragraph}>
        Si vous avez des questions concernant ce {docTypeLabel.toLowerCase()},
        n&apos;hésitez pas à nous contacter{entrepriseEmail ? ` à ${entrepriseEmail}` : ''}.
      </Text>

      {/* Signature */}
      <Section style={styles.signature}>
        <Text style={styles.signatureName}>L&apos;équipe {entrepriseName}</Text>
        <Text style={styles.signatureTagline}>
          Merci pour votre confiance
        </Text>
      </Section>
    </EmailLayout>
  );
}

const styles = {
  greeting: {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#000000',
    fontWeight: '500',
    margin: '0 0 24px',
  },
  paragraph: {
    fontSize: '15px',
    lineHeight: '24px',
    color: 'rgba(0, 0, 0, 0.8)',
    margin: '0 0 16px',
  },
  card: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    padding: '24px',
    margin: '24px 0',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#000000',
    margin: '0 0 16px',
    letterSpacing: '-0.01em',
  },
  divider: {
    borderColor: 'rgba(0, 0, 0, 0.08)',
    margin: '0 0 20px',
  },
  detailsTable: {
    width: '100%',
    borderSpacing: '0',
  },
  labelCell: {
    fontSize: '14px',
    color: 'rgba(0, 0, 0, 0.6)',
    padding: '8px 0',
    textAlign: 'left' as const,
  },
  valueCell: {
    fontSize: '14px',
    color: '#000000',
    fontWeight: '500',
    padding: '8px 0',
    textAlign: 'right' as const,
  },
  button: {
    backgroundColor: '#000000',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 24px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#000000',
    margin: '32px 0 12px',
    letterSpacing: '-0.01em',
  },
  ctaCard: {
    backgroundColor: '#000000',
    borderRadius: '8px',
    padding: '20px 24px',
    margin: '24px 0',
  },
  ctaText: {
    fontSize: '14px',
    lineHeight: '22px',
    color: '#ffffff',
    margin: 0,
    textAlign: 'center' as const,
  },
  signature: {
    marginTop: '40px',
    paddingTop: '24px',
    borderTop: '1px solid rgba(0, 0, 0, 0.08)',
  },
  signatureName: {
    fontSize: '15px',
    lineHeight: '22px',
    color: 'rgba(0, 0, 0, 0.6)',
    fontWeight: '500',
    margin: '0 0 4px',
  },
  signatureTagline: {
    fontSize: '13px',
    lineHeight: '20px',
    color: 'rgba(0, 0, 0, 0.4)',
    margin: 0,
  },
};

export default InvoiceEmail;
