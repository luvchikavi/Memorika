#!/bin/bash
# Script to set up local SQLite database for development

echo "Setting up local SQLite database..."

# Create .env.local with SQLite configuration
cat > .env.local << 'EOF'
# Local development with SQLite
DATABASE_URL="file:./prisma/dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="local-development-secret-change-in-production"
EOF

echo "Created .env.local with SQLite configuration"

# Update schema to use SQLite
cp prisma/schema.prisma prisma/schema.postgres.prisma.bak

cat > prisma/schema.prisma << 'SCHEMA'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
SCHEMA

# Append the rest of the models
tail -n +16 prisma/schema.postgres.prisma.bak >> prisma/schema.prisma

echo "Updated schema.prisma for SQLite"

# Generate Prisma client and create database
npx prisma generate
npx prisma db push

echo "Local SQLite database is ready!"
echo "Run 'npm run dev' to start the development server"
