import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCachedData, setCachedData } from '@/lib/redis';

const CACHE_KEY = 'recent-matches:all';
const CACHE_TTL = 1800; // 30 minutes

// GET /api/recent-matches - Get recent matches
export async function GET() {
  try {
    // Try to get cached data first
    const cachedMatches = await getCachedData(CACHE_KEY);
    if (cachedMatches) {
      return NextResponse.json(cachedMatches);
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

    const matches = await prisma.match.findMany({
      where: {
        date: {
          lte: now,
          gte: thirtyDaysAgo
        },
        score: {
          not: null
        }
      },
      orderBy: {
        date: 'desc'
      },
      take: 10 // Get only the 10 most recent matches
    });

    // Process matches to include additional information
    const processedMatches = matches.map(match => ({
      ...match,
      status: 'Finished',
      daysAgo: Math.floor((now.getTime() - new Date(match.date).getTime()) / (1000 * 60 * 60 * 24))
    }));
    
    // Cache the matches data
    await setCachedData(CACHE_KEY, processedMatches, CACHE_TTL);
    
    return NextResponse.json(processedMatches);
  } catch (error) {
    console.error('Error fetching recent matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent matches' },
      { status: 500 }
    );
  }
} 