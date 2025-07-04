export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import { getCachedData, setCachedData, deleteCachedData } from '@/lib/redis';

const CACHE_KEY = 'matches:all';
const CACHE_TTL = 1800; // 30 minutes

// GET /api/matches - Get all matches, optionally filter by status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status');

    // Temporarily disable Redis cache for debugging
    // const cachedMatches = await getCachedData(CACHE_KEY);
    // let matches;
    // if (cachedMatches) {
    //   matches = cachedMatches;
    // } else {
      const dbMatches = await prisma.match.findMany({
        orderBy: {
          date: 'asc'
        }
      });
      console.log('DB Matches:', dbMatches);
      let matches = dbMatches.map((match: any) => {
        const matchDate = new Date(match.date);
        const now = new Date();
        if (match.score) {
          return { ...match, status: 'Finished' };
        }
        if (matchDate < now) {
          return { ...match, status: 'Finished' };
        }
        return { ...match, status: 'Scheduled' };
      });
      // Mark the next 3 scheduled matches as 'Upcoming'
      let upcomingCount = 0;
      for (let i = 0; i < matches.length; i++) {
        if (matches[i].status === 'Scheduled' && upcomingCount < 3) {
          matches[i].status = 'Upcoming';
          upcomingCount++;
        }
      }
      // await setCachedData(CACHE_KEY, matches, CACHE_TTL);
    // }

    // Filter by status if requested
    let filteredMatches = matches;
    if (statusFilter) {
      filteredMatches = matches.filter((m: any) => m.status === statusFilter);
    }

    return NextResponse.json(filteredMatches);
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
    // await deleteCachedData(CACHE_KEY);
    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json(
      { error: 'Failed to create match' },
      { status: 500 }
    );
  }
} 