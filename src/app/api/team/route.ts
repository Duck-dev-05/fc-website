export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ADMIN_API_URL = process.env.ADMIN_API_URL || 'http://localhost:3001/api/players';

export async function GET() {
  // Try admin API first
  try {
    const res = await fetch(ADMIN_API_URL, { cache: 'no-store' });
    if (res.ok) {
      const players = await res.json();
      return NextResponse.json(players);
    } else {
      throw new Error('Admin API not available or returned error');
    }
  } catch (error) {
    // Fallback: fetch directly from database
    try {
      const team = await prisma.teamMember.findMany();
      return NextResponse.json({ team });
    } catch (dbError) {
      console.error('Failed to fetch team members from both admin API and DB:', dbError);
      return NextResponse.json(
        { error: dbError instanceof Error ? dbError.message : String(dbError) },
        { status: 500 }
      );
    }
  }
} 