#!/bin/bash
# Script to set up PostgreSQL for production deployment

echo "Setting up PostgreSQL for production..."

# Ensure schema uses PostgreSQL
cat > prisma/schema.prisma.header << 'HEADER'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
HEADER

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL environment variable is not set"
  echo "Please set it to your Railway PostgreSQL connection string"
  exit 1
fi

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

echo "PostgreSQL database is ready for production!"
