import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET single abandoned cart
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cart = await db.cartAbandonment.findUnique({
      where: { id },
      include: {
        product: true,
      },
    });

    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// PATCH update cart (mark as recovered, increment emails sent)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isRecovered, incrementEmailsSent } = body;

    const updateData: any = {};

    if (isRecovered !== undefined) {
      updateData.isRecovered = isRecovered;
      if (isRecovered) {
        updateData.recoveredAt = new Date();
      }
    }

    if (incrementEmailsSent) {
      updateData.recoveryEmailsSent = {
        increment: 1,
      };
    }

    const cart = await db.cartAbandonment.update({
      where: { id },
      data: updateData,
      include: {
        product: true,
      },
    });

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}

// DELETE cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.cartAbandonment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting cart:", error);
    return NextResponse.json(
      { error: "Failed to delete cart" },
      { status: 500 }
    );
  }
}
