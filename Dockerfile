# ---------- Base ----------
FROM node:20-alpine AS base
RUN apk add --no-cache openssl bash
WORKDIR /app

# ---------- Dependencies ----------
FROM base AS deps
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --include=dev

# ---------- Builder ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- Runner ----------
FROM base AS runner

ENV NODE_ENV=production

COPY --from=builder /app ./

RUN npm prune --omit=dev

# wait-for-it
COPY wait-for-it.sh /usr/local/bin/wait-for-it
RUN chmod +x /usr/local/bin/wait-for-it

EXPOSE 3000

CMD ["sh", "-c", "npx prisma generate && wait-for-it postgres:5432 && wait-for-it rabbitmq:5672 && npx prisma migrate deploy && npm start"]