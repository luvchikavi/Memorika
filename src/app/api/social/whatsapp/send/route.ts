import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Helper to replace placeholders in content
function replacePlaceholders(content: string, contact: any): string {
  return content
    .replace(/\{\{firstName\}\}/g, contact.firstName || "")
    .replace(/\{\{lastName\}\}/g, contact.lastName || "")
    .replace(/\{\{fullName\}\}/g, `${contact.firstName || ""} ${contact.lastName || ""}`.trim())
    .replace(/\{\{email\}\}/g, contact.email || "")
    .replace(/\{\{phone\}\}/g, contact.phone || "");
}

// POST send WhatsApp message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contactIds, templateId, customMessage, mediaUrl } = body;

    // Get WhatsApp settings
    const settings = await db.socialMediaSettings.findUnique({
      where: { platform: "whatsapp" },
    });

    if (!settings?.isActive) {
      return NextResponse.json(
        { error: "WhatsApp is not configured or not active" },
        { status: 400 }
      );
    }

    if (!settings.phoneNumberId || !settings.accessToken) {
      return NextResponse.json(
        { error: "WhatsApp API credentials are not configured" },
        { status: 400 }
      );
    }

    // Get template if provided
    let template = null;
    if (templateId) {
      template = await db.messageTemplate.findUnique({
        where: { id: templateId },
      });
    }

    // Get contacts
    const contacts = await db.contact.findMany({
      where: {
        id: { in: contactIds },
        phone: { not: null },
      },
    });

    if (contacts.length === 0) {
      return NextResponse.json(
        { error: "No contacts with phone numbers found" },
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];

    for (const contact of contacts) {
      try {
        // Prepare message content
        let messageContent = customMessage || template?.content || "";
        messageContent = replacePlaceholders(messageContent, contact);

        // Format phone number (remove leading 0, add country code if needed)
        let phoneNumber = contact.phone!.replace(/\D/g, "");
        if (phoneNumber.startsWith("0")) {
          phoneNumber = "972" + phoneNumber.substring(1);
        }
        if (!phoneNumber.startsWith("972")) {
          phoneNumber = "972" + phoneNumber;
        }

        // Send via WhatsApp Business API
        const whatsappResponse = await fetch(
          `https://graph.facebook.com/v18.0/${settings.phoneNumberId}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${settings.accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: phoneNumber,
              type: "text",
              text: {
                body: messageContent,
              },
            }),
          }
        );

        const whatsappResult = await whatsappResponse.json();

        // Log the sent message
        const sentMessage = await db.sentMessage.create({
          data: {
            contactId: contact.id,
            templateId: templateId || null,
            platform: "whatsapp",
            recipient: phoneNumber,
            content: messageContent,
            status: whatsappResponse.ok ? "sent" : "failed",
            externalId: whatsappResult.messages?.[0]?.id || null,
            errorMessage: whatsappResult.error?.message || null,
          },
        });

        if (whatsappResponse.ok) {
          results.push({
            contactId: contact.id,
            contactName: `${contact.firstName} ${contact.lastName}`,
            status: "sent",
            messageId: sentMessage.id,
          });
        } else {
          errors.push({
            contactId: contact.id,
            contactName: `${contact.firstName} ${contact.lastName}`,
            error: whatsappResult.error?.message || "Failed to send",
          });
        }
      } catch (err: any) {
        errors.push({
          contactId: contact.id,
          contactName: `${contact.firstName} ${contact.lastName}`,
          error: err.message || "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: results.length > 0,
      sent: results.length,
      failed: errors.length,
      results,
      errors,
    });
  } catch (error) {
    console.error("Error sending WhatsApp messages:", error);
    return NextResponse.json(
      { error: "Failed to send messages" },
      { status: 500 }
    );
  }
}
