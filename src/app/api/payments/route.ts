import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all payments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const contactId = searchParams.get("contactId");
    const dealId = searchParams.get("dealId");

    const where: any = {};
    if (status) where.status = status;
    if (contactId) where.contactId = contactId;
    if (dealId) where.dealId = dealId;

    const payments = await db.payment.findMany({
      where,
      include: {
        contact: true,
        deal: {
          include: {
            product: true,
          },
        },
        invoice: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

// POST record a manual payment (cash, bank transfer, etc.)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      dealId,
      contactId,
      amount,
      currency,
      paymentMethod,
      notes,
      transactionId,
    } = body;

    if (!contactId || amount === undefined || !paymentMethod) {
      return NextResponse.json(
        { error: "contactId, amount, and paymentMethod are required" },
        { status: 400 }
      );
    }

    // Create the payment record
    const payment = await db.payment.create({
      data: {
        dealId: dealId || null,
        contactId,
        amount,
        currency: currency || "ILS",
        paymentMethod,
        status: "completed", // Manual payments are already completed
        transactionId: transactionId || `MANUAL-${Date.now()}`,
        notes: notes || null,
        completedAt: new Date(),
      },
      include: {
        contact: true,
        deal: {
          include: {
            product: true,
          },
        },
      },
    });

    // Update deal if associated
    if (dealId) {
      const deal = await db.deal.findUnique({ where: { id: dealId } });
      if (deal) {
        const newPaidAmount = (deal.paidAmount || 0) + amount;
        const newStatus = newPaidAmount >= deal.finalAmount ? "paid" : "partially_paid";

        await db.deal.update({
          where: { id: dealId },
          data: {
            paidAmount: newPaidAmount,
            status: newStatus,
            paidAt: newStatus === "paid" ? new Date() : null,
          },
        });
      }
    }

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
