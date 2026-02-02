import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET sales stats overview
export async function GET() {
  try {
    // Get email sequences stats
    const [totalSequences, activeSequences] = await Promise.all([
      db.emailSequence.count(),
      db.emailSequence.count({ where: { isActive: true } }),
    ]);

    // Get products stats
    const [totalProducts, activeProducts] = await Promise.all([
      db.product.count(),
      db.product.count({ where: { isActive: true } }),
    ]);

    // Get cart abandonment stats
    const [abandonedCarts, recoveredCarts] = await Promise.all([
      db.cartAbandonment.count({ where: { isRecovered: false } }),
      db.cartAbandonment.count({ where: { isRecovered: true } }),
    ]);

    // Get deals stats (for revenue)
    const deals = await db.deal.findMany({
      where: { status: "paid" },
      select: { finalAmount: true },
    });
    const totalRevenue = deals.reduce((sum, deal) => sum + (deal.finalAmount || 0), 0);

    // Get recent email templates count
    const emailTemplatesCount = await db.emailTemplate.count();

    return NextResponse.json({
      sequences: {
        total: totalSequences,
        active: activeSequences,
        emailTemplates: emailTemplatesCount,
      },
      products: {
        total: totalProducts,
        active: activeProducts,
      },
      cart: {
        abandoned: abandonedCarts,
        recovered: recoveredCarts,
        recoveryRate: abandonedCarts > 0
          ? Math.round((recoveredCarts / (abandonedCarts + recoveredCarts)) * 100)
          : 0,
      },
      revenue: {
        total: totalRevenue,
        deals: deals.length,
      },
    });
  } catch (error) {
    console.error("Error fetching sales stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales stats" },
      { status: 500 }
    );
  }
}
