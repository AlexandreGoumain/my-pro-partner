import * as React from 'react';
import { Text, Section, Hr } from '@react-email/components';
import { EmailLayout } from './_components/email-layout';

interface UnpaidInvoice {
  numero: string;
  dateEmission: string;
  dateEcheance: string;
  montant: number;
  joursRetard: number;
}

interface PaymentReminderEmailProps {
  clientName: string;
  clientFirstName?: string;
  unpaidInvoices: UnpaidInvoice[];
  totalDue: number;
  entrepriseName?: string;
  entrepriseEmail?: string;
  entreprisePhone?: string;
  paymentInstructions?: string;
}

/**
 * Payment Reminder Email Template
 * Used for reminding clients about unpaid invoices
 */
export function PaymentReminderEmail({
  clientName,
  clientFirstName,
  unpaidInvoices,
  totalDue,
  entrepriseName = 'MyProPartner',
  entrepriseEmail,
  entreprisePhone,
  paymentInstructions,
}: PaymentReminderEmailProps) {
  const greeting = clientFirstName
    ? `Bonjour ${clientFirstName},`
    : `Bonjour ${clientName},`;

  const hasMultipleInvoices = unpaidInvoices.length > 1;
  const hasOverdueInvoices = unpaidInvoices.some((inv) => inv.joursRetard > 0);

  return (
    <EmailLayout
      preview={`Rappel de paiement - ${entrepriseName}`}
      entrepriseName={entrepriseName}
    >
      {/* Greeting */}
      <Text style={styles.greeting}>{greeting}</Text>

      {/* Introduction */}
      <Text style={styles.paragraph}>
        Nous vous contactons concernant{' '}
        {hasMultipleInvoices
          ? `${unpaidInvoices.length} factures impayées`
          : 'une facture impayée'}{' '}
        pour un montant total de{' '}
        <strong>
          {new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
          }).format(totalDue)}
        </strong>
        .
      </Text>

      {/* Urgency message for overdue invoices */}
      {hasOverdueInvoices && (
        <Section style={styles.urgentCard}>
          <Text style={styles.urgentText}>
            ⚠️ {hasMultipleInvoices ? 'Certaines factures sont' : 'Cette facture est'}{' '}
            en retard de paiement
          </Text>
        </Section>
      )}

      {/* Unpaid Invoices List */}
      <Section style={styles.card}>
        <Text style={styles.cardTitle}>
          {hasMultipleInvoices ? 'Factures impayées' : 'Facture impayée'}
        </Text>

        <Hr style={styles.divider} />

        {unpaidInvoices.map((invoice, index) => (
          <div key={index}>
            <table style={styles.invoiceTable}>
              <tbody>
                <tr>
                  <td colSpan={2}>
                    <Text style={styles.invoiceNumber}>
                      Facture n°{invoice.numero}
                    </Text>
                  </td>
                </tr>
                <tr>
                  <td style={styles.labelCell}>Date d&apos;émission :</td>
                  <td style={styles.valueCell}>{invoice.dateEmission}</td>
                </tr>
                <tr>
                  <td style={styles.labelCell}>Date d&apos;échéance :</td>
                  <td style={styles.valueCell}>
                    {invoice.dateEcheance}
                    {invoice.joursRetard > 0 && (
                      <span style={styles.overdueLabel}>
                        {' '}
                        (en retard de {invoice.joursRetard} jour
                        {invoice.joursRetard > 1 ? 's' : ''})
                      </span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={styles.labelCell}>Montant TTC :</td>
                  <td style={styles.amountCell}>
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(invoice.montant)}
                  </td>
                </tr>
              </tbody>
            </table>

            {index < unpaidInvoices.length - 1 && (
              <Hr style={{ ...styles.divider, margin: '20px 0' }} />
            )}
          </div>
        ))}

        {/* Total */}
        {hasMultipleInvoices && (
          <>
            <Hr style={{ ...styles.divider, margin: '24px 0' }} />
            <table style={styles.totalTable}>
              <tbody>
                <tr>
                  <td style={styles.totalLabel}>Montant total à régler :</td>
                  <td style={styles.totalAmount}>
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(totalDue)}
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </Section>

      {/* Payment Instructions */}
      {paymentInstructions && (
        <>
          <Text style={styles.sectionTitle}>Modalités de paiement</Text>
          <Text style={styles.paragraph}>{paymentInstructions}</Text>
        </>
      )}

      {/* Call to Action */}
      <Section style={styles.ctaCard}>
        <Text style={styles.ctaText}>
          Nous vous remercions de bien vouloir procéder au règlement dans les
          meilleurs délais.
        </Text>
      </Section>

      {/* Contact Information */}
      <Text style={styles.paragraph}>
        Si vous avez déjà effectué le règlement, veuillez ne pas tenir compte de
        ce message. Si vous avez des questions ou rencontrez des difficultés,
        n&apos;hésitez pas à nous contacter :
      </Text>

      {/* Contact Details */}
      <Section style={styles.contactCard}>
        {entrepriseEmail && (
          <Text style={styles.contactItem}>
            <strong>Email :</strong> {entrepriseEmail}
          </Text>
        )}
        {entreprisePhone && (
          <Text style={styles.contactItem}>
            <strong>Téléphone :</strong> {entreprisePhone}
          </Text>
        )}
      </Section>

      {/* Closing */}
      <Section style={styles.signature}>
        <Text style={styles.signatureName}>L&apos;équipe {entrepriseName}</Text>
        <Text style={styles.signatureTagline}>
          Merci pour votre compréhension
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
  urgentCard: {
    backgroundColor: 'rgba(220, 38, 38, 0.08)',
    borderRadius: '8px',
    border: '1px solid rgba(220, 38, 38, 0.2)',
    padding: '16px 20px',
    margin: '20px 0',
  },
  urgentText: {
    fontSize: '14px',
    lineHeight: '22px',
    color: 'rgb(153, 27, 27)',
    fontWeight: '500',
    margin: 0,
    textAlign: 'center' as const,
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
  invoiceTable: {
    width: '100%',
    borderSpacing: '0',
  },
  invoiceNumber: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#000000',
    margin: '0 0 12px',
  },
  labelCell: {
    fontSize: '14px',
    color: 'rgba(0, 0, 0, 0.6)',
    padding: '6px 0',
    textAlign: 'left' as const,
  },
  valueCell: {
    fontSize: '14px',
    color: '#000000',
    padding: '6px 0',
    textAlign: 'right' as const,
  },
  amountCell: {
    fontSize: '15px',
    color: '#000000',
    fontWeight: '600',
    padding: '6px 0',
    textAlign: 'right' as const,
  },
  overdueLabel: {
    fontSize: '12px',
    color: 'rgb(153, 27, 27)',
    fontWeight: '500',
  },
  totalTable: {
    width: '100%',
    borderSpacing: '0',
  },
  totalLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#000000',
    padding: '8px 0',
    textAlign: 'left' as const,
  },
  totalAmount: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#000000',
    padding: '8px 0',
    textAlign: 'right' as const,
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
  contactCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: '8px',
    padding: '16px 20px',
    margin: '16px 0 24px',
  },
  contactItem: {
    fontSize: '14px',
    lineHeight: '22px',
    color: 'rgba(0, 0, 0, 0.8)',
    margin: '4px 0',
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

export default PaymentReminderEmail;
