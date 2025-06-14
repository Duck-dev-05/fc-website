import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient, Ticket, Match } from '@prisma/client';

const prisma = new PrismaClient();

interface Order {
  type: 'ticket' | 'membership';
  id: string;
  date: Date;
  details: {
    match?: {
      id: string;
      name: string;
      date: string;
      time: string;
      venue: string;
    };
    quantity?: number;
    category?: string;
    planId?: string;
    status?: string;
    endDate?: Date;
  };
}

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Only allow if admin or user is accessing their own orders
  if (!session.user?.roles?.includes('admin')) {
    // Only allow access to their own orders
    // (Assume userId is always session.user.id for non-admins)
  }
  try {
    // Fetch tickets for the user, including match info and purchaseDate
    const tickets = await prisma.ticket.findMany({
      where: { userId: session.user.id },
      include: {
        match: true,
      },
      orderBy: { purchaseDate: 'desc' },
    });

    // Map to Order format
    const orders = tickets.map(ticket => ({
      type: 'ticket',
      id: ticket.id,
      date: ticket.purchaseDate,
      details: {
        match: ticket.match
          ? {
              id: ticket.match.id,
              name: `${ticket.match.homeTeam} vs ${ticket.match.awayTeam}`,
              date: ticket.match.date.toISOString().slice(0, 10),
              time: ticket.match.time,
              venue: ticket.match.venue,
            }
          : undefined,
        quantity: ticket.quantity,
        category: ticket.category,
      },
    }));

    // TODO: Add membership orders if needed

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
} 