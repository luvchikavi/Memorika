import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getGateway } from "@/lib/payments/gateways";

// POST refund a payment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { amount, reason } = body;

    // Get the payment
    const payment = await db.payment.findUnique({
      where: { id },
      include: {
        deal: true,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    if (payment.status !== "completed") {
      return NextResponse.json(
        { error: "Can only refund completed payments" },
        { status: 400 }
      );
    }

    // Determine refund amount (full or partial)
    const refundAmount = amount || payment.amount;
    if (refundAmount > payment.amount) {
      return NextResponse.json(
        { error: "Refund amount cannot exceed original payment" },
        { status: 400 }
      );
    }

    // If this was a card payment, process refund through gateway
    if (payment.gateway && payment.transactionId) {
      const gateway = await getGateway(payment.gateway);
      if (gateway) {
        const refundResult = await gateway.refundPayment({
          transactionId: payment.transactionId,
          amount: refundAmount,
          reason,
        });

        if (!refundResult.success) {
          return NextResponse.json(
            {
              error: refundResult.errorMessage || "Refund failed",
              errorCode: refundResult.errorCode,
            },
            { status: 400 }
          );
        }

        // Update payment status
        const updatedPayment = await db.payment.update({
          where: { id },
          data: {
            status: "refunded",
            notes: reason ? `${payment.notes || ""}\nRefund reason: ${reason}`.trim() : payment.notes,
            gatewayResponse: JSON.stringify({
              ...JSON.parse(payment.gatewayResponse || "{}"),
              refund: refundResult.gatewayResponse,
            }),
          },
          include: {
            contact: true,
            deal: {
              include: {
                product: true,
              },
            },
          },
        });

        // Update deal if associated
        if (payment.dealId) {
          const deal = await db.deal.findUnique({ where: { id: payment.dealId } });
          if (deal) {
            const newPaidAmount = Math.max(0, (deal.paidAmount || 0) - refundAmount);
            const newStatus = newPaidAmount <= 0 ? "refunded" : "partially_paid";

            await db.deal.update({
              where: { id: payment.dealId },
              data: {
                paidAmount: newPaidAmount,
                status: newStatus,
              },
            });
          }
        }

        return NextResponse.json({
          success: true,
          payment: updatedPayment,
          refundId: refundResult.refundId,
        });
      }
    }

    // For manual payments (cash, bank transfer), just update the status
    const updatedPayment = await db.payment.update({
      where: { id },
      data: {
        status: "refunded",
        notes: reason ? `${payment.notes || ""}\nRefund reason: ${reason}`.trim() : payment.notes,
      },
      include: {
        contact: true,
        deal: {
          include: {
            product: true,
          },
        },
      },
    });

    // Update deal if associated
    if (payment.dealId) {
      const deal = await db.deal.findUnique({ where: { id: payment.dealId } });
      if (deal) {
        const newPaidAmount = Math.max(0, (deal.paidAmount || 0) - refundAmount);
        const newStatus = newPaidAmount <= 0 ? "refunded" : "partially_paid";

        await db.deal.update({
          where: { id: payment.dealId },
          data: {
            paidAmount: newPaidAmount,
            status: newStatus,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("Error refunding payment:", error);
    return NextResponse.json(
      { error: "Failed to refund payment" },
      { status: 500 }
    );
  }
}
