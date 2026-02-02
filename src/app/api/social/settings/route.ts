import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all social media settings
export async function GET() {
  try {
    const settings = await db.socialMediaSettings.findMany({
      orderBy: { platform: "asc" },
    });

    // Initialize default settings if none exist
    if (settings.length === 0) {
      const platforms = ["whatsapp", "instagram", "facebook"];
      const created = await Promise.all(
        platforms.map((platform) =>
          db.socialMediaSettings.create({
            data: { platform, isActive: false },
          })
        )
      );
      return NextResponse.json(created);
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching social settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// POST update settings for a platform
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, isActive, phoneNumberId, businessAccountId, accessToken, pageId, instagramId } = body;

    if (!platform) {
      return NextResponse.json(
        { error: "Platform is required" },
        { status: 400 }
      );
    }

    const settings = await db.socialMediaSettings.upsert({
      where: { platform },
      create: {
        platform,
        isActive: isActive ?? false,
        phoneNumberId: phoneNumberId || null,
        businessAccountId: businessAccountId || null,
        accessToken: accessToken || null,
        pageId: pageId || null,
        instagramId: instagramId || null,
      },
      update: {
        isActive: isActive ?? undefined,
        phoneNumberId: phoneNumberId !== undefined ? phoneNumberId || null : undefined,
        businessAccountId: businessAccountId !== undefined ? businessAccountId || null : undefined,
        accessToken: accessToken !== undefined ? accessToken || null : undefined,
        pageId: pageId !== undefined ? pageId || null : undefined,
        instagramId: instagramId !== undefined ? instagramId || null : undefined,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating social settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
