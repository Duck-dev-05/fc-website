import { NextRequest, NextResponse } from 'next/server';
import { getCachedData, setCachedData, deleteCachedData } from '@/lib/redis';
import { prisma } from '@/lib/prisma';
import redis from '@/lib/redis';

const MATCHES_CACHE_KEY = 'test:matches';
const TICKETS_CACHE_KEY = 'test:tickets';
const MEMBERSHIPS_CACHE_KEY = 'test:memberships';
const TEAM_CACHE_KEY = 'test:team';
const CACHE_TTL = 60; // 1 minute for testing

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get('type') || 'matches';

    switch (type) {
      case 'matches': {
        const cachedMatches = await getCachedData(MATCHES_CACHE_KEY);
        if (cachedMatches) {
          return NextResponse.json({
            message: 'Matches retrieved from cache',
            data: {
              matches: cachedMatches,
              timestamp: new Date().toISOString()
            }
          });
        }

        const matches = await prisma.match.findMany({
          orderBy: {
            date: 'asc'
          },
          take: 5
        });

        await setCachedData(MATCHES_CACHE_KEY, matches, CACHE_TTL);
        return NextResponse.json({
          message: 'Matches data created and cached',
          data: {
            matches,
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'tickets': {
        const cachedTickets = await getCachedData(TICKETS_CACHE_KEY);
        if (cachedTickets) {
          return NextResponse.json({
            message: 'Tickets retrieved from cache',
            data: {
              tickets: cachedTickets,
              timestamp: new Date().toISOString()
            }
          });
        }

        const tickets = await prisma.ticket.findMany({
          orderBy: {
            purchaseDate: 'desc'
          },
          take: 5,
          include: {
            match: true
          }
        });

        await setCachedData(TICKETS_CACHE_KEY, tickets, CACHE_TTL);
        return NextResponse.json({
          message: 'Tickets data created and cached',
          data: {
            tickets,
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'memberships': {
        const cachedMemberships = await getCachedData(MEMBERSHIPS_CACHE_KEY);
        if (cachedMemberships) {
          return NextResponse.json({
            message: 'Memberships retrieved from cache',
            data: {
              memberships: cachedMemberships,
              timestamp: new Date().toISOString()
            }
          });
        }

        const memberships = await prisma.membership.findMany({
          orderBy: {
            startDate: 'desc'
          },
          take: 5,
          include: {
            user: true
          }
        });

        await setCachedData(MEMBERSHIPS_CACHE_KEY, memberships, CACHE_TTL);
        return NextResponse.json({
          message: 'Memberships data created and cached',
          data: {
            memberships,
            timestamp: new Date().toISOString()
          }
        });
      }

      case 'team': {
        const cachedTeam = await getCachedData(TEAM_CACHE_KEY);
        if (cachedTeam) {
          return NextResponse.json({
            message: 'Team data retrieved from cache',
            data: {
              team: cachedTeam,
              timestamp: new Date().toISOString()
            }
          });
        }

        const team = await prisma.teamMember.findMany({
          orderBy: {
            order: 'asc'
          }
        });

        await setCachedData(TEAM_CACHE_KEY, team, CACHE_TTL);
        return NextResponse.json({
          message: 'Team data created and cached',
          data: {
            team,
            timestamp: new Date().toISOString()
          }
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid data type requested' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Redis test error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { type } = data;

    switch (type) {
      case 'matches':
        await deleteCachedData(MATCHES_CACHE_KEY);
        break;
      case 'tickets':
        await deleteCachedData(TICKETS_CACHE_KEY);
        break;
      case 'memberships':
        await deleteCachedData(MEMBERSHIPS_CACHE_KEY);
        break;
      case 'team':
        await deleteCachedData(TEAM_CACHE_KEY);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid cache type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      message: `${type} cache cleared successfully`
    });
  } catch (error) {
    console.error('Redis clear error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to clear cache',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 