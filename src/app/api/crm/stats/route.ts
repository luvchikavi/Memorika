import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Get total contacts
    const totalContacts = await db.contact.count();

    // Get contacts by type (simplified query)
    const contactsByType = await db.contact.groupBy({
      by: ["type"],
      _count: {
        _all: true,
      },
    });

    // Get contacts by status
    const contactsByStatus = await db.contact.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    });

    // Get total leads
    const totalLeads = await db.lead.count();

    // Get leads by status
    const leadsByStatus = await db.lead.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    });

    // Get active leads (not converted or lost)
    const activeLeads = await db.lead.count({
      where: {
        status: {
          notIn: ["converted", "lost"],
        },
      },
    });

    // Get total deals and revenue
    const deals = await db.deal.findMany({
      where: {
        status: "paid",
      },
    });
    const totalDeals = deals.length;
    const totalRevenue = deals.reduce((sum, deal) => sum + deal.finalAmount, 0);

    // Get this month's deals
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyDeals = await db.deal.findMany({
      where: {
        status: "paid",
        paidAt: {
          gte: startOfMonth,
        },
      },
    });
    const monthlyDealsCount = monthlyDeals.length;
    const monthlyRevenue = monthlyDeals.reduce((sum, deal) => sum + deal.finalAmount, 0);

    // Get recent contacts (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentContacts = await db.contact.count({
      where: {
        createdAt: {
          gte: weekAgo,
        },
      },
    });

    return NextResponse.json({
      contacts: {
        total: totalContacts,
        byType: contactsByType.reduce((acc, item) => {
          acc[item.type || "other"] = item._count._all;
          return acc;
        }, {} as Record<string, number>),
        byStatus: contactsByStatus.reduce((acc, item) => {
          acc[item.status] = item._count._all;
          return acc;
        }, {} as Record<string, number>),
        recentWeek: recentContacts,
      },
      leads: {
        total: totalLeads,
        active: activeLeads,
        byStatus: leadsByStatus.reduce((acc, item) => {
          acc[item.status] = item._count._all;
          return acc;
        }, {} as Record<string, number>),
      },
      deals: {
        total: totalDeals,
        monthlyCount: monthlyDealsCount,
        totalRevenue,
        monthlyRevenue,
      },
    });
  } catch (error) {
    console.error("Error fetching CRM stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
