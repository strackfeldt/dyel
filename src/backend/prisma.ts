import { PrismaClient } from "@prisma/client";
import { env } from "./env";

let prismaGlobal = global as typeof global & {
  prisma?: PrismaClient;
};

export let prisma: PrismaClient =
  prismaGlobal.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") {
  prismaGlobal.prisma = prisma;
}
