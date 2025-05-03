import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

const prisma = new PrismaClient();

type TicketCategory = 'standard' | 'premium' | 'vip';

const PRICE_MULTIPLIERS: Record<TicketCategory, number> = {
  standard: 1,
  premium: 1.5,
  vip: 2
};

const TICKET_PRICE_IDS: Record<TicketCategory, string> = {
  standard: 'price_1RKc8J09wIpZTJdbYYii8J4F', // Replace with your real Stripe Price ID
  premium: 'price_1RKc8f09wIpZTJdbFdW5zhmW', // Replace with your real Stripe Price ID
  vip: 'price_1RKc9109wIpZTJdbZpHS9fdt',     // Replace with your real Stripe Price ID
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { matchId, quantity, category } = await request.json();

    // Validate category
    if (!Object.keys(TICKET_PRICE_IDS).includes(category)) {
      return NextResponse.json(
        { error: 'Invalid ticket category' },
        { status: 400 }
      );
    }

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

    const priceId = TICKET_PRICE_IDS[category as TicketCategory];

    // Create Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      metadata: {
        matchId,
        quantity: quantity.toString(),
        category,
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      },
      success_url: `${process.env.NEXTAUTH_URL}/tickets/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/tickets`,
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 