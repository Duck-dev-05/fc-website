import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.roles || !session.user.roles.includes('admin')) {
    return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true, name: true, email: true, roles: true, lastLogin: true },
    });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.roles || !session.user.roles.includes('admin')) {
    return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
  }
  try {
    const { name, email, roles } = await req.json();
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { id: params.id } });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const user = await prisma.user.update({
      where: { id: params.id },
      data: { name, email, roles },
      select: { id: true, name: true, email: true, roles: true },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to update user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.roles || !session.user.roles.includes('admin')) {
    return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
  }
  try {
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
} 