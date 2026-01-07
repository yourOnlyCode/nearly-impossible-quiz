import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]

  if (!email) {
    console.error('❌ Please provide an email address')
    console.log('Usage: npm run make-admin <email>')
    process.exit(1)
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.error(`❌ User with email "${email}" not found`)
      process.exit(1)
    }

    const updated = await prisma.user.update({
      where: { email },
      data: { isAdmin: true }
    })

    console.log('✅ User updated successfully!')
    console.log(`   Email: ${updated.email}`)
    console.log(`   Admin: ${updated.isAdmin}`)
    console.log(`   Name: ${updated.name || 'N/A'}`)
  } catch (error) {
    console.error('❌ Error updating user:', error)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })