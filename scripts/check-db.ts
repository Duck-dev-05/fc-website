import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Check matches
  const matches = await prisma.match.findMany()
  console.log('Matches in database:', matches.length)
  console.log('Match data:', JSON.stringify(matches, null, 2))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 