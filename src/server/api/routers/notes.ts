import { z } from "zod";
import { publicProcedure, router } from "../trpc";

const noteInput = {
  title: z
    .string()
    .min(5, { message: "Must be 5 or more characters or length" })
    .max(200, { message: "Oh ti a cru on pouvait raconter ta vie fdp ?" })
    .trim()
    .optional(),
  description: z.string().trim().optional(),
};

export const notesRouter = router({
  create: publicProcedure
    .input(z.object(noteInput))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.notes.create({
          data: {
            title: input.title ?? "",
            description: input.description ?? "",
            content: [
              {
                type: "heading",
                attrs: { level: 1 },
                content: [{ type: "text", text: input.title }],
              },
            ],
          },
        });
      } catch (error) {
        throw new Error("Error at create new note");
      }
    }),
  get: router({
    byID: publicProcedure
      .input(
        z.object({
          id: z.string(),
          withGraph: z.boolean().default(false),
        })
      )
      .query(async ({ ctx, input }) => {
        try {
          const { id, withGraph } = input;
          const note = await ctx.prisma.notes.findUnique({
            where: { id },
            select: {
              id: true,
              createdAt: true,
              targets: withGraph,
              sources: withGraph,
              title: true,
              description: true,
              content: true,
            },
          });
          if (!withGraph) return note;
          if (!note) return note;

          const { targets, sources, id: noteID } = note;

          const allRelations = [...targets, ...sources];

          const everyID = allRelations.flatMap(({ targetID, sourceID }) => [
            targetID,
            sourceID,
          ]);
          const nodes = [...new Set([noteID, ...everyID])].map((id) => ({
            id,
          }));

          const edges = allRelations.map(({ sourceID, targetID, ...rest }) => ({
            ...rest,
            source: sourceID,
            target: targetID,
          }));

          const graph = { nodes, edges };
          console.log(graph);

          return { ...note, graph };
        } catch (error) {
          console.log("Error lol");
        }
      }),
    all: publicProcedure.query(async ({ ctx }) => {
      try {
        return await ctx.prisma.notes.findMany({
          select: { title: true, id: true },
          orderBy: { createdAt: "desc" },
        });
      } catch (error) {
        console.log(error);
        throw new Error("Error at get all notes");
      }
    }),
  }),
  update: publicProcedure
    .input(z.object({ ...noteInput, id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { id } = input;
        return await ctx.prisma.notes.update({
          where: { id },
          data: { title: input.title, description: input.description },
        });
      } catch (err) {
        console.log(err);
        throw new Error("Error at update");
      }
    }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const { id } = input;
        return await ctx.prisma.notes.delete({ where: { id } });
      } catch (error) {
        console.log(error);
        throw new Error("Error at delete");
      }
    }),
});
