import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET dashboard data with product-focused insights
export async function GET() {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const lastMonthStart = new Date(monthAgo.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Fetch all data in parallel for performance
    const [
      // Basic Stats
      totalContacts,
      newContactsThisMonth,
      newContactsLastMonth,
      totalLeads,
      convertedLeads,

      // Products
      products,

      // Leads by product
      leadsByProduct,

      // Deals and Revenue
      allDeals,
      completedPayments,

      // Subscriptions
      activeSubscriptions,

      // Priority Tasks
      followUpsDueToday,
      overduePayments,
      hotLeads,

      // Alerts
      coldLeads,
      stuckDeals,
      failedPayments,
    ] = await Promise.all([
      // Total contacts
      db.contact.count(),

      // New contacts this month
      db.contact.count({
        where: { createdAt: { gte: monthAgo } },
      }),

      // New contacts last month
      db.contact.count({
        where: {
          createdAt: { gte: lastMonthStart, lt: monthAgo },
        },
      }),

      // Total leads
      db.lead.count(),

      // Converted leads
      db.lead.count({ where: { status: "converted" } }),

      // All products
      db.product.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      }),

      // Leads grouped by product (this week)
      db.lead.groupBy({
        by: ["productId"],
        where: {
          createdAt: { gte: weekAgo },
          productId: { not: null },
        },
        _count: { id: true },
      }),

      // All deals with product info
      db.deal.findMany({
        include: { product: true },
      }),

      // Completed payments with deal/product info
      db.payment.findMany({
        where: { status: "completed" },
        include: {
          deal: { include: { product: true } },
        },
      }),

      // Active subscriptions (MRR)
      db.recurringPayment.findMany({
        where: { status: "active" },
        include: { product: true },
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
        include: { contact: true, product: true },
        take: 10,
      }),

      // Overdue payments
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
        where: { status: "hot" },
        include: { contact: true, product: true },
        orderBy: { updatedAt: "desc" },
        take: 10,
      }),

      // Cold leads
      db.lead.findMany({
        where: {
          status: { notIn: ["converted", "lost", "cold"] },
          updatedAt: { lt: weekAgo },
        },
        include: { contact: true, product: true },
        take: 10,
      }),

      // Stuck deals
      db.deal.findMany({
        where: {
          status: "pending",
          createdAt: { lt: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000) },
        },
        include: { contact: true, product: true },
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
    ]);

    // Calculate product statistics
    const productStats = products.map((product) => {
      // New leads for this product this week
      const productLeads = leadsByProduct.find((l) => l.productId === product.id);
      const newLeadsThisWeek = productLeads?._count?.id || 0;

      // Deals for this product
      const productDeals = allDeals.filter((d) => d.productId === product.id);
      const totalDeals = productDeals.length;
      const paidDeals = productDeals.filter((d) => d.status === "paid").length;
      const pendingDeals = productDeals.filter((d) => d.status === "pending").length;

      // Revenue from this product
      const productPayments = completedPayments.filter(
        (p) => p.deal?.productId === product.id
      );
      const totalRevenue = productPayments.reduce((sum, p) => sum + p.amount, 0);

      // Conversion rate for this product
      const conversionRate = totalDeals > 0 ? (paidDeals / totalDeals) * 100 : 0;

      return {
        id: product.id,
        name: product.nameHe || product.name,
        category: product.category,
        price: product.price,
        newLeadsThisWeek,
        totalDeals,
        paidDeals,
        pendingDeals,
        totalRevenue,
        conversionRate: Math.round(conversionRate * 10) / 10,
      };
    });

    // Sort by new leads and revenue
    const topProductsByLeads = [...productStats]
      .sort((a, b) => b.newLeadsThisWeek - a.newLeadsThisWeek)
      .slice(0, 5);

    const topProductsByRevenue = [...productStats]
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);

    // Calculate overall stats
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
    const thisMonthRevenue = completedPayments
      .filter((p) => p.completedAt && new Date(p.completedAt) >= monthAgo)
      .reduce((sum, p) => sum + p.amount, 0);

    // MRR calculation
    const mrr = activeSubscriptions.reduce((sum, sub) => {
      const multiplier =
        sub.billingCycle === "weekly" ? 4 :
        sub.billingCycle === "quarterly" ? 1 / 3 :
        sub.billingCycle === "yearly" ? 1 / 12 : 1;
      return sum + sub.amount * multiplier;
    }, 0);

    // Sales funnel stats
    const funnelStats = {
      totalLeads,
      newLeads: leadsByProduct.reduce((sum, l) => sum + (l._count?.id || 0), 0),
      hotLeads: hotLeads.length,
      convertedLeads,
      conversionRate: Math.round(conversionRate * 10) / 10,
    };

    // Revenue by category
    const revenueByCategory: Record<string, number> = {};
    completedPayments.forEach((payment) => {
      const category = payment.deal?.product?.category || "אחר";
      revenueByCategory[category] = (revenueByCategory[category] || 0) + payment.amount;
    });

    // Leads by category this week
    const leadsByCategory: Record<string, number> = {};
    for (const lead of leadsByProduct) {
      if (lead.productId) {
        const product = products.find((p) => p.id === lead.productId);
        const category = product?.category || "אחר";
        leadsByCategory[category] = (leadsByCategory[category] || 0) + (lead._count?.id || 0);
      }
    }

    // Contact growth rate
    const contactGrowthRate = newContactsLastMonth > 0
      ? ((newContactsThisMonth - newContactsLastMonth) / newContactsLastMonth) * 100
      : 0;

    // Generate suggestions
    const suggestions = generateSuggestions({
      productStats,
      funnelStats,
      coldLeads,
      hotLeads,
      overduePayments,
      stuckDeals,
      failedPayments,
    });

    // Filter expiring plans
    const allActivePlans = await db.paymentPlan.findMany({
      where: { status: "active" },
      include: { contact: true, deal: { include: { product: true } } },
    });
    const expiringPlans = allActivePlans
      .filter((plan) => plan.paidInstallments >= plan.numberOfPayments - 1)
      .slice(0, 5);

    return NextResponse.json({
      stats: {
        totalContacts,
        newContactsThisMonth,
        contactGrowthRate: Math.round(contactGrowthRate * 10) / 10,
        totalRevenue,
        thisMonthRevenue,
        mrr: Math.round(mrr),
        activeSubscriptions: activeSubscriptions.length,
        conversionRate: Math.round(conversionRate * 10) / 10,
      },
      funnelStats,
      productStats,
      topProductsByLeads,
      topProductsByRevenue,
      revenueByCategory,
      leadsByCategory,
      priorityTasks: {
        followUps: followUpsDueToday,
        overduePayments,
        hotLeads,
        expiringPlans,
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
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

// Generate suggestions based on data patterns
function generateSuggestions(data: {
  productStats: any[];
  funnelStats: any;
  coldLeads: any[];
  hotLeads: any[];
  overduePayments: any[];
  stuckDeals: any[];
  failedPayments: any[];
}) {
  const suggestions: Array<{
    type: "opportunity" | "action" | "insight" | "warning";
    priority: "high" | "medium" | "low";
    title: string;
    description: string;
  }> = [];

  // Hot leads opportunity
  if (data.hotLeads.length > 0) {
    suggestions.push({
      type: "opportunity",
      priority: "high",
      title: `${data.hotLeads.length} לידים חמים מוכנים לסגירה`,
      description: "לידים אלה הראו עניין גבוה - זה הזמן ליצור קשר!",
    });
  }

  // Products with high leads but low conversion
  const lowConversionProducts = data.productStats.filter(
    (p) => p.newLeadsThisWeek > 2 && p.conversionRate < 20
  );
  if (lowConversionProducts.length > 0) {
    suggestions.push({
      type: "insight",
      priority: "medium",
      title: `${lowConversionProducts.length} מוצרים עם המרה נמוכה`,
      description: "יש עניין במוצרים אלה אבל ההמרה נמוכה - שקלי לבדוק את תהליך המכירה",
    });
  }

  // Top performing product
  const topProduct = data.productStats.sort((a, b) => b.totalRevenue - a.totalRevenue)[0];
  if (topProduct && topProduct.totalRevenue > 0) {
    suggestions.push({
      type: "insight",
      priority: "low",
      title: `${topProduct.name} הוא המוצר המוביל`,
      description: `הכניס ₪${topProduct.totalRevenue.toLocaleString()} - שקלי להגביר שיווק`,
    });
  }

  // Failed payments need attention
  if (data.failedPayments.length > 0) {
    suggestions.push({
      type: "warning",
      priority: "high",
      title: `${data.failedPayments.length} תשלומים נכשלו`,
      description: "יש לפנות ללקוחות לעדכון פרטי תשלום",
    });
  }

  // Overdue payments
  if (data.overduePayments.length > 0) {
    suggestions.push({
      type: "action",
      priority: "high",
      title: `${data.overduePayments.length} תשלומים באיחור`,
      description: "יש לגבות תשלומים שעברו את מועד הפירעון",
    });
  }

  // Cold leads re-engagement
  if (data.coldLeads.length > 5) {
    suggestions.push({
      type: "opportunity",
      priority: "medium",
      title: `${data.coldLeads.length} לידים להחייאה`,
      description: "שלחי קמפיין החייאה ללידים שלא היו פעילים",
    });
  }

  // Low conversion rate warning
  if (data.funnelStats.conversionRate < 15) {
    suggestions.push({
      type: "insight",
      priority: "medium",
      title: "שיעור המרה נמוך מהממוצע",
      description: "שקלי לשפר את תהליך המכירה או את איכות הלידים",
    });
  }

  return suggestions.slice(0, 6);
}
