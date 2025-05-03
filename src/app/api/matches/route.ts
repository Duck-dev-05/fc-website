import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/matches - Get all matches
export async function GET() {
  try {
    const matches = await prisma.match.findMany({
      orderBy: {
        date: 'asc'
      }
    });
    
    return NextResponse.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}

// POST /api/matches - Create a new match
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const match = await prisma.match.create({
      data: {
        homeTeam: data.homeTeam,
        awayTeam: data.awayTeam,
        date: new Date(data.date),
        time: data.time,
        venue: data.venue,
        competition: data.competition,
        score: data.score
      }
    });
    
    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json(
      { error: 'Failed to create match' },
      { status: 500 }
    );
  }
} 