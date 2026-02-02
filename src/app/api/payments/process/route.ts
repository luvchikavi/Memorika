import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getGateway, getDefaultGateway, PaymentRequest } from "@/lib/payments/gateways";

// POST process a card payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      dealId,
      contactId,
      amount,
      currency,
      gateway: gatewayName,
      cardNumber,
      cardExpiry,
      cardCvv,
      cardHolderName,
      installments,
      saveCard,
      savedCardToken,
      description,
    } = body;

    if (!contactId || amount === undefined) {
      return NextResponse.json(
        { error: "contactId and amount are required" },
        { status: 400 }
      );
    }

    // Get the payment gateway
    const gateway = gatewayName
      ? await getGateway(gatewayName)
      : await getDefaultGateway();

    if (!gateway) {
      return NextResponse.json(
        { error: "No payment gateway configured" },
        { status: 400 }
      );
    }

    // Get contact info
    const contact = await db.contact.findUnique({
      where: { id: contactId },
    });

    if (!contact) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    // Create a pending payment record
    const payment = await db.payment.create({
      data: {
        dealId: dealId || null,
        contactId,
        amount,
        currency: currency || "ILS",
        paymentMethod: "credit_card",
        gateway: gateway.name,
        status: "processing",
      },
    });

    try {
      // Process the payment
      const paymentRequest: PaymentRequest = {
        amount,
        currency: currency || "ILS",
        description: description || `Payment ${payment.id}`,
        contactId,
        dealId,
        paymentMethod: "credit_card",
        cardNumber,
        cardExpiry,
        cardCvv,
        cardHolderName,
        customerEmail: contact.email,
        customerPhone: contact.phone || undefined,
        customerName: `${contact.firstName} ${contact.lastName}`,
        installments,
        saveCard,
        savedCardToken,
      };

      const result = await gateway.processPayment(paymentRequest);

      // Update payment record with result
      const updatedPayment = await db.payment.update({
        where: { id: payment.id },
        data: {
          status: result.success ? "completed" : "failed",
          transactionId: result.transactionId || null,
          authCode: result.authCode || null,
          last4Digits: result.last4Digits || null,
          cardBrand: result.cardBrand || null,
          errorCode: result.errorCode || null,
          errorMessage: result.errorMessage || null,
          gatewayResponse: result.gatewayResponse
            ? JSON.stringify(result.gatewayResponse)
            : null,
          completedAt: result.success ? new Date() : null,
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

      // If payment was successful and linked to a deal, update the deal
      if (result.success && dealId) {
        const deal = await db.deal.findUnique({ where: { id: dealId } });
        if (deal) {
          const newPaidAmount = (deal.paidAmount || 0) + amount;
          const newStatus = newPaidAmount >= deal.finalAmount ? "paid" : "partially_paid";

          await db.deal.update({
            where: { id: dealId },
            data: {
              paidAmount: newPaidAmount,
              status: newStatus,
              paidAt: newStatus === "paid" ? new Date() : null,
              paymentMethod: "credit_card",
              paymentRef: result.transactionId,
            },
          });
        }
      }

      return NextResponse.json({
        success: result.success,
        payment: updatedPayment,
        transactionId: result.transactionId,
        errorMessage: result.errorMessage,
        savedCardToken: result.savedCardToken,
      });
    } catch (gatewayError) {
      // Update payment as failed
      await db.payment.update({
        where: { id: payment.id },
        data: {
          status: "failed",
          errorMessage: "Gateway processing error",
          gatewayResponse: JSON.stringify(gatewayError),
        },
      });

      throw gatewayError;
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}
