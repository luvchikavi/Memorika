import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST pause/resume recurring payment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body; // "pause" or "resume"

    const subscription = await db.recurringPayment.findUnique({
      where: { id },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Recurring payment not found" },
        { status: 404 }
      );
    }

    if (action === "pause") {
      if (subscription.status !== "active") {
        return NextResponse.json(
          { error: "Can only pause active subscriptions" },
          { status: 400 }
        );
      }

      const updated = await db.recurringPayment.update({
        where: { id },
        data: { status: "paused" },
        include: {
          contact: true,
          product: true,
        },
      });

      return NextResponse.json(updated);
    } else if (action === "resume") {
      if (subscription.status !== "paused") {
        return NextResponse.json(
          { error: "Can only resume paused subscriptions" },
          { status: 400 }
        );
      }

      // Recalculate next billing date from today
      const nextBillingDate = new Date();

      const updated = await db.recurringPayment.update({
        where: { id },
        data: {
          status: "active",
          nextBillingDate,
        },
        include: {
          contact: true,
          product: true,
        },
      });

      return NextResponse.json(updated);
    } else if (action === "cancel") {
      const updated = await db.recurringPayment.update({
        where: { id },
        data: { status: "cancelled" },
        include: {
          contact: true,
          product: true,
        },
      });

      return NextResponse.json(updated);
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'pause', 'resume', or 'cancel'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating subscription status:", error);
    return NextResponse.json(
      { error: "Failed to update subscription status" },
      { status: 500 }
    );
  }
}
