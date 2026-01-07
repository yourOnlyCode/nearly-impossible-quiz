# Setup Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud like Supabase)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nearly_impossible?schema=public"
NEXTAUTH_SECRET="generate-a-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Important**: Replace the `DATABASE_URL` with your actual PostgreSQL connection string.

For **Supabase**, your connection string will look like:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

Generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 3. Initialize Database

```bash
npx prisma generate
npx prisma db push
```

This will:
- Generate the Prisma Client
- Create the database tables (User, Prompt, Guess)

### 4. Create an Admin User

You can create an admin user using Prisma Studio:

```bash
npx prisma studio
```

Then:
1. Navigate to the `User` table
2. Click "Add record"
3. Fill in:
   - `email`: your admin email
   - `password`: run this in Node to hash it: `require('bcryptjs').hashSync('yourpassword', 10)`
   - `isAdmin`: `true`
   - `name`: (optional)

Or create a seed script (recommended):

Create `prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      isAdmin: true,
    },
  })

  console.log('Admin user created!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Then add to `package.json`:
```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

And install ts-node:
```bash
npm install -D ts-node
```

Run the seed:
```bash
npx prisma db seed
```

### 5. Run the Development Server

```bash
npm run dev
```

### 6. Access the Application

- Main app: http://localhost:3000
- Login: http://localhost:3000/login
- Admin dashboard: http://localhost:3000/admin (requires admin user)

## Creating Your First Prompt

1. Login as an admin user
2. Navigate to `/admin`
3. Fill in:
   - **Prompt Date**: Select the date when this prompt should appear
   - **Prompt Content**: The question, riddle, or puzzle
   - **Solution**: The correct answer (case-insensitive)
4. Click "Create Prompt"

## Testing

1. Register a new user account
2. Login
3. Navigate to `/quiz` to see today's prompt
4. Try submitting guesses
5. Check your profile at `/profile` to see your scores

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check firewall/network settings for cloud databases

### Authentication Issues
- Make sure `NEXTAUTH_SECRET` is set
- Clear browser cookies and try again
- Check browser console for errors

### Prisma Issues
- Run `npx prisma generate` again
- Try `npx prisma db push --force-reset` (WARNING: deletes all data)