import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET single recurring payment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const subscription = await db.recurringPayment.findUnique({
      where: { id },
      include: {
        contact: true,
        product: true,
        payments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Recurring payment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Error fetching recurring payment:", error);
    return NextResponse.json(
      { error: "Failed to fetch recurring payment" },
      { status: 500 }
    );
  }
}

// PUT update recurring payment
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      amount,
      billingCycle,
      status,
      paymentMethod,
      gateway,
      savedCardToken,
      nextBillingDate,
    } = body;

    const existingSubscription = await db.recurringPayment.findUnique({
      where: { id },
    });

    if (!existingSubscription) {
      return NextResponse.json(
        { error: "Recurring payment not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name;
    if (amount !== undefined) updateData.amount = amount;
    if (billingCycle !== undefined) updateData.billingCycle = billingCycle;
    if (status !== undefined) updateData.status = status;
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
    if (gateway !== undefined) updateData.gateway = gateway || null;
    if (savedCardToken !== undefined) updateData.savedCardToken = savedCardToken || null;
    if (nextBillingDate !== undefined) {
      updateData.nextBillingDate = nextBillingDate ? new Date(nextBillingDate) : null;
    }

    const subscription = await db.recurringPayment.update({
      where: { id },
      data: updateData,
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
    });

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Error updating recurring payment:", error);
    return NextResponse.json(
      { error: "Failed to update recurring payment" },
      { status: 500 }
    );
  }
}

// DELETE recurring payment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existingSubscription = await db.recurringPayment.findUnique({
      where: { id },
    });

    if (!existingSubscription) {
      return NextResponse.json(
        { error: "Recurring payment not found" },
        { status: 404 }
      );
    }

    await db.recurringPayment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting recurring payment:", error);
    return NextResponse.json(
      { error: "Failed to delete recurring payment" },
      { status: 500 }
    );
  }
}

// PATCH - Process a payment for the subscription
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { transactionId, notes } = body;

    const subscription = await db.recurringPayment.findUnique({
      where: { id },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Recurring payment not found" },
        { status: 404 }
      );
    }

    if (subscription.status !== "active") {
      return NextResponse.json(
        { error: "Recurring payment is not active" },
        { status: 400 }
      );
    }

    // Create the payment
    const payment = await db.payment.create({
      data: {
        contactId: subscription.contactId,
        amount: subscription.amount,
        currency: subscription.currency,
        paymentMethod: subscription.paymentMethod,
        gateway: subscription.gateway,
        status: "completed",
        transactionId: transactionId || `SUB-${subscription.id}-${subscription.totalCharges + 1}`,
        notes: notes || `תשלום מנוי: ${subscription.name}`,
        completedAt: new Date(),
        recurringPaymentId: id,
      },
    });

    // Calculate next billing date
    let nextBillingDate = new Date(subscription.nextBillingDate || Date.now());
    switch (subscription.billingCycle) {
      case "weekly":
        nextBillingDate.setDate(nextBillingDate.getDate() + 7);
        break;
      case "monthly":
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        break;
      case "quarterly":
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 3);
        break;
      case "yearly":
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
        break;
      default:
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    }

    // Update the subscription
    const updatedSubscription = await db.recurringPayment.update({
      where: { id },
      data: {
        totalCharges: { increment: 1 },
        totalRevenue: { increment: subscription.amount },
        nextBillingDate,
      },
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
    });

    return NextResponse.json({
      subscription: updatedSubscription,
      payment,
    });
  } catch (error) {
    console.error("Error processing subscription payment:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}
