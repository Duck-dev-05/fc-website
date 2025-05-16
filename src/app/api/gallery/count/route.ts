import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const count = await prisma.galleryImage.count({
      where: {
        userId: userId,
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error getting upload count:", error);
    return NextResponse.json({ error: "Failed to get upload count" }, { status: 500 });
  }
} 