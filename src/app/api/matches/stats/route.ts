import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const matches = await prisma.match.findMany();
    let played = 0, won = 0, drawn = 0, lost = 0, goalsFor = 0, goalsAgainst = 0, points = 0;
    const teamName = 'FC ESCUELA'; // Change if needed
    for (const match of matches) {
      if (!match.score) continue;
      played++;
      const [homeGoals, awayGoals] = match.score.split('-').map(Number);
      const isHome = match.homeTeam === teamName;
      const isAway = match.awayTeam === teamName;
      if (!isHome && !isAway) continue;
      const gf = isHome ? homeGoals : awayGoals;
      const ga = isHome ? awayGoals : homeGoals;
      goalsFor += gf;
      goalsAgainst += ga;
      if (gf > ga) won++;
      else if (gf === ga) drawn++;
      else lost++;
      points += gf > ga ? 3 : gf === ga ? 1 : 0;
    }
    return NextResponse.json({ played, won, drawn, lost, goalsFor, goalsAgainst, points });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to calculate stats' }, { status: 500 });
  }
} 