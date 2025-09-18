FROM node:22 AS deps

WORKDIR /app
COPY app/package*.json .
RUN npm install

FROM node:22 AS builder

# Put NEXT_PUBLIC_* ENV vars here
# ARG NEXT_PUBLIC_GATEWAY_URL

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY app .
RUN npm run build

FROM node:22-slim AS runner
WORKDIR /app
COPY app/next.config.ts .
COPY app/drizzle.config.ts .
COPY app/drizzle /app/drizzle
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000
ENTRYPOINT ["npm", "run", "start"]
