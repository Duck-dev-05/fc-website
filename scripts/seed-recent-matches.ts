import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const now = new Date();
  const recentDates = [
    2, 5, 8, 12, 15, 18, 21, 24, 27, 29
  ].map(daysAgo => {
    const d = new Date(now);
    d.setDate(now.getDate() - daysAgo);
    return d;
  });

  const matchesData = recentDates.map((date, idx) => ({
    homeTeam: `FC ESCUELA`,
    awayTeam: `Rival Club ${idx + 1}`,
    date: date.toISOString(),
    time: '18:00',
    venue: 'Main Stadium',
    competition: 'League',
    score: `${2 + idx % 3}-${1 + (idx + 1) % 2}`,
    status: 'Finished',
  }));

  for (const match of matchesData) {
    await prisma.match.create({ data: match });
    console.log(`Created match: ${match.homeTeam} vs ${match.awayTeam} on ${match.date}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 