import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { roles: true },
  });

  if (!user?.roles.includes("admin")) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const userId = searchParams.get("userId");
    
    const whereClause: any = {};

    if (category && category !== "all") {
      whereClause.category = category;
    }

    if (userId) {
      whereClause.userId = userId;
    }

    const images = await prisma.galleryImage.findMany({
      where: whereClause,
      orderBy: {
        uploadedAt: "desc",
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error fetching all uploads:", error);
    return NextResponse.json({ error: "Failed to fetch uploads" }, { status: 500 });
  }
} 