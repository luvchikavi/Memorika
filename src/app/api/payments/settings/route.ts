import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all payment gateway settings
export async function GET(request: NextRequest) {
  try {
    const settings = await db.paymentGatewaySettings.findMany({
      orderBy: {
        gateway: "asc",
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching payment settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment settings" },
      { status: 500 }
    );
  }
}

// POST upsert payment gateway settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      gateway,
      isActive,
      isDefault,
      terminalId,
      apiKey,
      apiSecret,
      webhookSecret,
      settings,
      vatRate,
      invoicePrefix,
      receiptPrefix,
    } = body;

    if (!gateway) {
      return NextResponse.json(
        { error: "gateway is required" },
        { status: 400 }
      );
    }

    // If this is being set as default, unset other defaults
    if (isDefault) {
      await db.paymentGatewaySettings.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    // Upsert the gateway settings
    const gatewaySettings = await db.paymentGatewaySettings.upsert({
      where: { gateway },
      create: {
        gateway,
        isActive: isActive ?? false,
        isDefault: isDefault ?? false,
        terminalId: terminalId || null,
        apiKey: apiKey || null,
        apiSecret: apiSecret || null,
        webhookSecret: webhookSecret || null,
        settings: settings ? JSON.stringify(settings) : null,
        vatRate: vatRate ?? 17,
        invoicePrefix: invoicePrefix || null,
        receiptPrefix: receiptPrefix || null,
      },
      update: {
        isActive: isActive ?? undefined,
        isDefault: isDefault ?? undefined,
        terminalId: terminalId !== undefined ? terminalId || null : undefined,
        apiKey: apiKey !== undefined ? apiKey || null : undefined,
        apiSecret: apiSecret !== undefined ? apiSecret || null : undefined,
        webhookSecret: webhookSecret !== undefined ? webhookSecret || null : undefined,
        settings: settings !== undefined ? (settings ? JSON.stringify(settings) : null) : undefined,
        vatRate: vatRate ?? undefined,
        invoicePrefix: invoicePrefix !== undefined ? invoicePrefix || null : undefined,
        receiptPrefix: receiptPrefix !== undefined ? receiptPrefix || null : undefined,
      },
    });

    return NextResponse.json(gatewaySettings);
  } catch (error) {
    console.error("Error saving payment settings:", error);
    return NextResponse.json(
      { error: "Failed to save payment settings" },
      { status: 500 }
    );
  }
}
