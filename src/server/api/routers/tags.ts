import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const tagsRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().trim().toLowerCase(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.tags.create({ data: { name: input.name } });
        return { done: true };
      } catch (error) {
        throw new TRPCError({
          message: "could not create tag",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      try {
        return await ctx.prisma.tags.delete({ where: { id } });
      } catch (error) {
        console.log({ error });
        throw new TRPCError({
          message: "could not delete ",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
