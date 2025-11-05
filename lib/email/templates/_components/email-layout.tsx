import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
} from '@react-email/components';

interface EmailLayoutProps {
  children: React.ReactNode;
  preview?: string;
  entrepriseName?: string;
  unsubscribeUrl?: string;
}

/**
 * Base email layout component
 * Provides consistent styling and structure for all emails
 */
export function EmailLayout({
  children,
  preview,
  entrepriseName = 'MyProPartner',
  unsubscribeUrl,
}: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      {preview && (
        <div
          style={{
            display: 'none',
            overflow: 'hidden',
            lineHeight: '1px',
            opacity: 0,
            maxHeight: 0,
            maxWidth: 0,
          }}
        >
          {preview}
        </div>
      )}
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Text style={styles.logo}>{entrepriseName}</Text>
          </Section>

          {/* Main Content */}
          <Section style={styles.content}>{children}</Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Hr style={styles.divider} />

            <Text style={styles.footerText}>
              Cet email a été envoyé par {entrepriseName}
            </Text>

            {unsubscribeUrl && (
              <Text style={styles.footerText}>
                <Link href={unsubscribeUrl} style={styles.link}>
                  Se désabonner
                </Link>
              </Text>
            )}

            <Text style={styles.footerCopyright}>
              © {new Date().getFullYear()} {entrepriseName}. Tous droits réservés.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles inspired by Apple's minimalist design
const styles = {
  body: {
    backgroundColor: '#f6f6f6',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
    margin: 0,
    padding: 0,
  },
  container: {
    backgroundColor: '#ffffff',
    margin: '40px auto',
    padding: 0,
    maxWidth: '600px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  header: {
    backgroundColor: '#000000',
    padding: '24px 40px',
  },
  logo: {
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '600',
    letterSpacing: '-0.02em',
    margin: 0,
    padding: 0,
  },
  content: {
    padding: '40px 40px 32px',
  },
  footer: {
    padding: '0 40px 40px',
  },
  divider: {
    borderColor: 'rgba(0, 0, 0, 0.08)',
    margin: '0 0 24px',
  },
  footerText: {
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: '12px',
    lineHeight: '18px',
    margin: '0 0 8px',
    textAlign: 'center' as const,
  },
  footerCopyright: {
    color: 'rgba(0, 0, 0, 0.3)',
    fontSize: '11px',
    lineHeight: '16px',
    margin: '16px 0 0',
    textAlign: 'center' as const,
  },
  link: {
    color: 'rgba(0, 0, 0, 0.6)',
    textDecoration: 'underline',
  },
};

export default EmailLayout;
