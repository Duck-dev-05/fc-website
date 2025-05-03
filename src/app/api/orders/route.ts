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

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ orders: [] });
    }

    // Fetch both tickets and memberships
    const [tickets, memberships] = await Promise.all([
      prisma.ticket.findMany({
        where: { userId: user.id },
        include: { match: true },
        orderBy: { purchaseDate: 'desc' },
      }),
      (prisma as any).membership.findMany({
        where: { userId: user.id },
        orderBy: { startDate: 'desc' },
      }),
    ]);

    // Combine and format the orders
    const orders: Order[] = [
      ...tickets.map((ticket: Ticket & { match: Match }) => ({
        type: 'ticket',
        id: ticket.id,
        date: ticket.purchaseDate,
        details: {
          match: {
            id: ticket.match.id,
            name: `${ticket.match.homeTeam} vs ${ticket.match.awayTeam}`,
            date: ticket.match.date.toLocaleDateString(),
            time: ticket.match.time,
            venue: ticket.match.venue,
          },
          quantity: ticket.quantity,
          category: ticket.category,
        },
      })),
      ...memberships.map((membership: any) => ({
        type: 'membership',
        id: membership.id,
        date: membership.startDate,
        details: {
          planId: membership.planId,
          status: membership.status,
          endDate: membership.endDate,
        },
      })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('ORDERS API ERROR:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
} 