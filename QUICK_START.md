# Quick Start - Add Your First Prompt

You have a few options to add your first test prompt:

## Option 1: Using the Script (After Database Setup)

1. **Set up your database connection** in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/nearly_impossible?schema=public"
   ```

2. **Initialize the database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Run the script to add the prompt**:
   ```bash
   npm run add-prompt
   ```

This will create today's prompt with:
- **Question**: bowl, mushroom, dandellion?
- **Answer**: suspicious stew

## Option 2: Using Prisma Studio (Visual UI)

1. **Set up your database** (same as Option 1, steps 1-2)

2. **Open Prisma Studio**:
   ```bash
   npm run db:studio
   ```

3. **Add the prompt manually**:
   - Click "Prompt" table
   - Click "Add record"
   - Fill in:
     - `content`: `bowl, mushroom, dandellion?`
     - `solution`: `suspicious stew`
     - `promptDate`: Today's date (YYYY-MM-DD format, e.g., 2024-01-15)
   - Click "Save 1 change"

## Option 3: Using Admin Dashboard

1. **Set up database** and **create an admin user** (see SETUP.md)

2. **Login** at `/login` with your admin account

3. **Navigate** to `/admin`

4. **Create the prompt**:
   - Prompt Date: Today's date
   - Prompt Content: `bowl, mushroom, dandellion?`
   - Solution: `suspicious stew`

## Test It Out!

Once the prompt is added:

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Visit** `http://localhost:3000/quiz`

3. **Try the answer**: `suspicious stew` (case-insensitive)

4. **Check your stats** at `/stats`

The answer should be accepted and your score should show 1 guess!