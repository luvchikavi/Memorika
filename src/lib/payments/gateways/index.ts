// Payment Gateway Interface and Factory
import { db } from "@/lib/db";

export interface PaymentRequest {
  amount: number;
  currency: string;
  description?: string;
  contactId: string;
  dealId?: string;
  paymentMethod: string;
  // Card details (for credit card payments)
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  cardHolderName?: string;
  // Customer info
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
  // Additional options
  installments?: number;
  saveCard?: boolean;
  savedCardToken?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  authCode?: string;
  last4Digits?: string;
  cardBrand?: string;
  errorCode?: string;
  errorMessage?: string;
  gatewayResponse?: any;
  savedCardToken?: string;
}

export interface RefundRequest {
  transactionId: string;
  amount?: number; // Partial refund if specified
  reason?: string;
}

export interface RefundResponse {
  success: boolean;
  refundId?: string;
  errorCode?: string;
  errorMessage?: string;
  gatewayResponse?: any;
}

export interface GatewayConfig {
  terminalId?: string;
  apiKey?: string;
  apiSecret?: string;
  webhookSecret?: string;
  settings?: any;
}

export interface PaymentGateway {
  name: string;

  // Initialize the gateway with config
  initialize(config: GatewayConfig): void;

  // Process a payment
  processPayment(request: PaymentRequest): Promise<PaymentResponse>;

  // Refund a payment
  refundPayment(request: RefundRequest): Promise<RefundResponse>;

  // Verify a webhook signature
  verifyWebhook(payload: any, signature: string): boolean;

  // Parse webhook data
  parseWebhook(payload: any): {
    type: string;
    transactionId?: string;
    status?: string;
    data?: any;
  };
}

// Gateway registry
const gatewayRegistry: Record<string, () => PaymentGateway> = {};

// Register a gateway
export function registerGateway(name: string, factory: () => PaymentGateway) {
  gatewayRegistry[name] = factory;
}

// Get a configured gateway instance
export async function getGateway(gatewayName: string): Promise<PaymentGateway | null> {
  const factory = gatewayRegistry[gatewayName];
  if (!factory) {
    console.error(`Gateway ${gatewayName} not registered`);
    return null;
  }

  // Get gateway config from database
  const settings = await db.paymentGatewaySettings.findUnique({
    where: { gateway: gatewayName },
  });

  if (!settings || !settings.isActive) {
    console.error(`Gateway ${gatewayName} not configured or not active`);
    return null;
  }

  const gateway = factory();
  gateway.initialize({
    terminalId: settings.terminalId || undefined,
    apiKey: settings.apiKey || undefined,
    apiSecret: settings.apiSecret || undefined,
    webhookSecret: settings.webhookSecret || undefined,
    settings: settings.settings ? JSON.parse(settings.settings) : undefined,
  });

  return gateway;
}

// Get the default gateway
export async function getDefaultGateway(): Promise<PaymentGateway | null> {
  const settings = await db.paymentGatewaySettings.findFirst({
    where: { isDefault: true, isActive: true },
  });

  if (!settings) {
    // Fall back to any active gateway
    const anyActive = await db.paymentGatewaySettings.findFirst({
      where: { isActive: true },
    });

    if (!anyActive) {
      console.error("No active payment gateway configured");
      return null;
    }

    return getGateway(anyActive.gateway);
  }

  return getGateway(settings.gateway);
}

// Re-export gateway implementations
export { TranzilaGateway } from "./tranzila";
export { PayPlusGateway } from "./payplus";
