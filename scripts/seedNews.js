const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Delete all existing news posts to avoid duplicates
  await prisma.news.deleteMany();

  await prisma.news.createMany({
    data: [
      {
        title: 'FC ESCUELA Wins the Championship!',
        content: 'FC ESCUELA secured a thrilling victory in the finals, bringing home the championship trophy for the first time in club history.',
        imageUrl: '/images/z6087575494598_87ab786058a0e1cbc9c915cbb42d1ca1.jpg',
        author: 'Club Reporter',
        category: 'Match Report',
      },
      {
        title: 'New Coach Announced',
        content: 'We are excited to welcome our new head coach, who brings years of experience and a fresh vision to the club.',
        imageUrl: '/images/z6087575487897_c240c4136fbe9e856d64f7be0811014d.jpg',
        author: 'Admin',
        category: 'Club News',
      },
      {
        title: 'Youth Academy Tryouts Open',
        content: 'Our youth academy is now accepting applications for the upcoming season. Young talents are encouraged to apply!',
        imageUrl: '/images/z6087575482857_d05b45fd9decd52881f7b8aefc060cf2.jpg',
        author: 'Youth Coordinator',
        category: 'Academy',
      },
      {
        title: 'Stadium Renovation Completed',
        content: 'The club is proud to announce the completion of the stadium renovation, offering fans a better matchday experience.',
        imageUrl: '/images/z6087575479566_5fe3c1be5ad19460415b4a9d67d3fb8a.jpg',
        author: 'Facilities Team',
        category: 'Infrastructure',
      },
      {
        title: 'Season Tickets Now Available',
        content: 'Supporters can now purchase season tickets for the upcoming season. Secure your seat and cheer for FC ESCUELA!',
        imageUrl: '/images/z6087575479563_100ce1a07bb55ac7a2beacadaacaefac.jpg',
        author: 'Ticketing',
        category: 'Tickets',
      },
    ],
  });
  console.log('Sample news posts with local images created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 