import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  try {
    // Clear existing data
    await prisma.ticket.deleteMany({})
    await prisma.match.deleteMany({})
    await prisma.user.deleteMany({})
    await prisma.teamMember.deleteMany({})

    // Create test accounts
    const hashedPassword = await hash('test123', 10)
    
    // Create member test account
    const memberUser = await prisma.user.create({
      data: {
        email: 'member@fcescuela.com',
        name: 'Test Member',
        password: hashedPassword,
        isMember: true,
        membershipType: 'Premium',
        memberSince: new Date(),
      },
    })

    // Create non-member test account
    const nonMemberUser = await prisma.user.create({
      data: {
        email: 'user@fcescuela.com',
        name: 'Test User',
        password: hashedPassword,
        isMember: false,
      },
    })

    console.log('Created test accounts:')
    console.log('Member:', memberUser.email)
    console.log('Non-member:', nonMemberUser.email)

    // Create sample matches
    const matches = [
      {
        homeTeam: 'Escuela FC',
        awayTeam: 'Real Madrid Academy',
        date: new Date('2024-05-15'),
        time: '19:30',
        venue: 'Escuela Stadium',
        competition: 'Youth Champions League',
        stadiumCapacity: 1000,
      },
      {
        homeTeam: 'Barcelona Youth',
        awayTeam: 'Escuela FC',
        date: new Date('2024-05-22'),
        time: '20:00',
        venue: 'La Masia',
        competition: 'Youth Champions League',
        stadiumCapacity: 800,
      },
      {
        homeTeam: 'Escuela FC',
        awayTeam: 'Ajax Academy',
        date: new Date('2024-06-05'),
        time: '18:45',
        venue: 'Escuela Stadium',
        competition: 'International Youth Cup',
        stadiumCapacity: 1000,
      },
      {
        homeTeam: 'Manchester United U21',
        awayTeam: 'Escuela FC',
        date: new Date('2024-06-12'),
        time: '19:00',
        venue: 'Carrington Training Complex',
        competition: 'International Youth Cup',
        stadiumCapacity: 1200,
      },
    ]

    const createdMatches = [];
    for (const match of matches) {
      const m = await prisma.match.create({ data: match });
      createdMatches.push(m);
    }

    // Create a past match for ticket
    const pastMatch = await prisma.match.create({
      data: {
        homeTeam: 'Escuela FC',
        awayTeam: 'Old Rivals',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
        time: '18:00',
        venue: 'Escuela Stadium',
        competition: 'Friendly',
        stadiumCapacity: 500,
      },
    });

    // Create a past ticket for member user
    await prisma.ticket.create({
      data: {
        matchId: pastMatch.id,
        userId: memberUser.id,
        quantity: 2,
        category: 'standard',
        purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 31), // 31 days ago
      },
    });

    // Create a past (expired) membership for member user
    await (prisma as any).membership.create({
      data: {
        userId: memberUser.id,
        planId: 'premium',
        status: 'expired',
        startDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365), // 1 year ago
        endDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
        stripeCustomerId: 'cus_mock',
        stripeSubscriptionId: 'sub_mock',
      },
    });

    // Create team members
    const teamMembers = [
      { name: 'Nguyễn Thành Đạt', role: 'GK', order: 1, image: '', bio: '' },
      { name: 'Lê Vũ Nhật Minh', role: 'CB', order: 2, image: '', bio: '' },
      { name: 'Nguyễn Đỗ Bảo Khánh', role: 'CB', order: 3, image: '', bio: '' },
      { name: 'Nguyễn Đức Bảo Phong', role: 'CB', order: 4, image: '', bio: '' },
      { name: 'Vũ Nhật Ninh', role: 'RB', order: 5, image: '', bio: '' },
      { name: 'Phạm Công Toàn', role: 'LB', order: 6, image: '', bio: '' },
      { name: 'Hoàng Đặng Việt Hùng', role: 'CDM', order: 7, image: '', bio: '' },
      { name: 'Đỗ Quốc Khánh', role: 'AMF', order: 8, image: '', bio: '' },
      { name: 'Phạm Anh Phương', role: 'LW', order: 9, image: '', bio: '' },
      { name: 'Nguyễn Quang Minh Thành', role: 'CF', order: 10, image: '', bio: '' },
      { name: 'Đặng Minh Việt', role: 'RW', order: 11, image: '', bio: '' },
      { name: 'Trần Minh Đức', role: 'CF', order: 12, image: '', bio: '' },
    ];

    for (const member of teamMembers) {
      await prisma.teamMember.create({ data: member });
    }

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  }) 