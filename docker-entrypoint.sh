#!/bin/sh
set -e

echo "🚀 Starting Next.js application..."
echo "📍 Port: ${PORT:-3000}"
echo "🔗 NEXTAUTH_URL: ${NEXTAUTH_URL:-NOT SET}"

# Check required environment variables
if [ -z "$NEXTAUTH_URL" ]; then
    echo "❌ ERROR: NEXTAUTH_URL environment variable is required but not set!"
    echo "Please set it in Easypanel App > Environment section"
    exit 1
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
    echo "❌ ERROR: NEXTAUTH_SECRET environment variable is required but not set!"
    exit 1
fi

if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL environment variable is required but not set!"
    exit 1
fi

if [ -z "$OPENROUTER_API_KEY" ]; then
    echo "⚠️  WARNING: OPENROUTER_API_KEY not set - AI features may not work"
fi

echo "✅ Environment variables validated"

# Initialize database schema
echo "📊 Initializing database schema..."
cd /app
npx prisma db push --skip-generate --accept-data-loss || echo "⚠️  DB schema sync failed or already up to date"

echo "🎯 Starting server on port ${PORT:-3000}..."

# Export HOSTNAME for Next.js standalone to bind to all interfaces
export HOSTNAME="0.0.0.0"

# Start the Next.js standalone server
exec node server.js
