import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCachedData, setCachedData } from '@/lib/redis';

const CACHE_KEY = 'recent-matches:all';
const CACHE_TTL = 1800; // 30 minutes

// GET /api/recent-matches - Get recent matches with pagination
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    // Try to get cached data first (cache only the first page)
    if (page === 1) {
      const cachedMatches = await getCachedData(CACHE_KEY);
      if (cachedMatches) {
        return NextResponse.json(cachedMatches.slice(0, limit));
      }
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
      skip,
      take: limit
    });

    // Process matches to include additional information
    const processedMatches = matches.map((match: any) => ({
      ...match,
      status: 'Finished',
      daysAgo: Math.floor((now.getTime() - new Date(match.date).getTime()) / (1000 * 60 * 60 * 24))
    }));
    
    // Cache the first page of matches data
    if (page === 1) {
      await setCachedData(CACHE_KEY, processedMatches, CACHE_TTL);
    }
    
    return NextResponse.json(processedMatches);
  } catch (error) {
    console.error('Error fetching recent matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent matches' },
      { status: 500 }
    );
  }
} 