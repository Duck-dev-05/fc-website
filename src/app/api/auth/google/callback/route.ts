import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    // Exchange the code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Error getting tokens:', tokens);
      return NextResponse.json(
        { error: 'Failed to get access token' },
        { status: 400 }
      );
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      console.error('Error getting user info:', userData);
      return NextResponse.json(
        { error: 'Failed to get user info' },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: userData.email },
      include: { accounts: true },
    });

    if (!user) {
      // Create new user
      const username = userData.email.split('@')[0];
      let uniqueUsername = username;
      let counter = 1;

      // Ensure username uniqueness
      while (await prisma.user.findFirst({ where: { username: uniqueUsername } })) {
        uniqueUsername = `${username}${counter}`;
        counter++;
      }

      user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          image: userData.picture,
          username: uniqueUsername,
          role: 'user',
          emailVerified: new Date(),
          profileInitialized: true,
          favoriteTeam: 'FC Escuela',
          language: 'English',
          accounts: {
            create: {
              type: 'oauth',
              provider: 'google',
              providerAccountId: userData.id,
              access_token: tokens.access_token,
              token_type: tokens.token_type,
              scope: tokens.scope,
              id_token: tokens.id_token,
              expires_at: Math.floor(Date.now() / 1000) + tokens.expires_in,
            },
          },
        },
        include: { accounts: true },
      });
    } else {
      // Update existing user's Google account
      const existingAccount = user.accounts.find(
        (acc) => acc.provider === 'google'
      );

      if (!existingAccount) {
        await prisma.account.create({
          data: {
            userId: user.id,
            type: 'oauth',
            provider: 'google',
            providerAccountId: userData.id,
            access_token: tokens.access_token,
            token_type: tokens.token_type,
            scope: tokens.scope,
            id_token: tokens.id_token,
            expires_at: Math.floor(Date.now() / 1000) + tokens.expires_in,
          },
        });
      } else {
        await prisma.account.update({
          where: { id: existingAccount.id },
          data: {
            access_token: tokens.access_token,
            token_type: tokens.token_type,
            scope: tokens.scope,
            id_token: tokens.id_token,
            expires_at: Math.floor(Date.now() / 1000) + tokens.expires_in,
          },
        });
      }

      // Update user profile
      await prisma.user.update({
        where: { id: user.id },
        data: {
          name: userData.name,
          image: userData.picture,
          emailVerified: new Date(),
        },
      });
    }

    // Create session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        sessionToken: Math.random().toString(36).substring(2),
      },
    });

    // Set session cookie
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('next-auth.session-token', session.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Google callback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 