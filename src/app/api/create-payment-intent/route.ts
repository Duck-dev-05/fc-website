import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
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
    const multiplier = {
      standard: 1,
      premium: 1.5,
      vip: 2
    }[category] || 1;
    
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