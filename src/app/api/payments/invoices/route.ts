import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createInvoiceFromPayment } from "@/lib/payments/invoice-generator";

// GET all invoices
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const contactId = searchParams.get("contactId");

    const where: any = {};
    if (status) where.status = status;
    if (contactId) where.contactId = contactId;

    const invoices = await db.invoice.findMany({
      where,
      include: {
        payment: true,
        contact: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

// POST create invoice from payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, type } = body;

    if (!paymentId) {
      return NextResponse.json(
        { error: "paymentId is required" },
        { status: 400 }
      );
    }

    const invoice = await createInvoiceFromPayment(
      paymentId,
      type || "tax_invoice"
    );

    return NextResponse.json(invoice, { status: 201 });
  } catch (error: any) {
    console.error("Error creating invoice:", error);

    if (error.message === "Payment not found") {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    if (error.message === "Invoice already exists for this payment") {
      return NextResponse.json(
        { error: "Invoice already exists for this payment" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
