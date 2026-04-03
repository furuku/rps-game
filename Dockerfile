# ---------- Base ----------
FROM node:20-alpine AS base
RUN apk add --no-cache openssl bash curl netcat-openbsd
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
WORKDIR /app

COPY --from=builder /app ./

RUN npm prune --omit=dev

EXPOSE 3000

CMD ["sh", "-c", "\
echo 'Waiting for Postgres...'; \
until nc -z postgres 5432; do sleep 1; done; \
echo 'Waiting for RabbitMQ...'; \
until nc -z rabbitmq 5672; do sleep 1; done; \
echo 'Running prisma generate and migrate...'; \
npx prisma generate; \
npx prisma migrate deploy; \
echo 'Starting app...'; \
npm start \
"]