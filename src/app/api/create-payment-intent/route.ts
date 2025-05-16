import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

type TicketCategory = 'standard' | 'premium' | 'vip';

const PRICE_MULTIPLIERS: Record<TicketCategory, number> = {
  standard: 1,
  premium: 1.5,
  vip: 2
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

const prisma = new PrismaClient();

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
    if (!Object.keys(PRICE_MULTIPLIERS).includes(category)) {
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

    // Calculate price
    const basePrice = 30; // Base price per ticket
    const multiplier = PRICE_MULTIPLIERS[category as TicketCategory];
    const amount = Math.round(basePrice * quantity * multiplier * 100); // Convert to cents

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        matchId,
        quantity,
        category,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
} 