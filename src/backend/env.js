// @ts-check
let { z } = require("zod");

let envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
});

let env = envSchema.safeParse(process.env);

if (!env.success) {
  console.error(
    "❌ Invalid environment variables:",
    JSON.stringify(env.error.format(), null, 4)
  );
  process.exit(1);
}

module.exports.env = env.data;
