import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET dashboard data with all insights
export async function GET() {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Fetch all data in parallel for performance
    const [
      // Stats
      totalContacts,
      newLeadsThisWeek,
      todayPayments,
      yesterdayPayments,
      monthlyRevenue,
      lastMonthRevenue,
      activeSubscriptions,

      // Priority Tasks
      followUpsDueToday,
      overduePayments,
      hotLeads,
      expiringPlans,

      // Alerts
      coldLeads,
      stuckDeals,
      failedPayments,

      // Activity Feed
      recentPayments,
      recentLeads,
      recentContacts,
    ] = await Promise.all([
      // Total contacts
      db.contact.count(),

      // New leads this week
      db.lead.count({
        where: {
          createdAt: { gte: weekAgo },
        },
      }),

      // Today's payments (revenue)
      db.payment.aggregate({
        where: {
          status: "completed",
          completedAt: { gte: today },
        },
        _sum: { amount: true },
      }),

      // Yesterday's payments
      db.payment.aggregate({
        where: {
          status: "completed",
          completedAt: {
            gte: yesterday,
            lt: today,
          },
        },
        _sum: { amount: true },
      }),

      // Monthly revenue
      db.payment.aggregate({
        where: {
          status: "completed",
          completedAt: { gte: monthAgo },
        },
        _sum: { amount: true },
      }),

      // Last month revenue (for comparison)
      db.payment.aggregate({
        where: {
          status: "completed",
          completedAt: {
            gte: new Date(monthAgo.getTime() - 30 * 24 * 60 * 60 * 1000),
            lt: monthAgo,
          },
        },
        _sum: { amount: true },
      }),

      // Active subscriptions (MRR)
      db.recurringPayment.findMany({
        where: { status: "active" },
        select: { amount: true, billingCycle: true },
      }),

      // Follow-ups due today
      db.lead.findMany({
        where: {
          nextFollowUp: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
          status: { notIn: ["converted", "lost"] },
        },
        include: {
          contact: true,
          product: true,
        },
        take: 10,
      }),

      // Overdue payments (payment plans with missed dates)
      db.paymentPlan.findMany({
        where: {
          status: "active",
          nextPaymentDate: { lt: today },
        },
        include: {
          contact: true,
          deal: { include: { product: true } },
        },
        take: 10,
      }),

      // Hot leads
      db.lead.findMany({
        where: {
          status: "hot",
        },
        include: {
          contact: true,
          product: true,
        },
        orderBy: { updatedAt: "desc" },
        take: 10,
      }),

      // Expiring payment plans (fetch active and filter in JS)
      db.paymentPlan.findMany({
        where: {
          status: "active",
        },
        include: {
          contact: true,
          deal: { include: { product: true } },
        },
      }),

      // Cold leads (no activity in 7+ days)
      db.lead.findMany({
        where: {
          status: { notIn: ["converted", "lost", "cold"] },
          updatedAt: { lt: weekAgo },
        },
        include: {
          contact: true,
          product: true,
        },
        take: 10,
      }),

      // Stuck deals (pending for more than 14 days)
      db.deal.findMany({
        where: {
          status: "pending",
          createdAt: { lt: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000) },
        },
        include: {
          contact: true,
          product: true,
        },
        take: 10,
      }),

      // Failed payments
      db.payment.findMany({
        where: {
          status: "failed",
          createdAt: { gte: weekAgo },
        },
        include: {
          contact: true,
          deal: { include: { product: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),

      // Recent payments (activity feed)
      db.payment.findMany({
        where: { status: "completed" },
        include: {
          contact: true,
          deal: { include: { product: true } },
        },
        orderBy: { completedAt: "desc" },
        take: 10,
      }),

      // Recent leads
      db.lead.findMany({
        include: {
          contact: true,
          product: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),

      // Recent contacts
      db.contact.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    // Filter expiring plans (last payment pending)
    const filteredExpiringPlans = (expiringPlans as any[])
      .filter((plan: any) => plan.paidInstallments >= plan.numberOfPayments - 1)
      .slice(0, 5);

    // Calculate MRR from active subscriptions
    const mrr = activeSubscriptions.reduce((sum, sub) => {
      const multiplier =
        sub.billingCycle === "weekly" ? 4 :
        sub.billingCycle === "quarterly" ? 1/3 :
        sub.billingCycle === "yearly" ? 1/12 : 1;
      return sum + (sub.amount * multiplier);
    }, 0);

    // Calculate conversion rate
    const totalLeads = await db.lead.count();
    const convertedLeads = await db.lead.count({ where: { status: "converted" } });
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    // Generate AI suggestions based on data
    const suggestions = generateSuggestions({
      coldLeads,
      hotLeads,
      overduePayments,
      stuckDeals,
      failedPayments,
      conversionRate,
    });

    // Build activity feed
    const activityFeed = buildActivityFeed({
      recentPayments,
      recentLeads,
      recentContacts,
    });

    return NextResponse.json({
      stats: {
        totalContacts,
        newLeadsThisWeek,
        todayRevenue: todayPayments._sum.amount || 0,
        yesterdayRevenue: yesterdayPayments._sum.amount || 0,
        monthlyRevenue: monthlyRevenue._sum.amount || 0,
        lastMonthRevenue: lastMonthRevenue._sum.amount || 0,
        mrr: Math.round(mrr),
        conversionRate: Math.round(conversionRate * 10) / 10,
        activeSubscriptions: activeSubscriptions.length,
      },
      priorityTasks: {
        followUps: followUpsDueToday,
        overduePayments,
        hotLeads,
        expiringPlans: filteredExpiringPlans,
      },
      alerts: {
        coldLeads,
        stuckDeals,
        failedPayments,
        coldLeadsCount: coldLeads.length,
        stuckDealsCount: stuckDeals.length,
        failedPaymentsCount: failedPayments.length,
      },
      suggestions,
      activityFeed,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

// Generate AI-like suggestions based on data patterns
function generateSuggestions(data: {
  coldLeads: any[];
  hotLeads: any[];
  overduePayments: any[];
  stuckDeals: any[];
  failedPayments: any[];
  conversionRate: number;
}) {
  const suggestions: Array<{
    type: "followup" | "upsell" | "retention" | "action";
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
    action?: string;
    contactId?: string;
  }> = [];

  // High priority: Hot leads need immediate attention
  if (data.hotLeads.length > 0) {
    suggestions.push({
      type: "followup",
      priority: "high",
      title: `${data.hotLeads.length} לידים חמים ממתינים`,
      description: "לידים אלה מוכנים לרכישה. צרי קשר היום!",
      action: "צפייה בלידים חמים",
    });
  }

  // Failed payments need retry
  if (data.failedPayments.length > 0) {
    suggestions.push({
      type: "action",
      priority: "high",
      title: `${data.failedPayments.length} תשלומים נכשלו`,
      description: "יש לפנות ללקוחות לעדכון פרטי תשלום",
      action: "צפייה בתשלומים נכשלים",
    });
  }

  // Overdue payment plans
  if (data.overduePayments.length > 0) {
    suggestions.push({
      type: "action",
      priority: "high",
      title: `${data.overduePayments.length} תשלומים באיחור`,
      description: "יש לגבות תשלומים שעברו את מועד הפירעון",
      action: "צפייה בתשלומים באיחור",
    });
  }

  // Cold leads need re-engagement
  if (data.coldLeads.length > 0) {
    suggestions.push({
      type: "retention",
      priority: "medium",
      title: `${data.coldLeads.length} לידים מתקררים`,
      description: "לידים אלה לא היו פעילים מעל שבוע. שקלי לשלוח הודעה",
      action: "צפייה בלידים קרים",
    });
  }

  // Stuck deals
  if (data.stuckDeals.length > 0) {
    suggestions.push({
      type: "followup",
      priority: "medium",
      title: `${data.stuckDeals.length} עסקאות תקועות`,
      description: "עסקאות אלה ממתינות מעל שבועיים. כדאי לבדוק מה מעכב",
      action: "צפייה בעסקאות",
    });
  }

  // Low conversion rate suggestion
  if (data.conversionRate < 10) {
    suggestions.push({
      type: "action",
      priority: "low",
      title: "שיעור המרה נמוך",
      description: "שקלי לשפר את תהליך המכירה או לבדוק את איכות הלידים",
    });
  }

  // Best time to contact (mock for now - could be enhanced with real analytics)
  suggestions.push({
    type: "followup",
    priority: "low",
    title: "הזמן הטוב ביותר ליצירת קשר",
    description: "על פי נתונים היסטוריים, בין 10:00-12:00 הוא הזמן הטוב ביותר ליצירת קשר",
  });

  return suggestions.slice(0, 6); // Limit to 6 suggestions
}

// Build activity feed from recent events
function buildActivityFeed(data: {
  recentPayments: any[];
  recentLeads: any[];
  recentContacts: any[];
}) {
  const activities: Array<{
    id: string;
    type: "payment" | "lead" | "contact" | "deal";
    title: string;
    description: string;
    timestamp: Date;
    icon: string;
    color: string;
  }> = [];

  // Add payments
  data.recentPayments.forEach((payment) => {
    activities.push({
      id: `payment-${payment.id}`,
      type: "payment",
      title: "תשלום התקבל",
      description: `${payment.contact.firstName} ${payment.contact.lastName} - ₪${payment.amount}`,
      timestamp: payment.completedAt || payment.createdAt,
      icon: "credit-card",
      color: "text-green-500",
    });
  });

  // Add leads
  data.recentLeads.forEach((lead) => {
    activities.push({
      id: `lead-${lead.id}`,
      type: "lead",
      title: "ליד חדש",
      description: `${lead.contact.firstName} ${lead.contact.lastName}${lead.product ? ` - ${lead.product.name}` : ""}`,
      timestamp: lead.createdAt,
      icon: "user-plus",
      color: "text-blue-500",
    });
  });

  // Add contacts
  data.recentContacts.forEach((contact) => {
    activities.push({
      id: `contact-${contact.id}`,
      type: "contact",
      title: "איש קשר חדש",
      description: `${contact.firstName} ${contact.lastName}`,
      timestamp: contact.createdAt,
      icon: "user",
      color: "text-teal-500",
    });
  });

  // Sort by timestamp and limit
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 15);
}
