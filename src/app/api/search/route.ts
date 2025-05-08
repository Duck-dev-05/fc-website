import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query')?.toLowerCase() || '';

    if (!query) {
      return NextResponse.json({ news: [], team: [], matches: [] });
    }

    // Search News
    const news = await prisma.news.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { author: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { id: true, title: true, content: true, author: true, category: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    // Search Team Members
    const team = await prisma.teamMember.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { role: { contains: query, mode: 'insensitive' } },
          { bio: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { id: true, name: true, role: true, bio: true, image: true },
      orderBy: { order: 'asc' },
    });

    // Search Matches
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { homeTeam: { contains: query, mode: 'insensitive' } },
          { awayTeam: { contains: query, mode: 'insensitive' } },
          { competition: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { status: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: { id: true, homeTeam: true, awayTeam: true, date: true, competition: true, description: true },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ news, team, matches });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 