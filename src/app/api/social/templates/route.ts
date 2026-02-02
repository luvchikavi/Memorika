import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all message templates
export async function GET() {
  try {
    const templates = await db.messageTemplate.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { sentMessages: true },
        },
      },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

// POST create new template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, platform, category, content, mediaUrl, targetAudience, isActive } = body;

    if (!name || !platform || !category || !content) {
      return NextResponse.json(
        { error: "name, platform, category, and content are required" },
        { status: 400 }
      );
    }

    const template = await db.messageTemplate.create({
      data: {
        name,
        platform,
        category,
        content,
        mediaUrl: mediaUrl || null,
        targetAudience: targetAudience || null,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    );
  }
}
