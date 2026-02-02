import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all payment plans
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

    const plans = await db.paymentPlan.findMany({
      where,
      include: {
        contact: true,
        deal: {
          include: {
            product: true,
          },
        },
        payments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error fetching payment plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment plans" },
      { status: 500 }
    );
  }
}

// POST create payment plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      dealId,
      contactId,
      totalAmount,
      currency,
      numberOfPayments,
      paymentFrequency,
      startDate,
      paymentMethod,
      gateway,
    } = body;

    if (!dealId || !contactId || totalAmount === undefined || !numberOfPayments) {
      return NextResponse.json(
        { error: "dealId, contactId, totalAmount, and numberOfPayments are required" },
        { status: 400 }
      );
    }

    // Validate the deal exists
    const deal = await db.deal.findUnique({
      where: { id: dealId },
    });

    if (!deal) {
      return NextResponse.json(
        { error: "Deal not found" },
        { status: 404 }
      );
    }

    // Calculate next payment date
    const start = new Date(startDate || Date.now());
    const nextPaymentDate = new Date(start);

    const plan = await db.paymentPlan.create({
      data: {
        dealId,
        contactId,
        totalAmount,
        currency: currency || "ILS",
        numberOfPayments,
        paymentFrequency: paymentFrequency || "monthly",
        startDate: start,
        nextPaymentDate,
        status: "active",
        paymentMethod: paymentMethod || null,
        gateway: gateway || null,
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

    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Error creating payment plan:", error);
    return NextResponse.json(
      { error: "Failed to create payment plan" },
      { status: 500 }
    );
  }
}
