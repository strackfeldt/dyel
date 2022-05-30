import superjson from "superjson";
import { z } from "zod";
import { createRouter } from "./create-router";
import { prisma } from "./prisma";

export let appRouter = createRouter()
  .transformer(superjson)
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
  .mutation("log-exercise", {
    input: z.object({
      exercise: z.number().positive(),
      weight: z.number().positive(),
      reps: z.number().positive(),
    }),
    async resolve({ ctx, input }) {
      return prisma.log.create({
        data: {
          exerciseId: input.exercise,
          weight: input.weight,
          reps: input.reps,
          date: new Date(),
        },
      });
    },
  });

export type AppRouter = typeof appRouter;
