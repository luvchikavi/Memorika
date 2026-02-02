import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all recurring payments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const contactId = searchParams.get("contactId");

    const where: any = {};
    if (status) where.status = status;
    if (contactId) where.contactId = contactId;

    const subscriptions = await db.recurringPayment.findMany({
      where,
      include: {
        contact: true,
        product: true,
        payments: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("Error fetching recurring payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch recurring payments" },
      { status: 500 }
    );
  }
}

// POST create recurring payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      contactId,
      productId,
      name,
      amount,
      currency,
      billingCycle,
      startDate,
      paymentMethod,
      gateway,
    } = body;

    if (!contactId || !name || amount === undefined || !paymentMethod) {
      return NextResponse.json(
        { error: "contactId, name, amount, and paymentMethod are required" },
        { status: 400 }
      );
    }

    // Calculate next billing date
    const start = new Date(startDate || Date.now());
    const nextBillingDate = new Date(start);

    const subscription = await db.recurringPayment.create({
      data: {
        contactId,
        productId: productId || null,
        name,
        amount,
        currency: currency || "ILS",
        billingCycle: billingCycle || "monthly",
        startDate: start,
        nextBillingDate,
        status: "active",
        paymentMethod,
        gateway: gateway || null,
      },
      include: {
        contact: true,
        product: true,
      },
    });

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error("Error creating recurring payment:", error);
    return NextResponse.json(
      { error: "Failed to create recurring payment" },
      { status: 500 }
    );
  }
}
