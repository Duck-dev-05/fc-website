import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get all matches without date filtering for debugging
    const matches = await prisma.match.findMany({
      orderBy: {
        date: 'asc',
      },
    });

    console.log('Found matches:', matches); // Debug log

    // Transform the data for the frontend
    const tickets = matches.map(match => ({
      id: match.id,
      match: `${match.homeTeam} vs ${match.awayTeam}`,
      date: match.date.toISOString().split('T')[0],
      time: match.time,
      venue: match.venue,
      price: 30, // Base price
      status: "Available", // We'll implement dynamic status later
      matchId: match.id,
      availableSeats: match.stadiumCapacity || null,
    }));

    console.log('Transformed tickets:', tickets); // Debug log

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Failed to fetch tickets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { matchId, quantity, category } = data;

    // Validate the match exists and has capacity
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { tickets: true },
    });

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      );
    }

    if (match.stadiumCapacity && match.tickets.length + quantity > match.stadiumCapacity) {
      return NextResponse.json(
        { error: 'Not enough available seats' },
        { status: 400 }
      );
    }

    // Create the ticket
    const ticket = await prisma.ticket.create({
      data: {
        matchId,
        quantity,
        category,
        userId: session.user.id,
      },
    });

    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Failed to create ticket:', error);
    return NextResponse.json(
      { error: 'Failed to create ticket' },
      { status: 500 }
    );
  }
} 