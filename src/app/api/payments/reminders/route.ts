import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all payment reminders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const contactId = searchParams.get("contactId");
    const type = searchParams.get("type");

    const where: any = {};
    if (status) where.status = status;
    if (contactId) where.contactId = contactId;
    if (type) where.type = type;

    const reminders = await db.paymentReminder.findMany({
      where,
      include: {
        contact: true,
        deal: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        scheduledFor: "asc",
      },
    });

    return NextResponse.json(reminders);
  } catch (error) {
    console.error("Error fetching reminders:", error);
    return NextResponse.json(
      { error: "Failed to fetch reminders" },
      { status: 500 }
    );
  }
}

// POST create payment reminder
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      dealId,
      contactId,
      type,
      amount,
      dueDate,
      scheduledFor,
      sendVia,
    } = body;

    if (!contactId || !type || !scheduledFor) {
      return NextResponse.json(
        { error: "contactId, type, and scheduledFor are required" },
        { status: 400 }
      );
    }

    const reminder = await db.paymentReminder.create({
      data: {
        dealId: dealId || null,
        contactId,
        type,
        amount: amount || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        scheduledFor: new Date(scheduledFor),
        sendVia: sendVia || "email",
        status: "pending",
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

    return NextResponse.json(reminder, { status: 201 });
  } catch (error) {
    console.error("Error creating reminder:", error);
    return NextResponse.json(
      { error: "Failed to create reminder" },
      { status: 500 }
    );
  }
}

// DELETE reminder
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    await db.paymentReminder.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    return NextResponse.json(
      { error: "Failed to delete reminder" },
      { status: 500 }
    );
  }
}
