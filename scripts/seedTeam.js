const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.teamMember.deleteMany();
  await prisma.teamMember.createMany({
    data: [
      {
        name: 'Nguyen Van A',
        role: 'Head Coach',
        image: '/images/z6087575494598_87ab786058a0e1cbc9c915cbb42d1ca1.jpg',
        bio: 'Experienced coach with a passion for developing young talent.',
        order: 1,
      },
      {
        name: 'Tran Thi B',
        role: 'Assistant Coach',
        image: '/images/z6087575487897_c240c4136fbe9e856d64f7be0811014d.jpg',
        bio: 'Specialist in defensive tactics and team motivation.',
        order: 2,
      },
      {
        name: 'Le Van C',
        role: 'Goalkeeper',
        image: '/images/z6087575482857_d05b45fd9decd52881f7b8aefc060cf2.jpg',
        bio: 'Agile and reliable, a wall in front of the net.',
        order: 3,
      },
      {
        name: 'Pham Thi D',
        role: 'Forward',
        image: '/images/z6087575479566_5fe3c1be5ad19460415b4a9d67d3fb8a.jpg',
        bio: 'Top scorer and a constant threat to opponents.',
        order: 4,
      },
    ],
  });
  console.log('Sample team members created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 