import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const registerRouter = router({
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      try {
        return await ctx.prisma.register.delete({ where: { id } });
      } catch (error) {
        throw new TRPCError({
          message: "Could not delete relation",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
