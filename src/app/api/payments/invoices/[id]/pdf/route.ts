import { NextRequest, NextResponse } from "next/server";
import { generateInvoicePDF } from "@/lib/payments/invoice-generator";

// GET invoice PDF (returns HTML for browser printing)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const html = await generateInvoicePDF(id);

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error: any) {
    console.error("Error generating invoice PDF:", error);

    if (error.message === "Invoice not found") {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate invoice PDF" },
      { status: 500 }
    );
  }
}
