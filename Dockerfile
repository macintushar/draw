FROM oven/bun:1.2.19 AS build-stage

WORKDIR /app

COPY package.json ./

RUN bun install

COPY . .

RUN bun run build

FROM oven/bun:1.2.19 AS serve-stage

WORKDIR /app

RUN bun install bun hono zod

COPY --from=build-stage /app/dist ./dist

COPY server.ts /app

EXPOSE 3729

CMD ["bun", "run", "server.ts"]