import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.roles || !session.user.roles.includes('admin')) {
    return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
  }
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        roles: true,
        lastLogin: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.roles || !session.user.roles.includes('admin')) {
    return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
  }
  try {
    const { name, email, roles } = await req.json();
    const user = await prisma.user.create({
      data: { name, email, roles },
      select: { id: true, name: true, email: true, roles: true },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to create user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
} 