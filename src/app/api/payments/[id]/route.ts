import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET single payment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const payment = await db.payment.findUnique({
      where: { id },
      include: {
        contact: true,
        deal: {
          include: {
            product: true,
          },
        },
        invoice: true,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error fetching payment:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment" },
      { status: 500 }
    );
  }
}

// PUT update payment
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { notes, status } = body;

    const existingPayment = await db.payment.findUnique({
      where: { id },
    });

    if (!existingPayment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, any> = {};
    if (notes !== undefined) updateData.notes = notes || null;
    if (status !== undefined) {
      updateData.status = status;
      if (status === "completed" && existingPayment.status !== "completed") {
        updateData.completedAt = new Date();
      }
    }

    const payment = await db.payment.update({
      where: { id },
      data: updateData,
      include: {
        contact: true,
        deal: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json(
      { error: "Failed to update payment" },
      { status: 500 }
    );
  }
}

// DELETE payment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existingPayment = await db.payment.findUnique({
      where: { id },
    });

    if (!existingPayment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    // Don't allow deleting completed payments - they should be refunded instead
    if (existingPayment.status === "completed") {
      return NextResponse.json(
        { error: "Cannot delete completed payments. Use refund instead." },
        { status: 400 }
      );
    }

    await db.payment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting payment:", error);
    return NextResponse.json(
      { error: "Failed to delete payment" },
      { status: 500 }
    );
  }
}
