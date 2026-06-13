FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN npm ci --only=production && npm cache clean --force

FROM node:22-alpine AS runtime

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/views ./views
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production

EXPOSE 3000

USER nestjs

CMD ["node", "dist/main"]
