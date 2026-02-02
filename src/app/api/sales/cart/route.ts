import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all abandoned carts
export async function GET() {
  try {
    const carts = await db.cartAbandonment.findMany({
      include: {
        product: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(carts);
  } catch (error) {
    console.error("Error fetching abandoned carts:", error);
    return NextResponse.json(
      { error: "Failed to fetch abandoned carts" },
      { status: 500 }
    );
  }
}

// POST create abandoned cart (for tracking)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, productId, cartData } = body;

    if (!email) {
      return NextResponse.json(
        { error: "email is required" },
        { status: 400 }
      );
    }

    // Check if cart already exists for this email and product
    const existingCart = await db.cartAbandonment.findFirst({
      where: {
        email,
        productId: productId || null,
        isRecovered: false,
      },
    });

    if (existingCart) {
      // Update existing cart
      const updated = await db.cartAbandonment.update({
        where: { id: existingCart.id },
        data: {
          cartData: cartData ? JSON.stringify(cartData) : null,
        },
      });
      return NextResponse.json(updated);
    }

    // Create new cart
    const cart = await db.cartAbandonment.create({
      data: {
        email,
        productId: productId || null,
        cartData: cartData ? JSON.stringify(cartData) : null,
      },
    });

    return NextResponse.json(cart, { status: 201 });
  } catch (error) {
    console.error("Error creating abandoned cart:", error);
    return NextResponse.json(
      { error: "Failed to create abandoned cart" },
      { status: 500 }
    );
  }
}
