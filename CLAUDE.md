# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application

```bash
# Development server (with hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Database Commands (Prisma)

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name <migration_name>

# Apply migrations in production
npx prisma migrate deploy

# Reset database (DANGER: deletes all data)
npx prisma migrate reset

# Open Prisma Studio (GUI for database)
npx prisma studio
```

### TypeScript

```bash
# Type checking without build
npx tsc --noEmit
```

## Project Architecture

### Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v4 with JWT strategy
- **UI**: shadcn/ui components + Tailwind CSS v4
- **Forms**: React Hook Form + Zod validation

### Key Architectural Decisions

#### 1. Authentication Flow

- NextAuth.js configured in `app/api/auth/[...nextauth]/route.ts`
- Uses **JWT session strategy** (not database sessions)
- Passwords hashed with bcryptjs (10 rounds)
- Custom credentials provider for email/password authentication
- Protected routes should use `getServerSession()` from NextAuth

```typescript
// Example protected API route
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }
  // ... rest of handler
}
```

#### 2. Database Architecture (Prisma)

The schema is split into logical domains:

- **User**: Authentication (email, password, role)
- **Client**: Customer management (nom, email, telephone, adresse)
- **Categorie**: Hierarchical categories for articles (with parent/children relationships)
- **Article**: Product/service catalog (with pricing, stock, TVA)
- **Document**: Commercial documents (DEVIS, FACTURE, AVOIR) with status workflow
- **LigneDocument**: Line items for documents
- **Paiement**: Payment records linked to documents
- **ParametresEntreprise**: Single-row company settings table

**Important Notes**:
- Primary keys use `cuid()` for all tables
- Prisma client generated to `lib/generated/prisma` (custom output location)
- `Document` model has self-referential relationship for devis → facture conversion
- Decimal fields for monetary values (10,2 precision)
- Enums for `DocumentType`, `DocumentStatut`, `MoyenPaiement`

#### 3. API Routes Structure

All API routes follow REST conventions:

```
app/api/
├── auth/
│   ├── register/route.ts          # POST: User registration
│   └── [...nextauth]/route.ts     # NextAuth.js endpoints
├── clients/
│   ├── route.ts                   # GET: List, POST: Create
│   └── [id]/route.ts              # GET, PUT, DELETE by ID
├── articles/
│   ├── route.ts                   # GET: List, POST: Create
│   └── [id]/route.ts              # GET, PUT, DELETE by ID
├── documents/
│   ├── route.ts                   # GET: List, POST: Create
│   └── [id]/route.ts              # GET, PUT, DELETE by ID
└── categories/
    └── route.ts                   # GET: List, POST: Create
```

**API Conventions**:
- All routes require authentication (check session)
- Validation uses Zod schemas
- Standard HTTP status codes (200, 201, 400, 401, 404, 500)
- Error responses: `{ message: string, errors?: array }`

#### 4. Form Validation

Two-tier validation approach:

1. **Frontend**: React Hook Form + Zod schemas in `lib/validation.ts`
2. **Backend**: Zod schemas in API route handlers

Example validation schemas exist for:
- `loginSchema` (email + password)
- `registerSchema` (email + password + confirmPassword + name)

Create new schemas following the same pattern for new forms.

#### 5. UI Component System

Uses **shadcn/ui** with default theme (professional, monochrome design):

- Components in `components/ui/` (button, input, label, card, form)
- **Do NOT use custom colors** - stick to semantic Tailwind classes:
  - `bg-background`, `text-foreground`
  - `bg-muted`, `text-muted-foreground`
  - `bg-primary`, `text-primary-foreground`
  - `bg-destructive` for errors
- Form components use shadcn's `Form`, `FormField`, `FormItem`, `FormLabel`, `FormMessage`
- Authentication pages follow the shadcn authentication example design (two-column layout)

## Environment Variables

Required in `.env.local`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/erp_artisan?schema=public"
NEXTAUTH_SECRET="<generate with: openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"
```

## Important Files

- `lib/prisma.ts` - Prisma client singleton (prevents multiple instances in dev)
- `lib/validation.ts` - Zod validation schemas
- `lib/utils.ts` - Utility functions (includes `cn()` for class merging)
- `app/api/auth/[...nextauth]/route.ts` - NextAuth configuration
- `prisma/schema.prisma` - Database schema
- `database/schema.sql` - SQL schema for reference (PostgreSQL)

## Database Setup

### First Time Setup

1. Ensure PostgreSQL is running (local or Docker)
2. Create `.env.local` with DATABASE_URL
3. Generate Prisma client: `npx prisma generate`
4. Run migrations: `npx prisma migrate dev --name init`

### After Schema Changes

1. Update `prisma/schema.prisma`
2. Run `npx prisma generate` to update client types
3. Run `npx prisma migrate dev --name <description>` to create migration
4. Commit both schema.prisma and migration files

## Common Patterns

### Creating a New CRUD API Route

1. Define Zod validation schema
2. Create `app/api/<resource>/route.ts` for list/create
3. Create `app/api/<resource>/[id]/route.ts` for get/update/delete
4. Check authentication with `getServerSession()`
5. Validate input with Zod
6. Use Prisma client for database operations
7. Return proper HTTP status codes

### Creating a New Form Page

1. Define validation schema in `lib/validation.ts`
2. Use React Hook Form with `zodResolver`
3. Use shadcn/ui form components (`Form`, `FormField`, etc.)
4. Handle loading states with `isLoading` state
5. Show errors with `FormMessage` and custom error displays
6. Follow authentication page patterns for consistency

## Testing Locally

1. Navigate to `http://localhost:3000/auth/register`
2. Create test account
3. Auto-redirects to `/dashboard` after registration
4. Use Prisma Studio (`npx prisma studio`) to inspect database

## Deployment Notes

Target platform: OVH VPS with Ubuntu

- Use PM2 for process management
- Nginx as reverse proxy
- SSL with Let's Encrypt (Certbot)
- Environment variables in `.env.production`
- Run `npx prisma migrate deploy` (not `migrate dev`) in production

See `SETUP.md` for detailed deployment instructions.
