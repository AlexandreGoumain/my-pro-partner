import * as React from 'react';
import { Text, Section } from '@react-email/components';
import { EmailLayout } from './_components/email-layout';

interface CampaignEmailProps {
  subject: string;
  body: string;
  clientName?: string;
  clientFirstName?: string;
  clientEmail?: string;
  entrepriseName?: string;
  unsubscribeUrl?: string;
}

/**
 * Campaign Email Template
 * Used for marketing campaigns sent to client segments
 */
export function CampaignEmail({
  subject,
  body,
  clientName = '',
  clientFirstName = '',
  clientEmail = '',
  entrepriseName = 'MyProPartner',
  unsubscribeUrl,
}: CampaignEmailProps) {
  // Process body: replace variables and handle basic formatting
  let processedBody = body;

  // Replace common variables
  const variables: Record<string, string> = {
    nom: clientName,
    prenom: clientFirstName,
    email: clientEmail,
    nomComplet: [clientFirstName, clientName].filter(Boolean).join(' ') || 'Client',
  };

  for (const [key, value] of Object.entries(variables)) {
    processedBody = processedBody
      .replace(new RegExp(`{{${key}}}`, 'g'), value)
      .replace(new RegExp(`{${key}}`, 'g'), value);
  }

  // Convert line breaks to paragraphs
  const paragraphs = processedBody.split('\n\n').filter(Boolean);

  return (
    <EmailLayout
      preview={subject}
      entrepriseName={entrepriseName}
      unsubscribeUrl={unsubscribeUrl}
    >
      {/* Greeting */}
      {clientFirstName && (
        <Text style={styles.greeting}>
          Bonjour {clientFirstName},
        </Text>
      )}

      {/* Body content */}
      {paragraphs.map((paragraph, index) => (
        <Text key={index} style={styles.paragraph}>
          {paragraph}
        </Text>
      ))}

      {/* Signature */}
      <Section style={styles.signature}>
        <Text style={styles.signatureName}>
          L&apos;équipe {entrepriseName}
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
  signature: {
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid rgba(0, 0, 0, 0.08)',
  },
  signatureName: {
    fontSize: '15px',
    lineHeight: '22px',
    color: 'rgba(0, 0, 0, 0.6)',
    fontWeight: '500',
    margin: 0,
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
    margin: '24px 0',
  },
};

export default CampaignEmail;
