# Memorika CRM - Deployment Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        VERCEL                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Next.js Application                     │    │
│  │  ┌──────────────────┐  ┌──────────────────────┐    │    │
│  │  │   Landing Page   │  │    Admin Portal      │    │    │
│  │  │   (Public)       │  │    (Protected)       │    │    │
│  │  │   /              │  │    /admin/*          │    │    │
│  │  └──────────────────┘  └──────────────────────┘    │    │
│  │  ┌──────────────────────────────────────────────┐  │    │
│  │  │              API Routes                       │  │    │
│  │  │   /api/dashboard, /api/crm/*, /api/payments/* │  │    │
│  │  └──────────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ DATABASE_URL (PostgreSQL)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       RAILWAY                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              PostgreSQL Database                     │    │
│  │   - All CRM data (contacts, leads, deals, etc.)     │    │
│  │   - Payment records, invoices                        │    │
│  │   - User settings                                    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Key Points

1. **Everything is deployed to Vercel** - The landing page (`/`), admin portal (`/admin/*`), and all API routes (`/api/*`) are part of the same Next.js application

2. **Railway only hosts the database** - PostgreSQL database that stores all your data

3. **How they connect**: Vercel connects to Railway's PostgreSQL using the `DATABASE_URL` environment variable

---

## Step 1: Railway Setup (Database)

### 1.1 Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click **"New Project"**
4. Select **"Provision PostgreSQL"**

### 1.2 Get Database Credentials
After PostgreSQL is provisioned:
1. Click on the PostgreSQL service
2. Go to **"Variables"** tab
3. Copy these values:

```
DATABASE_URL = postgresql://postgres:PASSWORD@HOST:PORT/railway
```

Or construct it from individual variables:
- `PGHOST` - Database host
- `PGPORT` - Database port (usually 5432)
- `PGUSER` - Username (usually postgres)
- `PGPASSWORD` - Password
- `PGDATABASE` - Database name (usually railway)

### 1.3 Railway Environment Variables
Railway PostgreSQL doesn't need additional configuration - it's just a database.

---

## Step 2: Vercel Setup (Application)

### 2.1 Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click **"Add New Project"**
4. Import your GitHub repository: `luvchikavi/Memorika`
5. Select the `web` folder as the root directory

### 2.2 Configure Build Settings
```
Framework Preset: Next.js
Root Directory: web
Build Command: npm run build (or leave default)
Output Directory: (leave default)
Install Command: npm install
```

### 2.3 Environment Variables (Required)

Add these in Vercel's project settings → Environment Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `postgresql://postgres:XXX@XXX.railway.app:5432/railway` | From Railway |
| `DIRECT_URL` | Same as DATABASE_URL | For Prisma migrations |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` | Session encryption |
| `NEXTAUTH_URL` | `https://memorika.co.il` (or your Vercel URL) | Auth callback URL |
| `NEXT_PUBLIC_APP_URL` | `https://memorika.co.il` (or your Vercel URL) | Public app URL |

### 2.4 Optional Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `BUSINESS_NAME` | `Memorika` | For invoices |
| `BUSINESS_EMAIL` | `info@memorika.co.il` | For invoices |
| `RESEND_API_KEY` | Your Resend API key | For sending emails |
| `WHATSAPP_ACCESS_TOKEN` | Meta API token | For WhatsApp integration |

---

## Step 3: Update Prisma Schema for PostgreSQL

Before deploying, the Prisma schema needs to use PostgreSQL. Copy the production schema:

```bash
cp prisma/schema.postgres.prisma prisma/schema.prisma
```

Or update `prisma/schema.prisma` datasource:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

---

## Step 4: Database Migration

After Vercel deployment, you need to migrate the database schema:

### Option A: Via Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to project
vercel link

# Pull environment variables
vercel env pull .env.production.local

# Run migration
npx prisma migrate deploy
```

### Option B: Via Local Machine
```bash
# Set DATABASE_URL to Railway PostgreSQL
export DATABASE_URL="postgresql://postgres:XXX@XXX.railway.app:5432/railway"

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

---

## Step 5: CORS Configuration

CORS is configured in `/src/middleware.ts`:

```typescript
const allowedOrigins = [
  "http://localhost:3000",
  "https://memorika.co.il",
  "https://www.memorika.co.il",
  "https://memorika.vercel.app",
];
```

**If you use a different domain**, update this file before deploying.

---

## Step 6: Domain Configuration (After purchasing domain)

### In Vercel:
1. Go to Project Settings → Domains
2. Add `memorika.co.il`
3. Add `www.memorika.co.il`
4. Vercel will provide DNS records

### DNS Records to Add at your domain registrar:
```
Type    Name    Value
A       @       76.76.19.19 (Vercel IP)
CNAME   www     cname.vercel-dns.com
```

---

## URLs After Deployment

| URL | What it shows |
|-----|---------------|
| `https://your-domain.vercel.app/` | Landing page (public) |
| `https://your-domain.vercel.app/admin` | Admin dashboard |
| `https://your-domain.vercel.app/admin/crm/contacts` | Contacts management |
| `https://your-domain.vercel.app/admin/crm/leads` | Leads management |
| `https://your-domain.vercel.app/admin/crm/deals` | Deals management |
| `https://your-domain.vercel.app/admin/payments` | Payments management |
| `https://your-domain.vercel.app/api/health` | Health check API |

---

## Quick Deployment Checklist

### Railway:
- [ ] Create Railway account
- [ ] Create new project
- [ ] Provision PostgreSQL database
- [ ] Copy `DATABASE_URL` from Variables tab

### Vercel:
- [ ] Create Vercel account
- [ ] Connect GitHub repository (`luvchikavi/Memorika`)
- [ ] Set root directory to `web`
- [ ] Add environment variables:
  - [ ] `DATABASE_URL` (from Railway)
  - [ ] `DIRECT_URL` (same as DATABASE_URL)
  - [ ] `NEXTAUTH_SECRET` (generate new)
  - [ ] `NEXTAUTH_URL` (your Vercel URL)
  - [ ] `NEXT_PUBLIC_APP_URL` (your Vercel URL)
- [ ] Deploy

### After Deploy:
- [ ] Run database migration (`npx prisma db push`)
- [ ] Test health endpoint: `/api/health`
- [ ] Test admin dashboard: `/admin`
- [ ] Configure custom domain (optional)

---

## Troubleshooting

### "Cannot connect to database"
- Check `DATABASE_URL` is correct
- Ensure Railway PostgreSQL is running
- Check if IP needs to be whitelisted

### "Prisma schema mismatch"
- Run `npx prisma generate` locally
- Run `npx prisma db push` to sync schema

### "CORS error"
- Update `src/middleware.ts` with your domain
- Redeploy to Vercel

### "Build failed"
- Check Vercel build logs
- Ensure all environment variables are set
- Try building locally first: `npm run build`

---

## Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Example output: `K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=`

Use this value for `NEXTAUTH_SECRET` in Vercel.
