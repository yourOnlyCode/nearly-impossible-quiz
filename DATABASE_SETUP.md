# Database Setup Guide

You need to set up your PostgreSQL database connection. Here are your options:

## Option 1: Supabase (Recommended - Free & Easy)

1. **Create a free Supabase account** at https://supabase.com
2. **Create a new project**
3. **Get your connection string**:
   - Go to Project Settings → Database
   - Find "Connection string" → "URI"
   - Copy the connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`)
   - Replace `[YOUR-PASSWORD]` with your database password

4. **Create `.env` file** in the root directory with:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxxxxxxxxxx.supabase.co:5432/postgres"
   NEXTAUTH_SECRET="generate-a-random-secret-here-use-openssl-rand-base64-32"
   NEXTAUTH_URL="http://localhost:3000"
   ```

## Option 2: Local PostgreSQL

If you have PostgreSQL installed locally:

1. **Create a database**:
   ```sql
   CREATE DATABASE nearly_impossible;
   ```

2. **Create `.env` file**:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/nearly_impossible?schema=public"
   NEXTAUTH_SECRET="generate-a-random-secret-here-use-openssl-rand-base64-32"
   NEXTAUTH_URL="http://localhost:3000"
   ```

   Replace:
   - `username` with your PostgreSQL username (often `postgres`)
   - `password` with your PostgreSQL password
   - `5432` with your PostgreSQL port (default is 5432)

## Option 3: Other PostgreSQL Hosting

You can use any PostgreSQL database provider (Neon, Railway, Render, etc.):
- Format: `postgresql://username:password@host:port/database?schema=public`
- Make sure the URL starts with `postgresql://` or `postgres://`

## After Setting Up .env

1. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

2. **Push the schema to your database**:
   ```bash
   npx prisma db push
   ```

3. **Add your first prompt**:
   ```bash
   npm run add-prompt
   ```

## Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:
```bash
# PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))

# Or use OpenSSL (if installed)
openssl rand -base64 32
```

Or just use any long random string - it's only needed for admin login.