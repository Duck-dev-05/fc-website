export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCachedData, setCachedData, deleteCachedData } from '@/lib/redis';

const CACHE_KEY = 'matches:all';
const CACHE_TTL = 1800; // 30 minutes

// GET /api/matches - Get all matches
export async function GET() {
  try {
    // Try to get cached data first
    const cachedMatches = await getCachedData(CACHE_KEY);
    if (cachedMatches) {
      return NextResponse.json(cachedMatches);
    }

    const matches = await prisma.match.findMany({
      orderBy: {
        date: 'asc'
      }
    });

    // Process matches to set status based on date and score
    const processedMatches = matches.map(match => {
      const matchDate = new Date(match.date);
      const now = new Date();
      
      // If match has a score, it's finished
      if (match.score) {
        return { ...match, status: 'Finished' };
      }
      
      // If match date is in the past, it's finished
      if (matchDate < now) {
        return { ...match, status: 'Finished' };
      }
      
      // Otherwise, it's scheduled
      return { ...match, status: 'Scheduled' };
    });
    
    // Cache the matches data
    await setCachedData(CACHE_KEY, processedMatches, CACHE_TTL);
    
    return NextResponse.json(processedMatches);
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
        score: data.score,
        status: data.score ? 'Finished' : 'Scheduled'
      }
    });
    
    // Invalidate the matches cache when a new match is added
    await deleteCachedData(CACHE_KEY);
    
    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json(
      { error: 'Failed to create match' },
      { status: 500 }
    );
  }
} 