import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

const memberships = [
  {
    id: 'basic',
    name: 'Basic Membership',
    price: 0,
    stripePriceId: null,
    description: 'Free access to public content and news.',
    benefits: [
      'Access to public news',
      'View match schedules',
      'Join the community',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Membership',
    price: 99,
    stripePriceId: 'price_1RKc9W09wIpZTJdbDev5vEQA',
    description: 'Unlock premium features and exclusive content.',
    benefits: [
      'All Basic benefits',
      'Priority ticket booking',
      'Exclusive member events',
      'Discounts on merchandise',
    ],
  },
  {
    id: 'vip',
    name: 'VIP Membership',
    price: 199,
    stripePriceId: 'price_1RKcA209wIpZTJdbHgR2Fwnv',
    description: 'All-access pass to everything FC ESCUELA offers.',
    benefits: [
      'All Premium benefits',
      'Meet & greet with players',
      'VIP lounge access',
      'Personalized club gifts',
    ],
  },
];

export async function GET() {
  return NextResponse.json(memberships);
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { planId } = await request.json();
    const plan = memberships.find((m) => m.id === planId);
    if (!plan || plan.price === 0 || !plan.stripePriceId) {
      return NextResponse.json({ error: 'Invalid or free plan selected' }, { status: 400 });
    }
    const stripeSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        planId: plan.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      },
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/orders?success=1`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/membership?canceled=1`,
    });
    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
} 