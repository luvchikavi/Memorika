// Tranzila Payment Gateway Implementation
import {
  PaymentGateway,
  PaymentRequest,
  PaymentResponse,
  RefundRequest,
  RefundResponse,
  GatewayConfig,
  registerGateway,
} from "./index";

export class TranzilaGateway implements PaymentGateway {
  name = "tranzila";
  private terminalId: string = "";
  private apiKey: string = "";
  private baseUrl = "https://secure5.tranzila.com";

  initialize(config: GatewayConfig): void {
    this.terminalId = config.terminalId || "";
    this.apiKey = config.apiKey || "";
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Build Tranzila request parameters
      const params = new URLSearchParams({
        supplier: this.terminalId,
        TranzilaPW: this.apiKey || "",
        sum: request.amount.toFixed(2),
        currency: this.getCurrencyCode(request.currency),
        ccno: request.cardNumber || "",
        expdate: this.formatExpiry(request.cardExpiry || ""),
        mycvv: request.cardCvv || "",
        cred_type: request.installments && request.installments > 1 ? "8" : "1",
        npay: request.installments?.toString() || "1",
        contact: request.customerName || "",
        email: request.customerEmail || "",
        phone: request.customerPhone || "",
        pdesc: request.description || "",
        tranmode: "A", // Authorize and capture
      });

      // In production, make the actual API call:
      // const response = await fetch(`${this.baseUrl}/cgi-bin/tranzila31.cgi`, {
      //   method: "POST",
      //   body: params,
      // });
      // const text = await response.text();
      // const result = this.parseResponse(text);

      // For development, simulate a response
      const isTestCard = request.cardNumber?.startsWith("4580") || request.cardNumber?.startsWith("4111");

      if (!request.cardNumber || request.cardNumber.length < 13) {
        return {
          success: false,
          errorCode: "001",
          errorMessage: "מספר כרטיס לא תקין",
        };
      }

      if (isTestCard) {
        return {
          success: true,
          transactionId: `TRZ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          authCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
          last4Digits: request.cardNumber.slice(-4),
          cardBrand: this.detectCardBrand(request.cardNumber),
          gatewayResponse: {
            Response: "000",
            supplier: this.terminalId,
          },
        };
      }

      // Simulate declined card
      return {
        success: false,
        errorCode: "003",
        errorMessage: "הכרטיס נדחה",
        last4Digits: request.cardNumber?.slice(-4),
        cardBrand: this.detectCardBrand(request.cardNumber || ""),
      };
    } catch (error) {
      console.error("Tranzila payment error:", error);
      return {
        success: false,
        errorCode: "999",
        errorMessage: "שגיאת תקשורת עם שער התשלום",
        gatewayResponse: error,
      };
    }
  }

  async refundPayment(request: RefundRequest): Promise<RefundResponse> {
    try {
      const params = new URLSearchParams({
        supplier: this.terminalId,
        TranzilaPW: this.apiKey || "",
        tranmode: "C", // Credit/Refund
        authnr: request.transactionId,
        sum: request.amount?.toFixed(2) || "",
      });

      // In production, make the actual API call
      // For development, simulate success
      return {
        success: true,
        refundId: `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        gatewayResponse: {
          Response: "000",
        },
      };
    } catch (error) {
      console.error("Tranzila refund error:", error);
      return {
        success: false,
        errorCode: "999",
        errorMessage: "שגיאה בביצוע ההחזר",
        gatewayResponse: error,
      };
    }
  }

  verifyWebhook(payload: any, signature: string): boolean {
    // Tranzila uses IP whitelisting rather than signatures
    // In production, verify the request comes from Tranzila's IPs
    return true;
  }

  parseWebhook(payload: any): {
    type: string;
    transactionId?: string;
    status?: string;
    data?: any;
  } {
    return {
      type: "payment",
      transactionId: payload.ConfirmationCode || payload.index,
      status: payload.Response === "000" ? "completed" : "failed",
      data: payload,
    };
  }

  // Helper methods
  private getCurrencyCode(currency: string): string {
    const currencyMap: Record<string, string> = {
      ILS: "1",
      USD: "2",
      EUR: "3",
      GBP: "4",
    };
    return currencyMap[currency] || "1";
  }

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

  private parseResponse(responseText: string): Record<string, string> {
    const result: Record<string, string> = {};
    responseText.split("&").forEach((pair) => {
      const [key, value] = pair.split("=");
      if (key) result[key] = decodeURIComponent(value || "");
    });
    return result;
  }
}

// Register the gateway
registerGateway("tranzila", () => new TranzilaGateway());
