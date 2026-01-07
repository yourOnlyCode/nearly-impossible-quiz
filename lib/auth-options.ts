import { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

// Lazy-load prisma to avoid build-time initialization
function getPrisma() {
  // Dynamic import to defer evaluation until runtime
  const { prisma } = require("@/lib/prisma")
  return prisma
}

// Export as a function to defer evaluation until runtime
export function getAuthOptions(): NextAuthOptions {
  return {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const prisma = getPrisma()
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.isAdmin = (user as any).isAdmin
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.isAdmin = token.isAdmin as boolean
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
  }
}

// For backward compatibility, export as constant that calls the function
export const authOptions = getAuthOptions()

// Type augmentation for NextAuth
declare module "next-auth" {
  interface User {
    isAdmin?: boolean
  }
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      isAdmin: boolean
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    isAdmin?: boolean
  }
}
