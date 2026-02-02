import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all leads with contact info
export async function GET(request: NextRequest) {
  try {
    const leads = await db.lead.findMany({
      include: {
        contact: true,
        product: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

// POST create new lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contactId, status, score, source, campaign, productId, notes } = body;

    if (!contactId) {
      return NextResponse.json(
        { error: "contactId is required" },
        { status: 400 }
      );
    }

    const lead = await db.lead.create({
      data: {
        contactId,
        status: status || "new",
        score: score || 0,
        source: source || null,
        campaign: campaign || null,
        productId: productId || null,
        notes: notes || null,
      },
      include: {
        contact: true,
        product: true,
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}

// PATCH update lead status (for Kanban drag & drop)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 }
      );
    }

    const lead = await db.lead.update({
      where: { id },
      data: {
        status,
        convertedAt: status === "converted" ? new Date() : null,
      },
      include: {
        contact: true,
        product: true,
      },
    });

    return NextResponse.json(lead);
  } catch (error) {
    console.error("Error updating lead status:", error);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 }
    );
  }
}
