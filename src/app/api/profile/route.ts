import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await req.json();
  try {
    // Only allow if admin or user is updating their own profile
    if (!session.user?.roles?.includes('admin') && session.user.email !== data.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const updatedUser = await prisma.user.update({
      where: { email: data.email },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        username: true,
        phone: true,
        dob: true,
        address: true,
        gender: true,
        nationality: true,
        language: true,
        bio: true,
        website: true,
        occupation: true,
        favoriteTeam: true,
        isMember: true,
        membershipType: true,
        memberSince: true,
        emailVerified: true,
        roles: true,
      },
    });
    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        username: true,
        phone: true,
        dob: true,
        address: true,
        gender: true,
        nationality: true,
        language: true,
        bio: true,
        website: true,
        occupation: true,
        favoriteTeam: true,
        isMember: true,
        membershipType: true,
        memberSince: true,
        emailVerified: true,
        roles: true,
      },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    // Only allow if admin or user is accessing their own profile
    if (!session.user?.roles?.includes('admin') && session.user.email !== user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}