import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all contacts
export async function GET(request: NextRequest) {
  try {
    const contacts = await db.contact.findMany({
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data to flatten tags
    const transformedContacts = contacts.map((contact) => ({
      ...contact,
      tags: contact.tags.map((ct) => ct.tag),
    }));

    return NextResponse.json(transformedContacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

// POST create new contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, city, source, status, type, notes } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Missing required fields: firstName, lastName, email" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingContact = await db.contact.findUnique({
      where: { email },
    });

    if (existingContact) {
      return NextResponse.json(
        { error: "A contact with this email already exists" },
        { status: 409 }
      );
    }

    const contact = await db.contact.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        city: city || null,
        source: source || null,
        status: status || "active",
        type: type || "other",
        notes: notes || null,
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    );
  }
}
