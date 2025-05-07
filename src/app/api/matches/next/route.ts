import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date();
    const nextMatch = await prisma.match.findFirst({
      where: {
        date: { gt: now },
      },
      orderBy: {
        date: 'asc',
      },
    });
    if (!nextMatch) {
      return NextResponse.json(null);
    }
    return NextResponse.json(nextMatch);
  } catch (error) {
    console.error('Error fetching next match:', error);
    return NextResponse.json({ error: 'Failed to fetch next match' }, { status: 500 });
  }
} 