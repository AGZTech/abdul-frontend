# Stage 1: Builder
FROM node:20-bullseye AS builder
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci --legacy-peer-deps
COPY . .

ENV NODE_OPTIONS="--max-old-space-size=2048"

# Build Next.js project (TS compiled automatically)
RUN npm run build

# Stage 2: Production
FROM node:20-bullseye AS production
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# next.config.ts automatically used, no need to copy

EXPOSE 3000
CMD ["npm", "start"]
