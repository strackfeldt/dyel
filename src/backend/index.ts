import { TRPCError } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import { createRouter } from "./create-router";
import { prisma } from "./prisma";

function toSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

export let appRouter = createRouter()
  .transformer(superjson)
  .middleware(async ({ ctx, next }) => {
    let { session } = ctx;
    if (!session?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return await next({ ctx: { ...ctx, session } });
  })
  .query("exercises", {
    async resolve({ ctx }) {
      if (!ctx.session?.id) return [];

      return prisma.exercise.findMany({
        where: { user: ctx.session?.id },
      });
    },
  })
  .query("exercise-by-id", {
    input: z.object({ id: z.number() }),
    async resolve({ ctx, input }) {
      return prisma.exercise.findFirst({
        where: { id: input.id, user: ctx.session?.id },
        include: {
          logs: { orderBy: { date: "desc" } },
        },
      });
    },
  })
  .mutation("create-exercise", {
    input: z.object({
      name: z.string(),
    }),
    resolve({ ctx, input }) {
      return prisma.exercise.create({
        data: {
          name: input.name,
          slug: toSlug(input.name),
          user: ctx.session?.id,
        },
      });
    },
  })
  .mutation("log-exercise", {
    input: z.object({
      exercise: z.number().positive(),
      date: z.date().optional(),
      weight: z.number().positive(),
      reps: z.number().positive(),
    }),
    async resolve({ ctx, input }) {
      return prisma.log.create({
        data: {
          exerciseId: input.exercise,
          weight: input.weight,
          reps: input.reps,
          date: input.date || new Date(),
        },
      });
    },
  });

export type AppRouter = typeof appRouter;
