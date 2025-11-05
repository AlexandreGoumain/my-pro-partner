# Email System Documentation

## Overview

Complete email sending infrastructure for the ERP system using Resend and React Email.

## Architecture

```
lib/email/
├── email-service.ts       # Main email service (Resend integration)
├── email-utils.ts         # Utility functions (formatting, variables, etc.)
└── README.md             # This file

emails/
├── _components/
│   └── email-layout.tsx   # Base layout for all emails
├── campaign.tsx          # Marketing campaign emails
├── invoice.tsx           # Invoice/Quote/Credit note emails
├── quote.tsx             # Alias for invoice (same template)
└── payment-reminder.tsx  # Payment reminder emails
```

## Quick Start

### 1. Configuration

Add the following environment variables to your `.env.local` and `.env.production`:

```env
# Email Service (Resend)
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@mypropartner.com
EMAIL_FROM_NAME=MyProPartner
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Get your Resend API key:**
1. Sign up at [resend.com](https://resend.com)
2. Create an API key in the dashboard
3. Add it to your environment variables

### 2. Basic Usage

```typescript
import { emailService } from '@/lib/email/email-service';
import { render } from '@react-email/render';
import { CampaignEmail } from '@/emails/campaign';

// Render email template
const emailHtml = render(
  CampaignEmail({
    subject: 'Welcome to our service',
    body: 'Hello {{nom}}, welcome!',
    clientName: 'Dupont',
    clientFirstName: 'Jean',
    entrepriseName: 'MyCompany',
  })
);

// Send email
const result = await emailService.sendEmail({
  to: 'client@example.com',
  subject: 'Welcome!',
  html: emailHtml,
});

if (result.success) {
  console.log('Email sent!', result.messageId);
} else {
  console.error('Failed:', result.error);
}
```

## Email Templates

### Campaign Email (`campaign.tsx`)

**Usage:** Marketing campaigns, newsletters, announcements

**Features:**
- Variable replacement: `{{nom}}`, `{{prenom}}`, `{{email}}`
- Unsubscribe link support
- Clean, simple design

**Example:**
```typescript
import { CampaignEmail } from '@/emails/campaign';

CampaignEmail({
  subject: 'Special Offer',
  body: 'Bonjour {{prenom}},\n\nWe have a special offer for you!',
  clientName: 'Dupont',
  clientFirstName: 'Jean',
  clientEmail: 'jean@example.com',
  entrepriseName: 'MyCompany',
  unsubscribeUrl: 'https://...',
})
```

### Invoice/Quote Email (`invoice.tsx`, `quote.tsx`)

**Usage:** Sending invoices, quotes, and credit notes

**Features:**
- Supports all document types: FACTURE, DEVIS, AVOIR
- Payment instructions
- Formatted amounts and dates
- Call-to-action buttons

**Example:**
```typescript
import { InvoiceEmail } from '@/emails/invoice';

InvoiceEmail({
  documentType: 'FACTURE',
  documentNumber: 'F-2024-001',
  clientName: 'Dupont',
  clientFirstName: 'Jean',
  totalTTC: 1200.50,
  dateEmission: '15/01/2024',
  dateEcheance: '15/02/2024',
  entrepriseName: 'MyCompany',
  paymentInstructions: 'Par virement bancaire...',
  viewUrl: 'https://...',
})
```

### Payment Reminder Email (`payment-reminder.tsx`)

**Usage:** Reminding clients about unpaid invoices

**Features:**
- Multiple invoices support
- Overdue highlighting
- Days overdue calculation
- Contact information
- Professional and polite tone

**Example:**
```typescript
import { PaymentReminderEmail } from '@/emails/payment-reminder';

PaymentReminderEmail({
  clientName: 'Dupont',
  clientFirstName: 'Jean',
  unpaidInvoices: [
    {
      numero: 'F-2024-001',
      dateEmission: '15/01/2024',
      dateEcheance: '15/02/2024',
      montant: 1200.50,
      joursRetard: 5,
    },
  ],
  totalDue: 1200.50,
  entrepriseName: 'MyCompany',
  entrepriseEmail: 'contact@mycompany.com',
  paymentInstructions: 'Par virement bancaire...',
})
```

## Email Service API

### `emailService.sendEmail(options)`

Send a single email.

```typescript
const result = await emailService.sendEmail({
  to: 'client@example.com',
  subject: 'Your invoice',
  html: '<h1>Hello</h1>',
  replyTo: 'support@mycompany.com', // Optional
  attachments: [ // Optional
    {
      filename: 'invoice.pdf',
      content: pdfBuffer,
    },
  ],
});
```

### `emailService.sendBulkEmails(recipients, subject, htmlTemplate, variables?)`

Send emails to multiple recipients with optional personalization.

```typescript
const result = await emailService.sendBulkEmails(
  ['client1@example.com', 'client2@example.com'],
  'Newsletter',
  '<h1>Hello {{nom}}</h1>',
  [
    { nom: 'Dupont' },
    { nom: 'Martin' },
  ]
);

console.log(`Success: ${result.successCount}, Failed: ${result.failureCount}`);
```

## Utility Functions

### Variable Replacement

```typescript
import { replaceVariables } from '@/lib/email/email-utils';

const text = replaceVariables(
  'Hello {{prenom}} {{nom}}',
  { prenom: 'Jean', nom: 'Dupont' }
);
// Result: "Hello Jean Dupont"
```

### Email Validation

```typescript
import { isValidEmail } from '@/lib/email/email-utils';

isValidEmail('test@example.com'); // true
isValidEmail('invalid'); // false
```

### Formatting

```typescript
import { formatCurrency, formatDate } from '@/lib/email/email-utils';

formatCurrency(1200.50); // "1 200,50 €"
formatDate(new Date(), 'long'); // "lundi 15 janvier 2024"
```

### Client/Document Variables

```typescript
import { getClientVariables, getDocumentVariables } from '@/lib/email/email-utils';

const clientVars = getClientVariables({
  nom: 'Dupont',
  prenom: 'Jean',
  email: 'jean@example.com',
});
// { nom: 'Dupont', prenom: 'Jean', email: 'jean@example.com', nomComplet: 'Jean Dupont' }

const docVars = getDocumentVariables({
  numero: 'F-2024-001',
  type: 'FACTURE',
  total: 1200.50,
  dateEmission: new Date(),
});
// { numeroDocument: 'F-2024-001', typeDocument: 'Facture', montantTotal: '1 200,50 €', ... }
```

## API Endpoints

### Campaign Sending
```
POST /api/campaigns/[id]/send
```

Sends a campaign to all recipients in the segment.

### Bulk Email to Segment
```
POST /api/segments/[id]/send-email
Body: { subject: string, body: string }
```

Sends a custom email to all clients in a segment.

### Document Sending
```
POST /api/documents/[id]/send
```

Sends an invoice, quote, or credit note to the client.

### Payment Reminder
```
POST /api/clients/[id]/send-reminder
```

Sends a payment reminder for all unpaid invoices to a client.

## Best Practices

### 1. Rate Limiting

The email service includes automatic rate limiting (100ms delay between emails). For large campaigns:

```typescript
import { batchEmails } from '@/lib/email/email-utils';

const batches = batchEmails(allRecipients, 50); // 50 per batch

for (const batch of batches) {
  await sendToBatch(batch);
  // Pause between batches
  await new Promise(resolve => setTimeout(resolve, 60000)); // 1 minute
}
```

### 2. Error Handling

Always handle email sending errors:

```typescript
const result = await emailService.sendEmail({ ... });

if (!result.success) {
  // Log the error
  console.error('Email failed:', result.error);

  // Notify admin or retry
  // await retryEmail(...);
}
```

### 3. Testing

Use Resend's test mode for development:

```env
# In .env.local
RESEND_API_KEY=re_test_key_here
```

Resend will accept emails but won't deliver them in test mode.

### 4. Personalization

Always personalize emails for better engagement:

```typescript
// ✅ Good
body: 'Bonjour {{prenom}}, nous avons...'

// ❌ Bad
body: 'Bonjour, nous avons...'
```

### 5. Unsubscribe Links

Always include unsubscribe links in marketing emails (GDPR requirement):

```typescript
import { generateUnsubscribeLink } from '@/lib/email/email-utils';

const unsubscribeUrl = generateUnsubscribeLink(clientId, entrepriseId);
```

## Troubleshooting

### Email not sending?

1. **Check API key**: Make sure `RESEND_API_KEY` is set correctly
2. **Verify email addresses**: Ensure recipient emails are valid
3. **Check logs**: Look for errors in console
4. **Test with simple email**:
   ```typescript
   await emailService.sendEmail({
     to: 'your@email.com',
     subject: 'Test',
     html: '<p>Test email</p>',
   });
   ```

### Variable not replaced?

Make sure you're using the correct syntax:
- ✅ `{{variableName}}`
- ❌ `{variableName}`
- ❌ `$variableName`

### Emails going to spam?

1. Set up SPF/DKIM records in Resend dashboard
2. Use a real "from" address with your domain
3. Avoid spam trigger words
4. Include unsubscribe links

## Future Enhancements

- [ ] Email tracking (opens, clicks)
- [ ] Email queue with BullMQ
- [ ] Email templates management UI
- [ ] A/B testing for campaigns
- [ ] Scheduled sending
- [ ] Email analytics dashboard

## Support

For issues or questions:
- Check the [Resend documentation](https://resend.com/docs)
- Review error logs in console
- Contact support if API issues persist
