# Nearly Impossible Quiz

A web app game that presents daily prompts, words, riddles, puzzles, and all kinds of wacky solutions from across the world. Users must input the exact right answer (case-insensitive) to solve each challenge.

## Features

- **Daily Prompts**: Each day displays a new challenge at midnight
- **Scoring System**: Each guess adds +1 to your score (higher score = worse performance)
- **No Login Required**: Play immediately like Wordle - no account needed!
- **Local Stats Tracking**: Your scores are saved in your browser (localStorage)
- **Admin Dashboard**: Admins can submit prompts with dates and solutions (login required for admin)
- **Stats Page**: View your grand total score and challenge history

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/nearly_impossible?schema=public"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Set up Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Create an Admin User**
   You'll need to manually create an admin user in the database or through Prisma Studio:
   ```bash
   npx prisma studio
   ```
   Then create a user and set `isAdmin` to `true`.

5. **Run the Development Server**
   ```bash
   npm run dev
   ```

6. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # Authentication routes
│   │   ├── prompts/route.ts             # Get/create prompts
│   │   ├── guess/route.ts               # Submit guesses
│   │   ├── score/route.ts               # Get user scores
│   │   ├── profile/route.ts             # Get user profile data
│   │   └── register/route.ts            # User registration
│   ├── admin/                           # Admin dashboard
│   ├── quiz/                            # Main quiz page
│   ├── profile/                         # User profile page
│   ├── login/                           # Login page
│   ├── register/                        # Registration page
│   └── layout.tsx                       # Root layout
├── components/ui/                       # shadcn/ui components
├── lib/
│   ├── prisma.ts                        # Prisma client
│   ├── auth.ts                          # Auth helpers
│   └── utils.ts                         # Utility functions
└── prisma/
    └── schema.prisma                    # Database schema
```

## Database Schema

- **User**: Stores user accounts (email, password, isAdmin)
- **Prompt**: Stores daily prompts with solutions and dates
- **Guess**: Tracks all user guesses (userId, promptId, guessText, isCorrect, guessOrder)

## Admin Features

Admins can:
- Create prompts for specific dates
- Set the prompt content and solution
- View all prompts (via Prisma Studio or custom admin UI)

## Scoring

- Each guess increments the score by 1 (whether correct or incorrect)
- Once a correct answer is submitted, no more guesses can be made for that prompt
- The grand total score is the sum of all scores across all challenges
- Lower scores are better!
- All stats are stored locally in your browser (localStorage)

## Playing the Game

1. **No Account Required**: Just visit the site and start playing!
2. Navigate to `/quiz` to see today's challenge
3. Submit your guesses - answers are case-insensitive
4. Check `/stats` to see your performance history
5. All your data is stored locally in your browser

## Notes

- Solutions are case-insensitive
- Each prompt is tied to a specific date
- **No login required** to play - just open and start solving!
- Only admins need to login to access the admin dashboard
- Stats are stored locally in your browser (localStorage)