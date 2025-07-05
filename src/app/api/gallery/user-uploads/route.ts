import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    
    const whereClause: any = {
      userId: session.user.id,
    };

    if (category && category !== "all") {
      whereClause.category = category;
    }

    const images = await prisma.galleryImage.findMany({
      where: whereClause,
      orderBy: {
        uploadedAt: "desc",
      },
      include: {
        uploadedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error fetching user uploads:", error);
    return NextResponse.json({ error: "Failed to fetch user uploads" }, { status: 500 });
  }
} 