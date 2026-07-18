# Multi-stage build for backend (TypeScript/Express/Prisma)
FROM node:20-alpine AS builder
WORKDIR /app

# Install build deps
COPY package*.json ./
COPY package-lock.json* ./ || true
RUN npm ci --silent

# Copy source and generate prisma client + build
COPY . .
# generate prisma client if prisma schema present (no-op if not configured)
RUN npx prisma generate --silent || true
RUN npm run build --silent

# Runtime image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 4000
CMD ["node", "dist/index.js"]
