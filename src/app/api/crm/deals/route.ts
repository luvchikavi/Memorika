import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all deals with contact and product info
export async function GET(request: NextRequest) {
  try {
    const deals = await db.deal.findMany({
      include: {
        contact: true,
        product: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(deals);
  } catch (error) {
    console.error("Error fetching deals:", error);
    return NextResponse.json(
      { error: "Failed to fetch deals" },
      { status: 500 }
    );
  }
}

// POST create new deal
export async function POST(request: NextRequest) {
  try {
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

    if (!contactId || !productId || amount === undefined) {
      return NextResponse.json(
        { error: "contactId, productId, and amount are required" },
        { status: 400 }
      );
    }

    const finalAmount = amount - (discount || 0);

    const deal = await db.deal.create({
      data: {
        contactId,
        productId,
        status: status || "pending",
        amount,
        currency: currency || "ILS",
        discount: discount || 0,
        finalAmount,
        paymentMethod: paymentMethod || null,
        paymentRef: paymentRef || null,
        notes: notes || null,
        paidAt: status === "paid" ? new Date() : null,
      },
      include: {
        contact: true,
        product: true,
      },
    });

    return NextResponse.json(deal, { status: 201 });
  } catch (error) {
    console.error("Error creating deal:", error);
    return NextResponse.json(
      { error: "Failed to create deal" },
      { status: 500 }
    );
  }
}

// PATCH update deal status (for Kanban drag & drop)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 }
      );
    }

    const deal = await db.deal.update({
      where: { id },
      data: {
        status,
        paidAt: status === "paid" ? new Date() : null,
      },
      include: {
        contact: true,
        product: true,
      },
    });

    return NextResponse.json(deal);
  } catch (error) {
    console.error("Error updating deal status:", error);
    return NextResponse.json(
      { error: "Failed to update deal" },
      { status: 500 }
    );
  }
}
