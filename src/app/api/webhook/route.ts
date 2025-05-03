import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { matchId, quantity, category, userId, planId } = session.metadata || {};

    try {
      if (session.mode === 'subscription') {
        // Handle membership subscription
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const customer = await stripe.customers.retrieve(session.customer as string);
        
        // Update user's membership status and info
        await prisma.user.update({
          where: { id: userId },
          data: {
            isMember: true,
            memberSince: new Date(),
            membershipType: planId === 'premium' ? 'Premium' : 'VIP',
            email: session.metadata?.email,
            name: session.metadata?.name,
            image: session.metadata?.image,
          },
        });

        // Create membership record
        await prisma.membership.create({
          data: {
            userId: userId!,
            planId: planId!,
            stripeCustomerId: customer.id,
            stripeSubscriptionId: subscription.id,
            endDate: new Date(subscription.current_period_end * 1000),
          },
        });
      } else {
        // Handle ticket purchase
        await prisma.user.update({
          where: { id: userId },
          data: {
            email: session.metadata?.email,
            name: session.metadata?.name,
            image: session.metadata?.image,
          },
        });
        await prisma.ticket.create({
          data: {
            matchId: matchId!,
            quantity: parseInt(quantity!),
            category: category!,
            userId: userId!,
          },
        });
      }

      return NextResponse.json({ received: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      return NextResponse.json(
        { error: 'Failed to process webhook' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
} 