# Fix DATABASE_URL Error

## The Problem
Prisma is complaining that your `DATABASE_URL` must start with `postgresql://` or `postgres://`.

## The Solution

Open your `.env` file and make sure the `DATABASE_URL` line looks like one of these:

### For Supabase:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
```

### For Local PostgreSQL:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/nearly_impossible?schema=public"
```

### Important Notes:
1. **Must start with `postgresql://` or `postgres://`**
2. **Use quotes around the URL** (double quotes)
3. **Replace the placeholders**:
   - `YOUR_PASSWORD` → Your actual database password
   - `username` → Your PostgreSQL username (often `postgres`)
   - `password` → Your PostgreSQL password
   - `xxxxx` → Your Supabase project reference

## Quick Fix Steps:

1. **Open `.env` file** in your project root
2. **Find the `DATABASE_URL` line** (or add it if missing)
3. **Make sure it starts with `postgresql://`**
4. **Save the file**
5. **Try again**: `npx prisma db push`

## Don't Have a Database Yet?

### Option A: Use Supabase (Free & Easy)
1. Go to https://supabase.com
2. Sign up and create a new project
3. Go to Project Settings → Database
4. Copy the connection string under "Connection string" → "URI"
5. Paste it in your `.env` file

### Option B: Local PostgreSQL
1. Install PostgreSQL if you haven't: https://www.postgresql.org/download/
2. Create a database:
   ```sql
   CREATE DATABASE nearly_impossible;
   ```
3. Add to `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/nearly_impossible?schema=public"
   ```

## After Fixing:

1. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

2. Push schema to database:
   ```bash
   npx prisma db push
   ```

3. Add your first prompt:
   ```bash
   npm run add-prompt
   ```