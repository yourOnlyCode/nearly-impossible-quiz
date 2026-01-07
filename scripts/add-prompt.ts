import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Set prompt date to today
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Create the first prompt
  const prompt = await prisma.prompt.upsert({
    where: {
      promptDate: today,
    },
    update: {
      content: 'bowl, mushroom, dandellion?',
      solution: 'suspicious stew',
    },
    create: {
      content: 'bowl, mushroom, dandellion?',
      solution: 'suspicious stew',
      promptDate: today,
    },
  })

  console.log('✅ Prompt created successfully!')
  console.log('Prompt ID:', prompt.id)
  console.log('Date:', prompt.promptDate.toISOString().split('T')[0])
  console.log('Content:', prompt.content)
  console.log('Solution:', prompt.solution)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })