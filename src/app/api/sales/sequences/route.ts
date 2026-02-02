import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all email sequences
export async function GET() {
  try {
    const sequences = await db.emailSequence.findMany({
      include: {
        emails: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(sequences);
  } catch (error) {
    console.error("Error fetching sequences:", error);
    return NextResponse.json(
      { error: "Failed to fetch sequences" },
      { status: 500 }
    );
  }
}

// POST create new sequence
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, trigger, isActive, emails } = body;

    if (!name || !trigger) {
      return NextResponse.json(
        { error: "name and trigger are required" },
        { status: 400 }
      );
    }

    const sequence = await db.emailSequence.create({
      data: {
        name,
        description: description || null,
        trigger,
        isActive: isActive ?? true,
        emails: emails
          ? {
              create: emails.map((email: any, index: number) => ({
                name: email.name,
                subject: email.subject,
                body: email.body,
                delayDays: email.delayDays || 0,
                delayHours: email.delayHours || 0,
                order: index,
                isActive: email.isActive ?? true,
              })),
            }
          : undefined,
      },
      include: {
        emails: true,
      },
    });

    return NextResponse.json(sequence, { status: 201 });
  } catch (error) {
    console.error("Error creating sequence:", error);
    return NextResponse.json(
      { error: "Failed to create sequence" },
      { status: 500 }
    );
  }
}
