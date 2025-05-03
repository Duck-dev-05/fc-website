import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.news.createMany({
    data: [
      {
        title: 'FC ESCUELA Wins the Championship!',
        content: 'FC ESCUELA secured a thrilling victory in the finals, bringing home the championship trophy for the first time in club history.',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        author: 'Club Reporter',
        category: 'Match Report',
      },
      {
        title: 'New Coach Announced',
        content: 'We are excited to welcome our new head coach, who brings years of experience and a fresh vision to the club.',
        imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b',
        author: 'Admin',
        category: 'Club News',
      },
      {
        title: 'Youth Academy Tryouts Open',
        content: 'Our youth academy is now accepting applications for the upcoming season. Young talents are encouraged to apply!',
        imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
        author: 'Youth Coordinator',
        category: 'Academy',
      },
      {
        title: 'Stadium Renovation Completed',
        content: 'The club is proud to announce the completion of the stadium renovation, offering fans a better matchday experience.',
        imageUrl: 'https://images.unsplash.com/photo-1505843279827-4b522fae12b2',
        author: 'Facilities Team',
        category: 'Infrastructure',
      },
      {
        title: 'Season Tickets Now Available',
        content: 'Supporters can now purchase season tickets for the upcoming season. Secure your seat and cheer for FC ESCUELA!',
        imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623066013b',
        author: 'Ticketing',
        category: 'Tickets',
      },
    ],
  });
  console.log('Sample news posts created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 