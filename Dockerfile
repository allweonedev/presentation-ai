# syntax=docker/dockerfile:1.7

# Multi-stage Dockerfile for Next.js (App Router) with pnpm and Prisma
# Safe base: Debian slim (avoids Alpine musl issues with Prisma/sharp)

ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-bookworm-slim AS base
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# Install system deps commonly needed by Next.js/Prisma/sharp
RUN apt-get update -y \
 && apt-get install -y --no-install-recommends \
    ca-certificates \
    openssl \
    git \
 && rm -rf /var/lib/apt/lists/*

# Enable corepack to use pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# --- Dependencies ---
FROM base AS deps
# Copy only manifest files to leverage Docker layer caching
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# --- Build ---
FROM base AS build
ENV SKIP_ENV_VALIDATION=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Ensure Prisma client is generated during build (postinstall handles it, but safe to re-run)
RUN pnpm prisma generate || true
RUN pnpm build

# --- Runtime Image ---
FROM node:${NODE_VERSION}-bookworm-slim AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000
WORKDIR /app

# System deps
RUN apt-get update -y \
 && apt-get install -y --no-install-recommends \
    ca-certificates \
    openssl \
 && rm -rf /var/lib/apt/lists/*

# Copy standalone server output and static assets
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# If your app uses Prisma at runtime, keep schema available (optional)
COPY --from=build /app/prisma ./prisma

# Expose the port (Easypanel will map this)
EXPOSE 3000

# Healthcheck hits Next.js API route we'll add at /api/health
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "require('http').request({host:'127.0.0.1', port: process.env.PORT || 3000, path:'/api/health'}, res=>{process.exit(res.statusCode===200?0:1)}).on('error',()=>process.exit(1)).end()"

# Start the server produced by Next.js standalone output
CMD ["node", "server.js"]
