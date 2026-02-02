import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET sent messages history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");

    const messages = await db.sentMessage.findMany({
      where: {
        ...(platform && { platform }),
        ...(status && { status }),
      },
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        template: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
      orderBy: { sentAt: "desc" },
      take: limit,
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
