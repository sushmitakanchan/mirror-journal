FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lock ./
COPY prisma ./prisma

RUN bun install --frozen-lockfile
RUN bunx prisma generate

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "bunx prisma migrate deploy && bun run start"]
