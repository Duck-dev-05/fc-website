import { NextResponse } from 'next/server';

const ADMIN_API_URL = 'http://localhost:3001/api/players'; // Update if your admin runs elsewhere

export async function GET() {
  try {
    const res = await fetch(ADMIN_API_URL, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch players from admin API');
    }
    const players = await res.json();
    return NextResponse.json(players);
  } catch (error) {
    console.error('Failed to fetch team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
} 