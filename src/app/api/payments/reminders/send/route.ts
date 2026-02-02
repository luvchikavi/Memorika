import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST process and send pending reminders
// This endpoint can be called by a cron job
export async function POST(request: NextRequest) {
  try {
    // Find all pending reminders that are due
    const now = new Date();
    const pendingReminders = await db.paymentReminder.findMany({
      where: {
        status: "pending",
        scheduledFor: {
          lte: now,
        },
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

    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const reminder of pendingReminders) {
      try {
        // Determine which channel to use
        if (reminder.sendVia === "email") {
          await sendEmailReminder(reminder);
        } else if (reminder.sendVia === "whatsapp") {
          await sendWhatsAppReminder(reminder);
        } else if (reminder.sendVia === "sms") {
          await sendSMSReminder(reminder);
        }

        // Mark as sent
        await db.paymentReminder.update({
          where: { id: reminder.id },
          data: {
            status: "sent",
            sentAt: new Date(),
          },
        });

        results.sent++;
      } catch (error: any) {
        console.error(`Error sending reminder ${reminder.id}:`, error);

        // Mark as failed
        await db.paymentReminder.update({
          where: { id: reminder.id },
          data: {
            status: "failed",
          },
        });

        results.failed++;
        results.errors.push(`Reminder ${reminder.id}: ${error.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      processed: pendingReminders.length,
      ...results,
    });
  } catch (error) {
    console.error("Error processing reminders:", error);
    return NextResponse.json(
      { error: "Failed to process reminders" },
      { status: 500 }
    );
  }
}

// Helper function to send email reminder
async function sendEmailReminder(reminder: any) {
  // In production, integrate with email service (SendGrid, AWS SES, etc.)
  // Example email content:
  //
  // Subject: תזכורת תשלום - {deal.product.name}
  // Body:
  //   שלום {contact.firstName},
  //
  //   זוהי תזכורת לגבי תשלום בסך {amount} ש"ח
  //   {type === 'payment_due' ? 'שמועד התשלום שלו מתקרב' : ''}
  //   {type === 'overdue' ? 'שחלף מועד התשלום שלו' : ''}
  //
  //   לתשלום: {link}
  //
  //   תודה,
  //   Memorika

  console.log(`Sending email reminder to ${reminder.contact.email}`);

  // Create interaction log
  await db.interaction.create({
    data: {
      contactId: reminder.contactId,
      type: "email_sent",
      subject: `תזכורת תשלום`,
      content: `נשלחה תזכורת תשלום מסוג ${reminder.type}`,
      channel: "email",
      direction: "outbound",
    },
  });
}

// Helper function to send WhatsApp reminder
async function sendWhatsAppReminder(reminder: any) {
  // In production, integrate with WhatsApp Business API
  // Check if contact has a phone number
  if (!reminder.contact.phone) {
    throw new Error("Contact does not have a phone number");
  }

  console.log(`Sending WhatsApp reminder to ${reminder.contact.phone}`);

  // Create interaction log
  await db.interaction.create({
    data: {
      contactId: reminder.contactId,
      type: "whatsapp",
      subject: `תזכורת תשלום`,
      content: `נשלחה תזכורת תשלום מסוג ${reminder.type}`,
      channel: "whatsapp",
      direction: "outbound",
    },
  });
}

// Helper function to send SMS reminder
async function sendSMSReminder(reminder: any) {
  // In production, integrate with SMS provider
  if (!reminder.contact.phone) {
    throw new Error("Contact does not have a phone number");
  }

  console.log(`Sending SMS reminder to ${reminder.contact.phone}`);

  // Create interaction log
  await db.interaction.create({
    data: {
      contactId: reminder.contactId,
      type: "sms",
      subject: `תזכורת תשלום`,
      content: `נשלחה תזכורת תשלום מסוג ${reminder.type}`,
      channel: "sms",
      direction: "outbound",
    },
  });
}

// GET endpoint to check pending reminders (for debugging/monitoring)
export async function GET(request: NextRequest) {
  try {
    const pendingCount = await db.paymentReminder.count({
      where: {
        status: "pending",
        scheduledFor: {
          lte: new Date(),
        },
      },
    });

    const upcomingCount = await db.paymentReminder.count({
      where: {
        status: "pending",
        scheduledFor: {
          gt: new Date(),
        },
      },
    });

    return NextResponse.json({
      pendingToSend: pendingCount,
      upcoming: upcomingCount,
    });
  } catch (error) {
    console.error("Error checking reminders:", error);
    return NextResponse.json(
      { error: "Failed to check reminders" },
      { status: 500 }
    );
  }
}
