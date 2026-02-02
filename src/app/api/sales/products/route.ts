import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all products
export async function GET() {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            leads: true,
            deals: true,
          },
        },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, nameHe, description, price, currency, category, isActive, isFeatured, image } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: "name and price are required" },
        { status: 400 }
      );
    }

    const product = await db.product.create({
      data: {
        name,
        nameHe: nameHe || null,
        description: description || null,
        price: parseFloat(price),
        currency: currency || "ILS",
        category: category || "course",
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        image: image || null,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
