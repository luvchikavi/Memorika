"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Target,
  Rocket,
  Palette,
  Calendar,
  ChevronLeft,
  Download,
  Eye,
} from "lucide-react";

interface Document {
  id: string;
  title: string;
  titleHe: string;
  description: string;
  icon: typeof FileText;
  category: "strategy" | "brand" | "marketing";
  lastUpdated: string;
  content: string;
}

const documents: Document[] = [
  {
    id: "project-plan",
    title: "Project Master Plan",
    titleHe: "תוכנית אב לפרויקט",
    description: "תוכנית מלאה כולל שלבים, טכנולוגיות, ותקציב",
    icon: FileText,
    category: "strategy",
    lastUpdated: "ינואר 2026",
    content: `# Memorika - Project Master Plan
## מותג לטיפול בטראומה מבוסס NLP מתקדם

---

## Executive Summary
**Brand:** Memorika
**Founder:** קרן מלניאק
**Method:** טיפול בטראומה מבוסס NLP - שיטת "ניקוי זכרונות מפתח"
**Target Audience:** קהל ישראלי - מטפלים, פסיכולוגים, קואצ'רים
**Primary Product:** קורסים של 3 ימים

---

## Phase Breakdown

### Phase 1: Foundation & Branding (שבועות 1-2)
- Brand Strategy Document
- Logo Design
- Design System
- Brand Guidelines

### Phase 2: Technical Infrastructure (שבועות 2-3)
- Domain & Hosting Setup
- Database Design
- Authentication System
- Backend API
- Payment Integration

### Phase 3: Website Development (שבועות 3-5)
- Landing Page
- About Page
- Courses Page
- Checkout Flow
- Admin Dashboard
- Task Tracker

### Phase 4: Marketing Setup (שבועות 5-6)
- Go-to-Market Strategy
- Content Strategy
- Social Media Setup
- Email Marketing Setup
- SEO Optimization

### Phase 5: Launch (שבוע 7)
- Testing & QA
- Soft Launch
- Official Launch
- Monitoring Setup

---

## Recommended Technology Stack

### Frontend
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- UI Components: shadcn/ui

### Backend
- Runtime: Node.js
- Framework: Next.js API Routes
- ORM: Prisma
- Authentication: NextAuth.js

### Database
- Primary DB: PostgreSQL (via Supabase)
- File Storage: Supabase Storage

### Payments
- Primary: PayPlus (Israeli)

### Deployment
- Hosting: Vercel
- Domain: memorika.co.il`,
  },
  {
    id: "brand-strategy",
    title: "Brand Strategy",
    titleHe: "אסטרטגיית מותג",
    description: "ערכי מותג, קהל יעד, USP, וזהות ויזואלית",
    icon: Palette,
    category: "brand",
    lastUpdated: "ינואר 2026",
    content: `# Memorika - Brand Strategy Document
## אסטרטגיית מותג

---

## Brand Foundation

### Vision (חזון)
להנגיש את שיטת "ניקוי זכרונות מפתח" למטפלים בישראל ובעולם, ולאפשר לאנשים לשחרר טראומות ולחיות חיים מלאים יותר.

### Mission (ייעוד)
להכשיר מטפלים בשיטה ייחודית ומוכחת לטיפול בטראומה, המבוססת על NLP מתקדם וניקוי זכרונות מפתח.

### Core Values (ערכי ליבה)
- **מקצועיות** - גישה מבוססת ניסיון קליני של 14 שנים
- **אמפתיה** - הבנה עמוקה של הכאב והמסע של המטופל
- **העצמה** - מתן כלים למטפלים ולמטופלים להשתחרר
- **חדשנות** - שיטה ייחודית שמתפתחת ומשתכללת
- **נגישות** - הפיכת הידע לזמין ומובן

---

## Target Audience

### Primary: מטפלים ואנשי מקצוע
- מטפלי NLP פעילים
- פסיכולוגים
- עובדים סוציאליים
- קואצ'רים
- מטפלים רגשיים

**Demographics:** גיל 28-55, רוב נשים (~75%), השכלה אקדמית/מקצועית

---

## Unique Selling Proposition (USP)

> **"ניקוי זכרונות מפתח - השיטה הישראלית המקורית לשחרור טראומה"**

### Supporting Points:
1. שיטה מקורית - פותחה ע"י קרן מלניאק
2. 14 שנות ניסיון - לא תיאוריה, שיטה שעובדת בשטח
3. ממוקדת ויעילה - קורס אינטנסיבי של 3 ימים
4. תוצאות מוכחות - מאות מטפלים ואלפי מטופלים

---

## Visual Identity

### Color Palette
- **Deep Teal:** #0D5C63 (ראשי)
- **Warm Gold:** #D4A853 (אקסנט)
- **Soft Cream:** #FDF8F3 (רקע)
- **Navy:** #1A365D (טקסט)

### Typography
- **עברית:** Heebo
- **אנגלית:** Poppins`,
  },
  {
    id: "go-to-market",
    title: "Go-to-Market Strategy",
    titleHe: "אסטרטגיית כניסה לשוק",
    description: "תוכנית שיווק, ערוצים, תקציב, ו-KPIs",
    icon: Rocket,
    category: "marketing",
    lastUpdated: "ינואר 2026",
    content: `# Memorika - Go-to-Market Strategy
## אסטרטגיית כניסה לשוק

---

## The Opportunity
שוק הטיפול בטראומה בישראל גדל משמעותית. יותר ויותר מטפלים מחפשים כלים אפקטיביים.

## The Product
קורס אינטנסיבי של 3 ימים בשיטת "ניקוי זכרונות מפתח"

## The Goal
מילוי מחזורי קורסים באופן עקבי + בניית מותג מוביל בתחום

---

## Marketing Channels Strategy

### Primary Channels (80% of effort)

#### 1. Facebook & Instagram
- תוכן אורגני (3-5 פוסטים בשבוע)
- סיפורי הצלחה
- טיפים מקצועיים
- לייבים עם קרן
- קמפיינים ממומנים

#### 2. Email Marketing
- Welcome sequence (5 מיילים)
- Newsletter שבועי/דו-שבועי
- קמפיינים לקורסים

#### 3. Free Webinars
- וובינר חודשי על טראומה/טכניקות
- Q&A עם קרן
- הצעת קורס בסוף

---

## Pricing Strategy

### Course Pricing
- **Early Bird:** ₪2,800 (2 שבועות לפני)
- **Regular:** ₪3,500
- **סופרוויז'ן:** ₪400-500 לפגישה

---

## Success Metrics (KPIs)

### Website KPIs
- Monthly visitors: 500 → 3,000
- Lead conversion: 3% → 5%

### Business KPIs (Year 1)
- Course registrations: 200
- Revenue: ₪600,000+
- Customer satisfaction: 4.7/5
- Referral rate: 25%`,
  },
  {
    id: "content-calendar",
    title: "Content Calendar",
    titleHe: "לוח תוכן",
    description: "תוכנית תוכן שבועית וחודשית",
    icon: Calendar,
    category: "marketing",
    lastUpdated: "ינואר 2026",
    content: `# Content Calendar Framework
## לוח תוכן

---

## Content Pillars (נושאי תוכן)

| Pillar | % | דוגמאות |
|--------|---|---------|
| **Educational** | 40% | מה זה טראומה, איך מזהים, טכניקות |
| **Proof** | 25% | סיפורי הצלחה, המלצות, מקרי בוחן |
| **Personal** | 20% | הסיפור של קרן, מאחורי הקלעים |
| **Promotional** | 15% | קורסים, הרשמה, הנחות |

---

## Weekly Schedule

| יום | Platform | Content Type |
|-----|----------|--------------|
| ראשון | Instagram | טיפ מקצועי (Reel/Story) |
| שני | Facebook | פוסט חינוכי |
| שלישי | Email | ניוזלטר (כל שבועיים) |
| רביעי | Instagram | סיפור הצלחה/המלצה |
| חמישי | LinkedIn | מאמר מקצועי |
| שישי | Facebook/IG | תוכן אישי + שבת שלום |

---

## Monthly Themes (Example)

### חודש 1: השקה
- שבוע 1: הכרות - "מי אני ומה Memorika"
- שבוע 2: השיטה - "מה זה ניקוי זכרונות מפתח"
- שבוע 3: הוכחות - סיפורי הצלחה
- שבוע 4: קריאה לפעולה - הקורס הקרוב

### חודש 2: חינוך
- שבוע 1: מה זה טראומה
- שבוע 2: איך טראומה משפיעה
- שבוע 3: למה שיטות רגילות לא עובדות
- שבוע 4: איך ניקוי זכרונות עובד`,
  },
];

const categories = [
  { id: "all", label: "הכל" },
  { id: "strategy", label: "אסטרטגיה" },
  { id: "brand", label: "מיתוג" },
  { id: "marketing", label: "שיווק" },
];

export default function DocumentsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const filteredDocs =
    selectedCategory === "all"
      ? documents
      : documents.filter((d) => d.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy">מסמכים אסטרטגיים</h1>
        <p className="text-navy/60">כל המסמכים החשובים לפרויקט Memorika</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? "secondary" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Document View */}
      {selectedDoc ? (
        <Card>
          <CardHeader className="border-b border-blush">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDoc(null)}
                >
                  <ChevronLeft className="w-4 h-4" />
                  חזרה
                </Button>
                <div>
                  <CardTitle>{selectedDoc.titleHe}</CardTitle>
                  <p className="text-sm text-navy/60">{selectedDoc.title}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4" />
                הורדה
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="prose max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {selectedDoc.content}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => (
            <Card
              key={doc.id}
              className="hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => setSelectedDoc(doc)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center group-hover:bg-teal/20 transition-colors">
                    <doc.icon className="w-6 h-6 text-teal" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-navy group-hover:text-teal transition-colors">
                      {doc.titleHe}
                    </h3>
                    <p className="text-sm text-navy/60 mb-2">{doc.description}</p>
                    <p className="text-xs text-navy/40">
                      עודכן לאחרונה: {doc.lastUpdated}
                    </p>
                  </div>
                  <Eye className="w-5 h-5 text-navy/30 group-hover:text-teal transition-colors" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
