export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { deleteCachedData } from '@/lib/redis'

const CACHE_KEY = 'matches:all';

// GET /api/matches/[id] - Get a specific match
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const match = await prisma.match.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // Process match status
    const matchDate = new Date(match.date);
    const now = new Date();
    
    if (match.score) {
      match.status = 'Finished';
    } else if (matchDate < now) {
      match.status = 'Finished';
    } else {
      match.status = 'Scheduled';
    }

    return NextResponse.json(match)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch match' },
      { status: 500 }
    )
  }
}

// PUT /api/matches/[id] - Update a match
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Determine status based on score and date
    let status = body.status;
    if (body.score) {
      status = 'Finished';
    } else if (new Date(body.date) < new Date()) {
      status = 'Finished';
    } else {
      status = 'Scheduled';
    }

    const match = await prisma.match.update({
      where: {
        id: params.id,
      },
      data: {
        homeTeam: body.homeTeam,
        awayTeam: body.awayTeam,
        date: body.date ? new Date(body.date) : undefined,
        time: body.time,
        venue: body.venue,
        competition: body.competition,
        score: body.score,
        status: status,
      },
    })

    // Invalidate the matches cache
    await deleteCachedData(CACHE_KEY);

    return NextResponse.json(match)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update match' },
      { status: 500 }
    )
  }
}

// DELETE /api/matches/[id] - Delete a match
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.match.delete({
      where: {
        id: params.id,
      },
    })

    // Invalidate the matches cache
    await deleteCachedData(CACHE_KEY);

    return NextResponse.json({ message: 'Match deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete match' },
      { status: 500 }
    )
  }
} 