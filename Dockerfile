# Build stage
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* .npmrc ./
RUN npm install --legacy-peer-deps

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV BUILD_TIME=__BUILD_TIME__
RUN node -e "const fs=require('fs'); const ts=new Date().toISOString(); fs.writeFileSync('.build-time', ts);"
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.build-time ./.build-time
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Admin-edited content lives here (Dokploy mounts a volume at /app/data)
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data
ENV CONTENT_DIR=/app/data

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
