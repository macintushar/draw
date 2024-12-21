FROM oven/bun:latest as build-stage

WORKDIR /app

COPY package.json ./

RUN bun install

COPY . .

RUN bun run build

from oven/bun:latest as serve-stage

WORKDIR /app

RUN bun install bun hono zod

COPY --from=build-stage /app/dist ./dist

COPY server.ts /app

EXPOSE 3729

CMD ["bun", "run", "server.ts"]