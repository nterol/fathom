import { router } from "@/server/api/trpc";
import { notesRouter } from "./routers/notes";
import { tagsRouter } from "./routers/tags";
import { relationsRouter } from "./routers/relations";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = router({
  notes: notesRouter,
  tags: tagsRouter,
  relations: relationsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
