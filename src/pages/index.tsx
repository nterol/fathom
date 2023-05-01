import Head from "next/head";
import { api } from "@/utils/api";

import { AddNoteButton } from "@/components/add-note-button";
import { TrashIcon } from "@/components/icons";
import { Thumbnail } from "@/components/thumbnail";

function useAllNotes(): {
  allNotes: { id: string; title: string | null }[] | undefined;
  isLoading: boolean;
} {
  const { data: allNotes, isLoading } = api.notes.get.all.useQuery();

  return { allNotes, isLoading };
}

export default function Home() {
  const { allNotes = [], isLoading } = useAllNotes();
  const apiContext = api.useContext();
  console.log(allNotes);

  apiContext;

  const deleteNote = api.notes.delete.useMutation({
    onMutate: async () => {
      await apiContext.notes.get.all.cancel();
      const optimistic = apiContext.notes.get.all.getData();
      if (!optimistic) {
        return;
      }
      apiContext.notes.get.all.setData(undefined, optimistic);
    },
    onSettled: async () => {
      await apiContext.notes.get.all.invalidate();
    },
  });

  function handleDelete(id: string) {
    return () => {
      deleteNote.mutate({ id });
    };
  }

  return (
    <>
      <Head>
        <title>Fathom</title>
        <meta name="description" content="Fathom" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto flex min-h-screen flex-col justify-center gap-4 py-10 md:container">
        <h1>All notes</h1>
        <section className="flex flex-col gap-8">
          {isLoading && !allNotes ? (
            <div
              style={{ "--delay": `${Math.random()}s` } as React.CSSProperties}
              className="placeholder h-11 w-1/2 rounded-lg bg-slate-500"
            />
          ) : null}

          {allNotes && allNotes.length === 0 ? (
            <p className="bg-green-50 p-7 text-xl font-medium text-green-900">
              ✏️ &nbsp; You dont have any notes yet!
            </p>
          ) : null}
          {allNotes
            ? allNotes?.map((note) => (
                <Thumbnail key={note.id} note={note}>
                  <div onClick={handleDelete(note.id)}>
                    <TrashIcon />
                  </div>
                </Thumbnail>
              ))
            : null}
        </section>
        <AddNoteButton />
      </main>
    </>
  );
}
