# Memorika CRM - Development Plan

## Completed Tasks

### Task 1-11: Core CRM Foundation
- Contact management with tags and segmentation
- Lead tracking with Kanban board
- Sales flow and products
- Social media messaging (WhatsApp, Facebook, Instagram)
- Admin dashboard structure

### Task 12: Payment System Implementation ✅
Comprehensive payment system for Israeli market:
- **Gateways**: Tranzila, CardCom, PayPlus, Morning, Bit, PayBox
- **Features**: Credit card processing, bank transfers, cash payments
- **Invoicing**: Hebrew tax invoices with 17% VAT
- **Payment Plans**: Installment tracking
- **Subscriptions**: Recurring payments with MRR tracking
- **Reminders**: Payment due notifications

---

## Pending Tasks

### Task 13: Campaign Management System
Build a comprehensive campaign management feature for marketing automation.

**Database Models:**
- Campaign (name, type, status, startDate, endDate, budget, targetAudience)
- CampaignStep (order, type, delay, content, conditions)
- CampaignContact (campaignId, contactId, status, currentStep, enteredAt, completedAt)
- CampaignMetrics (opens, clicks, conversions, revenue)

**Campaign Types:**
- Email drip campaigns
- WhatsApp sequences
- SMS campaigns
- Multi-channel campaigns

**Features:**
- Visual campaign builder with drag-and-drop steps
- Audience segmentation (by tags, type, purchase history, engagement)
- A/B testing support
- Trigger-based automation (new lead, purchase, abandoned cart, birthday)
- Campaign scheduling and throttling
- Real-time analytics and reporting
- UTM tracking integration

**Admin UI Pages:**
- `/admin/campaigns` - Campaign list with status filters
- `/admin/campaigns/new` - Campaign builder
- `/admin/campaigns/[id]` - Campaign detail with analytics
- `/admin/campaigns/[id]/edit` - Edit campaign

**API Routes:**
- `/api/campaigns` - CRUD operations
- `/api/campaigns/[id]/start` - Start campaign
- `/api/campaigns/[id]/pause` - Pause campaign
- `/api/campaigns/[id]/stats` - Get campaign statistics
- `/api/campaigns/process` - Cron endpoint for processing steps

---

### Task 14: Smart Dashboard with AI Insights
Build an intelligent dashboard for Keren with actionable insights.

**Dashboard Sections:**

#### 1. Priority Tasks Today
- Follow-ups due today
- Overdue payments to collect
- Hot leads requiring attention
- Expiring payment plans
- Upcoming renewals

#### 2. Smart Alerts
- Leads going cold (no activity in X days)
- Deals stuck in pipeline
- Failed payments requiring action
- Low engagement contacts
- Unusual activity patterns

#### 3. Quick Stats Cards
- Today's revenue vs yesterday
- New leads this week
- Conversion rate trend
- Active campaigns performance
- MRR changes

#### 4. AI Suggestions
- Best time to contact leads (based on past engagement)
- Recommended follow-up actions
- Upsell opportunities
- At-risk customers to retain
- Content suggestions based on engagement

#### 5. Activity Feed
- Recent payments received
- New leads/contacts
- Campaign completions
- Important status changes

**Technical Implementation:**
- Real-time data aggregation
- Scoring algorithms for prioritization
- Notification system for critical alerts
- Customizable dashboard widgets
- Mobile-responsive design

**Admin UI:**
- `/admin` - Main smart dashboard (replace current overview)
- Widget configuration modal
- Alert preferences settings

---

### Task 15: Buy Domain memorika.co.il
Purchase and configure the domain www.memorika.co.il

**Steps:**
1. Purchase domain from Israeli registrar (recommended: isoc.org.il or domains.co.il)
2. Configure DNS settings
3. Set up SSL certificate
4. Configure domain for production deployment
5. Set up email forwarding (optional: info@memorika.co.il)

**DNS Records to Configure:**
- A record pointing to Vercel
- CNAME for www subdomain
- TXT records for domain verification
- MX records if email needed

**Notes:**
- .co.il domains require Israeli business registration
- Consider also securing memorika.com if available

---

### Task 16: Railway + Vercel Deployment Setup
Set up production deployment infrastructure with proper separation of concerns.

**Architecture:**
- Frontend: Vercel (Next.js)
- Backend API: Vercel API routes
- Database: Railway PostgreSQL (migrate from SQLite)

**Vercel Setup:**
1. Connect GitHub repo to Vercel
2. Configure build settings for Next.js
3. Set environment variables
4. Configure custom domain (memorika.co.il)
5. Set up preview deployments for PRs

**Railway Setup:**
1. Create Railway project
2. Add PostgreSQL database
3. Configure environment variables
4. Set up automatic deployments from main branch

**Database Migration:**
1. Update Prisma schema for PostgreSQL
2. Create migration scripts
3. Set up DATABASE_URL for production
4. Configure connection pooling (PgBouncer)

**CORS Configuration:**
- Configure allowed origins for production domain
- Set up proper headers for API routes
- Handle credentials for authenticated requests

**Environment Variables:**
```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://memorika.co.il
NEXTAUTH_SECRET=...
NEXT_PUBLIC_API_URL=...
```

**Files to Create/Modify:**
- `vercel.json` - Vercel configuration
- `railway.json` - Railway configuration
- `next.config.js` - Update for production
- `middleware.ts` - CORS handling
- `prisma/schema.prisma` - PostgreSQL provider

**CI/CD Pipeline:**
- Automatic deployments on push to main
- Preview deployments for pull requests
- Database migrations on deploy
- Health checks and monitoring

---

## Recommended Implementation Order

1. **Task 16** (Deployment) - Set up infrastructure first
2. **Task 15** (Domain) - Can be done in parallel with Task 16
3. **Task 14** (Dashboard) - Core feature for Keren's daily use
4. **Task 13** (Campaigns) - Advanced marketing automation

---

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: Prisma ORM (SQLite dev → PostgreSQL prod)
- **UI**: Tailwind CSS, Hebrew RTL support
- **Payments**: Israeli gateways (Tranzila, PayPlus, etc.)
- **Deployment**: Vercel (frontend) + Railway (database)
- **Domain**: memorika.co.il

---

## Repository

GitHub: https://github.com/luvchikavi/Memorika.git
