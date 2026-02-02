// PayPlus Payment Gateway Implementation
import {
  PaymentGateway,
  PaymentRequest,
  PaymentResponse,
  RefundRequest,
  RefundResponse,
  GatewayConfig,
  registerGateway,
} from "./index";

export class PayPlusGateway implements PaymentGateway {
  name = "payplus";
  private apiKey: string = "";
  private secretKey: string = "";
  private terminalUid: string = "";
  private baseUrl = "https://restapiuat.payplus.co.il/api/v1.0"; // UAT environment
  // Production: "https://restapi.payplus.co.il/api/v1.0"

  initialize(config: GatewayConfig): void {
    this.apiKey = config.apiKey || "";
    this.secretKey = config.apiSecret || "";
    this.terminalUid = config.terminalId || "";
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Use saved card token if available
      if (request.savedCardToken) {
        return await this.processTokenPayment(request);
      }

      // Build PayPlus request
      const requestBody = {
        payment_page_uid: this.terminalUid,
        charge_method: 1, // Direct charge
        amount: request.amount,
        currency_code: request.currency,
        more_info: request.description || "",
        customer: {
          customer_name: request.customerName || "",
          email: request.customerEmail || "",
          phone: request.customerPhone || "",
        },
        credit_card_number: request.cardNumber,
        card_date_mmyy: this.formatExpiry(request.cardExpiry || ""),
        card_cvv: request.cardCvv,
        card_holder_name: request.cardHolderName || request.customerName,
        payments: request.installments || 1,
        create_token: request.saveCard || false,
      };

      // In production, make the actual API call:
      // const response = await fetch(`${this.baseUrl}/PaymentPages/generateLink`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": JSON.stringify({
      //       api_key: this.apiKey,
      //       secret_key: this.secretKey,
      //     }),
      //   },
      //   body: JSON.stringify(requestBody),
      // });
      // const result = await response.json();

      // For development, simulate a response
      const isTestCard = request.cardNumber?.startsWith("4580") || request.cardNumber?.startsWith("4111");

      if (!request.cardNumber || request.cardNumber.length < 13) {
        return {
          success: false,
          errorCode: "invalid_card",
          errorMessage: "מספר כרטיס לא תקין",
        };
      }

      if (isTestCard) {
        return {
          success: true,
          transactionId: `PP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          authCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
          last4Digits: request.cardNumber.slice(-4),
          cardBrand: this.detectCardBrand(request.cardNumber),
          savedCardToken: request.saveCard
            ? `tok_${Math.random().toString(36).substr(2, 16)}`
            : undefined,
          gatewayResponse: {
            results: {
              status: "success",
              code: 0,
            },
          },
        };
      }

      return {
        success: false,
        errorCode: "declined",
        errorMessage: "הכרטיס נדחה",
        last4Digits: request.cardNumber?.slice(-4),
        cardBrand: this.detectCardBrand(request.cardNumber || ""),
      };
    } catch (error) {
      console.error("PayPlus payment error:", error);
      return {
        success: false,
        errorCode: "error",
        errorMessage: "שגיאת תקשורת עם שער התשלום",
        gatewayResponse: error,
      };
    }
  }

  private async processTokenPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const requestBody = {
        terminal_uid: this.terminalUid,
        token: request.savedCardToken,
        amount: request.amount,
        currency_code: request.currency,
        more_info: request.description || "",
        payments: request.installments || 1,
      };

      // In production, make the actual API call to /Token/Charge

      // For development, simulate success
      return {
        success: true,
        transactionId: `PP-TOK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        authCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
        gatewayResponse: {
          results: {
            status: "success",
            code: 0,
          },
        },
      };
    } catch (error) {
      console.error("PayPlus token payment error:", error);
      return {
        success: false,
        errorCode: "token_error",
        errorMessage: "שגיאה בחיוב הכרטיס השמור",
        gatewayResponse: error,
      };
    }
  }

  async refundPayment(request: RefundRequest): Promise<RefundResponse> {
    try {
      const requestBody = {
        transaction_uid: request.transactionId,
        amount: request.amount,
        more_info: request.reason || "",
      };

      // In production, make the actual API call to /Transactions/RefundByTransactionUID

      // For development, simulate success
      return {
        success: true,
        refundId: `REF-PP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        gatewayResponse: {
          results: {
            status: "success",
            code: 0,
          },
        },
      };
    } catch (error) {
      console.error("PayPlus refund error:", error);
      return {
        success: false,
        errorCode: "refund_error",
        errorMessage: "שגיאה בביצוע ההחזר",
        gatewayResponse: error,
      };
    }
  }

  verifyWebhook(payload: any, signature: string): boolean {
    // PayPlus uses a signature header for webhook verification
    // In production, verify using the secret key
    // const expectedSignature = crypto
    //   .createHmac("sha256", this.secretKey)
    //   .update(JSON.stringify(payload))
    //   .digest("hex");
    // return signature === expectedSignature;
    return true;
  }

  parseWebhook(payload: any): {
    type: string;
    transactionId?: string;
    status?: string;
    data?: any;
  } {
    const status = payload.transaction?.status_code === "000" ? "completed" : "failed";

    return {
      type: payload.related_transaction ? "refund" : "payment",
      transactionId: payload.transaction?.uid,
      status,
      data: payload,
    };
  }

  // Helper methods
  private formatExpiry(expiry: string): string {
    // Convert MM/YY to MMYY
    return expiry.replace("/", "");
  }

  private detectCardBrand(cardNumber: string): string {
    const firstDigit = cardNumber[0];
    const firstTwo = cardNumber.substring(0, 2);
    const firstFour = cardNumber.substring(0, 4);

    if (firstDigit === "4") return "Visa";
    if (["51", "52", "53", "54", "55"].includes(firstTwo)) return "Mastercard";
    if (["34", "37"].includes(firstTwo)) return "American Express";
    if (["36", "38", "39"].includes(firstTwo)) return "Diners Club";
    if (firstFour === "6011") return "Discover";
    if (firstTwo === "35") return "JCB";
    if (firstTwo === "62") return "UnionPay";

    return "Unknown";
  }
}

// Register the gateway
registerGateway("payplus", () => new PayPlusGateway());
