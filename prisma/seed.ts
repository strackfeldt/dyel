import { PrismaClient } from "@prisma/client";
import { exerciseLogs, exercises } from "../src/data";

let prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  for (let ex of exercises) {
    await prisma.exercise.create({
      data: {
        ...ex,
        user: "43133965",
      },
    });
  }

  for (let ex of exerciseLogs) {
    await prisma.log.create({
      data: {
        exerciseId: ex.exercise,
        weight: ex.weight,
        reps: ex.reps,
        date: new Date(ex.createdAt),
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
