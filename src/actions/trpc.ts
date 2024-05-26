import { auth } from "@/lib/auth";
import { initTRPC, TRPCError } from "@trpc/server";
import { experimental_nextAppDirCaller } from "@trpc/server/adapters/next-app-dir";

interface Meta {
  span: string;
}

export const t = initTRPC.meta<Meta>().create();

// https://trpc.io/blog/trpc-actions
const serverActionProcedure = t.procedure
  .experimental_caller(
    experimental_nextAppDirCaller({
      pathExtractor: ({ meta }) => (meta as Meta).span,
    })
  )
  .use(async (opts) => {
    const session = await auth();

    return opts.next({ ctx: { user: session?.user } });
  });

export const protectedAction = serverActionProcedure.use((opts) => {
  if (!opts.ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be signed in to perform this action",
    });
  }

  return opts.next({
    ctx: {
      ...opts.ctx,
      user: opts.ctx.user,
    },
  });
});
