import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET single invoice
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const invoice = await db.invoice.findUnique({
      where: { id },
      include: {
        payment: true,
        contact: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}

// PUT update invoice
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      status,
      customerTaxId,
      businessName,
      businessTaxId,
      dueDate,
      pdfUrl,
    } = body;

    const existingInvoice = await db.invoice.findUnique({
      where: { id },
    });

    if (!existingInvoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, any> = {};
    if (status !== undefined) updateData.status = status;
    if (customerTaxId !== undefined) updateData.customerTaxId = customerTaxId || null;
    if (businessName !== undefined) updateData.businessName = businessName || null;
    if (businessTaxId !== undefined) updateData.businessTaxId = businessTaxId || null;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (pdfUrl !== undefined) updateData.pdfUrl = pdfUrl || null;

    const invoice = await db.invoice.update({
      where: { id },
      data: updateData,
      include: {
        payment: true,
        contact: true,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { error: "Failed to update invoice" },
      { status: 500 }
    );
  }
}
