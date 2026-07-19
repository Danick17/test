# Bestmark production image (Next.js standalone + SQLite on a volume)
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# better-sqlite3 ships prebuilt binaries; build tools cover fallback compiles
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
  && npm ci --no-audit --no-fund \
  && apt-get purge -y python3 make g++ && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*

FROM node:22-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-slim AS run
WORKDIR /app
ENV NODE_ENV=production
ENV BESTMARK_DATA_DIR=/data
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
RUN mkdir -p /data && chown node:node /data /app
USER node
EXPOSE 3000
VOLUME ["/data"]
CMD ["node", "server.js"]
