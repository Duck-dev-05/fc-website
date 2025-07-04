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
    // Scheduled (future date, no score)
    {
      homeTeam: 'FC ESCUELA',
      awayTeam: 'Rising Stars',
      date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      time: '19:30',
      venue: 'Stadium F',
      competition: 'League',
      score: null,
    },
    // Scheduled (future date, no score)
    {
      homeTeam: 'FC ESCUELA',
      awayTeam: 'Young Lions',
      date: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
      time: '16:00',
      venue: 'Stadium G',
      competition: 'Friendly',
      score: null,
    },
    // Scheduled (future date, no score)
    {
      homeTeam: 'FC ESCUELA',
      awayTeam: 'Academy FC',
      date: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000), // 28 days from now
      time: '20:00',
      venue: 'Stadium H',
      competition: 'Cup',
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
    // Add more recent finished matches (within last 30 days)
    {
      homeTeam: 'FC ESCUELA',
      awayTeam: 'Thunder FC',
      date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      time: '18:30',
      venue: 'Stadium X',
      competition: 'League',
      score: '4-2',
    },
    {
      homeTeam: 'FC ESCUELA',
      awayTeam: 'Victory FC',
      date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      time: '20:00',
      venue: 'Stadium Y',
      competition: 'Cup',
      score: '2-0',
    },
    {
      homeTeam: 'FC ESCUELA',
      awayTeam: 'Recent Rivals',
      date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      time: '19:00',
      venue: 'Stadium Z',
      competition: 'League',
      score: '3-2',
    },
    {
      homeTeam: 'FC ESCUELA',
      awayTeam: 'Blue Stars',
      date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      time: '17:00',
      venue: 'Stadium W',
      competition: 'Friendly',
      score: '1-0',
    },
    {
      homeTeam: 'FC ESCUELA',
      awayTeam: 'Red Warriors',
      date: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      time: '21:00',
      venue: 'Stadium V',
      competition: 'League',
      score: '2-1',
    },
    {
      homeTeam: 'FC ESCUELA',
      awayTeam: 'Green Eagles',
      date: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
      time: '18:00',
      venue: 'Stadium U',
      competition: 'Cup',
      score: '5-3',
    },
    {
      homeTeam: 'FC ESCUELA',
      awayTeam: 'Golden Boys',
      date: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000), // 28 days ago
      time: '20:30',
      venue: 'Stadium T',
      competition: 'League',
      score: '1-1',
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