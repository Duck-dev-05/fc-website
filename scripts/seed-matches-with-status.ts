import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete all tickets first (to avoid FK constraint)
  await prisma.ticket.deleteMany();
  // Then delete all matches
  await prisma.match.deleteMany();

  const now = new Date();
  const matches = [
    // Scheduled (future date, no score)
    {
      homeTeam: 'FC ESCUELA',
      awayTeam: 'Future United',
      date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      time: '18:00',
      venue: 'Stadium A',
      competition: 'League',
      score: null,
    },
    // Finished (past date, with score)
    {
      homeTeam: 'FC ESCUELA',
      awayTeam: 'Past City',
      date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      time: '20:00',
      venue: 'Stadium B',
      competition: 'Cup',
      score: '2-1',
    },
    // Finished (past date, no score)
    {
      homeTeam: 'FC ESCUELA',
      awayTeam: 'Old Rivals',
      date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      time: '19:00',
      venue: 'Stadium C',
      competition: 'Friendly',
      score: null,
    },
    // Scheduled (future date, no score)
    {
      homeTeam: 'FC ESCUELA',
      awayTeam: 'Next Gen',
      date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      time: '17:00',
      venue: 'Stadium D',
      competition: 'League',
      score: null,
    },
    // Finished (past date, with score)
    {
      homeTeam: 'FC ESCUELA',
      awayTeam: 'Legends FC',
      date: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
      time: '21:00',
      venue: 'Stadium E',
      competition: 'Cup',
      score: '1-3',
    },
  ];

  for (const match of matches) {
    await prisma.match.create({ data: match });
  }

  console.log('Seeded matches with different statuses!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 