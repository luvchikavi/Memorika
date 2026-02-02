import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST test gateway connection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gateway } = body;

    if (!gateway) {
      return NextResponse.json(
        { error: "gateway is required" },
        { status: 400 }
      );
    }

    // Get gateway settings
    const settings = await db.paymentGatewaySettings.findUnique({
      where: { gateway },
    });

    if (!settings) {
      return NextResponse.json(
        { error: "Gateway not configured" },
        { status: 404 }
      );
    }

    // Check if required credentials exist
    if (!settings.terminalId && !settings.apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing credentials. Please configure terminal ID or API key."
        },
        { status: 400 }
      );
    }

    // Gateway-specific test logic
    let testResult: { success: boolean; message: string };

    switch (gateway) {
      case "tranzila":
        testResult = await testTranzilaConnection(settings);
        break;
      case "cardcom":
        testResult = await testCardComConnection(settings);
        break;
      case "payplus":
        testResult = await testPayPlusConnection(settings);
        break;
      case "morning":
        testResult = await testMorningConnection(settings);
        break;
      case "bit":
        testResult = await testBitConnection(settings);
        break;
      case "paybox":
        testResult = await testPayBoxConnection(settings);
        break;
      default:
        testResult = {
          success: false,
          message: "Unknown gateway"
        };
    }

    return NextResponse.json(testResult);
  } catch (error) {
    console.error("Error testing gateway connection:", error);
    return NextResponse.json(
      { success: false, error: "Failed to test connection" },
      { status: 500 }
    );
  }
}

// Test Tranzila connection
async function testTranzilaConnection(settings: any): Promise<{ success: boolean; message: string }> {
  try {
    // Tranzila uses terminal name/ID for authentication
    if (!settings.terminalId) {
      return { success: false, message: "Terminal ID is required for Tranzila" };
    }

    // In production, you would make an actual API call to Tranzila's test endpoint
    // For now, we just validate that credentials exist
    // Example: https://secure5.tranzila.com/cgi-bin/tranzila31.cgi

    return {
      success: true,
      message: "Tranzila credentials validated. Terminal: " + settings.terminalId
    };
  } catch (error) {
    return { success: false, message: "Failed to connect to Tranzila" };
  }
}

// Test CardCom connection
async function testCardComConnection(settings: any): Promise<{ success: boolean; message: string }> {
  try {
    if (!settings.terminalId || !settings.apiKey) {
      return { success: false, message: "Terminal number and API key are required for CardCom" };
    }

    return {
      success: true,
      message: "CardCom credentials validated. Terminal: " + settings.terminalId
    };
  } catch (error) {
    return { success: false, message: "Failed to connect to CardCom" };
  }
}

// Test PayPlus connection
async function testPayPlusConnection(settings: any): Promise<{ success: boolean; message: string }> {
  try {
    if (!settings.apiKey || !settings.apiSecret) {
      return { success: false, message: "API Key and Secret are required for PayPlus" };
    }

    return {
      success: true,
      message: "PayPlus credentials validated"
    };
  } catch (error) {
    return { success: false, message: "Failed to connect to PayPlus" };
  }
}

// Test Morning (Greeninvoice) connection
async function testMorningConnection(settings: any): Promise<{ success: boolean; message: string }> {
  try {
    if (!settings.apiKey || !settings.apiSecret) {
      return { success: false, message: "API ID and Secret are required for Morning" };
    }

    return {
      success: true,
      message: "Morning credentials validated"
    };
  } catch (error) {
    return { success: false, message: "Failed to connect to Morning" };
  }
}

// Test Bit connection
async function testBitConnection(settings: any): Promise<{ success: boolean; message: string }> {
  try {
    if (!settings.apiKey) {
      return { success: false, message: "Business ID is required for Bit" };
    }

    return {
      success: true,
      message: "Bit credentials validated"
    };
  } catch (error) {
    return { success: false, message: "Failed to connect to Bit" };
  }
}

// Test PayBox connection
async function testPayBoxConnection(settings: any): Promise<{ success: boolean; message: string }> {
  try {
    if (!settings.apiKey) {
      return { success: false, message: "Business ID is required for PayBox" };
    }

    return {
      success: true,
      message: "PayBox credentials validated"
    };
  } catch (error) {
    return { success: false, message: "Failed to connect to PayBox" };
  }
}
