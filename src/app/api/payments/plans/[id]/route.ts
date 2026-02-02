import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET single payment plan
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const plan = await db.paymentPlan.findUnique({
      where: { id },
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
          include: {
            invoice: true,
          },
        },
      },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Payment plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error fetching payment plan:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment plan" },
      { status: 500 }
    );
  }
}

// PUT update payment plan
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      status,
      paymentMethod,
      gateway,
      savedCardToken,
      nextPaymentDate,
    } = body;

    const existingPlan = await db.paymentPlan.findUnique({
      where: { id },
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: "Payment plan not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, any> = {};
    if (status !== undefined) {
      updateData.status = status;
      if (status === "completed" && existingPlan.status !== "completed") {
        updateData.completedAt = new Date();
      }
    }
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod || null;
    if (gateway !== undefined) updateData.gateway = gateway || null;
    if (savedCardToken !== undefined) updateData.savedCardToken = savedCardToken || null;
    if (nextPaymentDate !== undefined) {
      updateData.nextPaymentDate = nextPaymentDate ? new Date(nextPaymentDate) : null;
    }

    const plan = await db.paymentPlan.update({
      where: { id },
      data: updateData,
      include: {
        contact: true,
        deal: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error updating payment plan:", error);
    return NextResponse.json(
      { error: "Failed to update payment plan" },
      { status: 500 }
    );
  }
}

// DELETE payment plan
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existingPlan = await db.paymentPlan.findUnique({
      where: { id },
      include: {
        payments: true,
      },
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: "Payment plan not found" },
        { status: 404 }
      );
    }

    // Don't allow deleting plans with payments
    if (existingPlan.payments.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete payment plan with existing payments. Cancel it instead." },
        { status: 400 }
      );
    }

    await db.paymentPlan.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting payment plan:", error);
    return NextResponse.json(
      { error: "Failed to delete payment plan" },
      { status: 500 }
    );
  }
}

// PATCH - Record a payment for the plan
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { amount, paymentMethod, transactionId, notes } = body;

    const plan = await db.paymentPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Payment plan not found" },
        { status: 404 }
      );
    }

    if (plan.status !== "active") {
      return NextResponse.json(
        { error: "Payment plan is not active" },
        { status: 400 }
      );
    }

    // Calculate expected installment amount
    const installmentAmount = amount || plan.totalAmount / plan.numberOfPayments;

    // Create the payment
    const payment = await db.payment.create({
      data: {
        dealId: plan.dealId,
        contactId: plan.contactId,
        amount: installmentAmount,
        currency: plan.currency,
        paymentMethod: paymentMethod || plan.paymentMethod || "credit_card",
        gateway: plan.gateway,
        status: "completed",
        transactionId: transactionId || `PLAN-${plan.id}-${plan.paidInstallments + 1}`,
        notes: notes || `תשלום ${plan.paidInstallments + 1} מתוך ${plan.numberOfPayments}`,
        completedAt: new Date(),
        paymentPlanId: id,
      },
    });

    // Update the plan
    const newPaidAmount = plan.paidAmount + installmentAmount;
    const newPaidInstallments = plan.paidInstallments + 1;
    const isCompleted = newPaidInstallments >= plan.numberOfPayments;

    // Calculate next payment date
    let nextPaymentDate: Date | null = null;
    if (!isCompleted) {
      nextPaymentDate = new Date(plan.nextPaymentDate || Date.now());
      switch (plan.paymentFrequency) {
        case "weekly":
          nextPaymentDate.setDate(nextPaymentDate.getDate() + 7);
          break;
        case "biweekly":
          nextPaymentDate.setDate(nextPaymentDate.getDate() + 14);
          break;
        case "monthly":
        default:
          nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
          break;
      }
    }

    const updatedPlan = await db.paymentPlan.update({
      where: { id },
      data: {
        paidAmount: newPaidAmount,
        paidInstallments: newPaidInstallments,
        nextPaymentDate,
        status: isCompleted ? "completed" : "active",
        completedAt: isCompleted ? new Date() : null,
      },
      include: {
        contact: true,
        deal: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });

    // Update the deal
    await db.deal.update({
      where: { id: plan.dealId },
      data: {
        paidAmount: {
          increment: installmentAmount,
        },
        status: isCompleted ? "paid" : "partially_paid",
        paidAt: isCompleted ? new Date() : null,
      },
    });

    return NextResponse.json({
      plan: updatedPlan,
      payment,
    });
  } catch (error) {
    console.error("Error recording plan payment:", error);
    return NextResponse.json(
      { error: "Failed to record payment" },
      { status: 500 }
    );
  }
}
