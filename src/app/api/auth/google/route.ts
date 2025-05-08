import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  // Check NEXTAUTH_URL
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  if (!nextAuthUrl) {
    console.error('ERROR: NEXTAUTH_URL is not set in your environment variables.');
    return NextResponse.json({ error: 'NEXTAUTH_URL is not set in your environment variables.' }, { status: 500 });
  }
  if (!nextAuthUrl.includes('localhost:3000')) {
    console.warn('WARNING: NEXTAUTH_URL does not include localhost:3000. Current value:', nextAuthUrl);
  }

  // Generate a random state parameter for security
  const state = Math.random().toString(36).substring(2);

  // Store state in session or database if needed
  // For now, we'll just use it in the URL

  // Construct Google OAuth URL
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.append('client_id', process.env.GOOGLE_CLIENT_ID!);
  googleAuthUrl.searchParams.append('redirect_uri', `${nextAuthUrl}/api/auth/google/callback`);
  googleAuthUrl.searchParams.append('response_type', 'code');
  googleAuthUrl.searchParams.append('scope', 'email profile');
  googleAuthUrl.searchParams.append('state', state);
  googleAuthUrl.searchParams.append('access_type', 'offline');
  googleAuthUrl.searchParams.append('prompt', 'consent');

  return NextResponse.redirect(googleAuthUrl.toString());
} 