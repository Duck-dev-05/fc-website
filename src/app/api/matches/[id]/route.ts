export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
      },
    })
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
    return NextResponse.json({ message: 'Match deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete match' },
      { status: 500 }
    )
  }
} 