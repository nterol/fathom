import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const relationsRouter = router({
  create: publicProcedure
    .input(
      z.object({
        legend: z.string().trim().optional(),
        source: z.string(),
        target: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.relations.create({
          data: {
            legend: input.legend,
            sourceID: input.source,
            targetID: input.target,
          },
        });
      } catch (error) {
        console.log({ error });
        throw new TRPCError({
          message: "Could not create relation",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  get: router({
    all: publicProcedure.query(async ({ ctx }) => {
      return await ctx.prisma.relations.findMany({
        select: {
          legend: true,
          sourceID: true,
          source: true,
          target: true,
          targetID: true,
        },
      });
    }),
  }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      try {
        return await ctx.prisma.relations.delete({ where: { id } });
      } catch (error) {
        throw new TRPCError({
          message: "Could not delete relation",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
