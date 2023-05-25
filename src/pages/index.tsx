import Head from "next/head";
import { api } from "@/utils/api";
import c from "classnames";

import { AddNoteButton } from "@/components/add-note-button";
import { TrashIcon } from "@/components/icons";
import { Thumbnail } from "@/components/thumbnail";
import s from "@/styles/placeholder.module.css";

export default function Home() {
  const {
    data: allNotes,
    isLoading,
    isFetching,
  } = api.notes.get.all.useQuery();
  const apiContext = api.useContext();

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

  console.log({ allNotes, isFetching, isLoading });

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
          {(isFetching || isLoading) && !allNotes ? (
            <>
              <div
                style={
                  { "--delay": `${Math.random()}s` } as React.CSSProperties
                }
                className={`${
                  s.placeholder ?? ""
                } h-11 w-full rounded-lg bg-slate-500`}
              />
              <div
                style={
                  { "--delay": `${Math.random()}s` } as React.CSSProperties
                }
                className={c(
                  s.placeholder,
                  "h-11 w-full rounded-lg bg-slate-500"
                )}
              />
            </>
          ) : null}

          {!isLoading && !isFetching && allNotes && allNotes.length === 0 ? (
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
