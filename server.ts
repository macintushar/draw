import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { z } from "zod";

const app = new Hono();

app.use("*", logger());

app.get("/health", (c) => c.json({ status: "ok" }));

app.get("*", serveStatic({ root: "./dist" }));
app.get("*", serveStatic({ path: "./dist/index.html" }));

const ServeEnv = z.object({
  PORT: z.coerce.number({ message: "Port must be a number" }).default(3729),
});
const ProcessEnv = ServeEnv.parse(process.env);

// eslint-disable-next-line no-console
console.log(`Listening on port ${ProcessEnv.PORT}`);

try {
  Bun.serve({
    port: ProcessEnv.PORT,
    fetch: app.fetch,
  });
} catch (error) {
  console.error("Failed to start server:", error);
  process.exit(1);
}
