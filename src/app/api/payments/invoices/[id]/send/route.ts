import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST send invoice via email
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const invoice = await db.invoice.findUnique({
      where: { id },
      include: {
        contact: true,
        payment: true,
      },
    });

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    // In production, you would integrate with an email service here
    // For example: SendGrid, Mailgun, AWS SES, etc.
    //
    // Example email content:
    // Subject: חשבונית מס #{invoice.invoiceNumber} - Memorika
    // Body:
    //   שלום {invoice.customerName},
    //
    //   מצורפת חשבונית מס עבור התשלום שבוצע.
    //
    //   מספר חשבונית: {invoice.invoiceNumber}
    //   סכום: {invoice.totalAmount} ש"ח
    //
    //   לצפייה והורדה: {link to PDF}
    //
    //   תודה,
    //   Memorika

    console.log(`Sending invoice ${invoice.invoiceNumber} to ${invoice.contact.email}`);

    // Update invoice status
    const updatedInvoice = await db.invoice.update({
      where: { id },
      data: {
        status: "sent",
        sentAt: new Date(),
      },
      include: {
        contact: true,
        payment: true,
      },
    });

    // In production, you would also create an Interaction record
    // to log this communication in the CRM
    // await db.interaction.create({
    //   data: {
    //     contactId: invoice.contactId,
    //     type: "email_sent",
    //     subject: `חשבונית מס ${invoice.invoiceNumber}`,
    //     content: "נשלחה חשבונית מס",
    //     channel: "email",
    //     direction: "outbound",
    //   },
    // });

    return NextResponse.json({
      success: true,
      message: `Invoice sent to ${invoice.contact.email}`,
      invoice: updatedInvoice,
    });
  } catch (error) {
    console.error("Error sending invoice:", error);
    return NextResponse.json(
      { error: "Failed to send invoice" },
      { status: 500 }
    );
  }
}
