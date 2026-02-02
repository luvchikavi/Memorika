import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET single deal
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deal = await db.deal.findUnique({
      where: { id },
      include: {
        contact: true,
        product: true,
      },
    });

    if (!deal) {
      return NextResponse.json(
        { error: "Deal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(deal);
  } catch (error) {
    console.error("Error fetching deal:", error);
    return NextResponse.json(
      { error: "Failed to fetch deal" },
      { status: 500 }
    );
  }
}

// PUT update deal
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      contactId,
      productId,
      status,
      amount,
      currency,
      discount,
      paymentMethod,
      paymentRef,
      notes,
    } = body;

    // Check if deal exists
    const existingDeal = await db.deal.findUnique({
      where: { id },
    });

    if (!existingDeal) {
      return NextResponse.json(
        { error: "Deal not found" },
        { status: 404 }
      );
    }

    // Build update data only for provided fields
    const updateData: Record<string, any> = {};

    if (contactId !== undefined) updateData.contactId = contactId;
    if (productId !== undefined) updateData.productId = productId;
    if (status !== undefined) {
      updateData.status = status;
      if (status === "paid" && existingDeal.status !== "paid") {
        updateData.paidAt = new Date();
      }
    }
    if (amount !== undefined) {
      updateData.amount = amount;
      // Recalculate finalAmount
      const newDiscount = discount !== undefined ? discount : existingDeal.discount;
      updateData.finalAmount = amount - newDiscount;
    }
    if (currency !== undefined) updateData.currency = currency;
    if (discount !== undefined) {
      updateData.discount = discount;
      // Recalculate finalAmount
      const newAmount = amount !== undefined ? amount : existingDeal.amount;
      updateData.finalAmount = newAmount - discount;
    }
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod || null;
    if (paymentRef !== undefined) updateData.paymentRef = paymentRef || null;
    if (notes !== undefined) updateData.notes = notes || null;

    const deal = await db.deal.update({
      where: { id },
      data: updateData,
      include: {
        contact: true,
        product: true,
      },
    });

    return NextResponse.json(deal);
  } catch (error) {
    console.error("Error updating deal:", error);
    return NextResponse.json(
      { error: "Failed to update deal" },
      { status: 500 }
    );
  }
}

// DELETE deal
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if deal exists
    const existingDeal = await db.deal.findUnique({
      where: { id },
    });

    if (!existingDeal) {
      return NextResponse.json(
        { error: "Deal not found" },
        { status: 404 }
      );
    }

    await db.deal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting deal:", error);
    return NextResponse.json(
      { error: "Failed to delete deal" },
      { status: 500 }
    );
  }
}
