import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getGateway } from "@/lib/payments/gateways";
// Register gateway implementations
import "@/lib/payments/gateways/tranzila";
import "@/lib/payments/gateways/payplus";

// POST handle webhook from payment gateway
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gateway: string }> }
) {
  try {
    const { gateway: gatewayName } = await params;

    // Get the gateway instance
    const gateway = await getGateway(gatewayName);
    if (!gateway) {
      console.error(`Webhook received for unknown gateway: ${gatewayName}`);
      return NextResponse.json({ error: "Unknown gateway" }, { status: 400 });
    }

    // Get raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get("x-signature") ||
                     request.headers.get("x-webhook-signature") ||
                     "";

    // Parse the payload
    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      // Some gateways use form-encoded data
      payload = Object.fromEntries(new URLSearchParams(body));
    }

    // Verify webhook signature
    if (!gateway.verifyWebhook(payload, signature)) {
      console.error(`Invalid webhook signature from ${gatewayName}`);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse the webhook data
    const webhookData = gateway.parseWebhook(payload);
    console.log(`Webhook from ${gatewayName}:`, webhookData);

    // Find the payment by transaction ID
    if (webhookData.transactionId) {
      const payment = await db.payment.findFirst({
        where: {
          transactionId: webhookData.transactionId,
        },
      });

      if (payment) {
        // Update payment status based on webhook
        const updateData: Record<string, any> = {
          gatewayResponse: JSON.stringify(webhookData.data),
        };

        if (webhookData.status === "completed" && payment.status !== "completed") {
          updateData.status = "completed";
          updateData.completedAt = new Date();
        } else if (webhookData.status === "failed" && payment.status === "processing") {
          updateData.status = "failed";
        } else if (webhookData.type === "refund") {
          updateData.status = "refunded";
        }

        await db.payment.update({
          where: { id: payment.id },
          data: updateData,
        });

        // Update associated deal if payment completed
        if (webhookData.status === "completed" && payment.dealId) {
          const deal = await db.deal.findUnique({ where: { id: payment.dealId } });
          if (deal && deal.status !== "paid") {
            const newPaidAmount = (deal.paidAmount || 0) + payment.amount;
            const newStatus = newPaidAmount >= deal.finalAmount ? "paid" : "partially_paid";

            await db.deal.update({
              where: { id: payment.dealId },
              data: {
                paidAmount: newPaidAmount,
                status: newStatus,
                paidAt: newStatus === "paid" ? new Date() : null,
              },
            });
          }
        }

        // Update associated deal if refund
        if (webhookData.type === "refund" && payment.dealId) {
          const deal = await db.deal.findUnique({ where: { id: payment.dealId } });
          if (deal) {
            const newPaidAmount = Math.max(0, (deal.paidAmount || 0) - payment.amount);
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
      } else {
        console.log(`Payment not found for transaction: ${webhookData.transactionId}`);
      }
    }

    // Always return success to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    // Still return success to prevent retries for malformed data
    return NextResponse.json({ received: true, error: "Processing error" });
  }
}

// Some gateways use GET for confirmation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gateway: string }> }
) {
  const { gateway } = await params;
  const { searchParams } = new URL(request.url);

  // Log the callback for debugging
  console.log(`GET callback from ${gateway}:`, Object.fromEntries(searchParams));

  // Redirect to a confirmation page
  const status = searchParams.get("status") || searchParams.get("Response");
  const transactionId = searchParams.get("transaction_id") || searchParams.get("ConfirmationCode");

  if (status === "000" || status === "success") {
    return NextResponse.redirect(
      new URL(`/payment/success?transaction=${transactionId}`, request.url)
    );
  } else {
    return NextResponse.redirect(
      new URL(`/payment/failed?error=${status}`, request.url)
    );
  }
}
