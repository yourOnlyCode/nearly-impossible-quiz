import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const getPrismaClient = () => {
  // Skip Prisma initialization during build if DATABASE_URL is not set
  // This prevents build-time errors on Vercel
  if (typeof window === 'undefined' && !process.env.DATABASE_URL) {
    // Only skip during build phase, not runtime
    if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.NEXT_PHASE === 'phase-production-compile') {
      // Return a minimal mock during build
      return null as any
    }
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? getPrismaClient()

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma
}