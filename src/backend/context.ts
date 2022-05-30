import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

interface SessionWithID extends Session {
  id: string;
}

interface CreateContextOptions {
  session: SessionWithID | null;
}

export async function createContextInner({ session }: CreateContextOptions) {
  return { session };
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

export async function createContext({
  req,
}: trpcNext.CreateNextContextOptions): Promise<Context> {
  let session = await getSession({ req });

  return await createContextInner({
    session: session as SessionWithID,
  });
}
