import { TrashIcon } from "@/components/icons";
import { Thumbnail } from "@/components/thumbnail";
import { api } from "@/utils/api";
import Head from "next/head";
import Link from "next/link";

function useAllNotes(): {
  allNotes: { id: string; title: string | null }[] | undefined;
  isLoading: boolean;
} {
  // const apiContext = api.useContext();
  const { data: allNotes, isLoading } = api.notes.get.all.useQuery();

  return { allNotes, isLoading };
}

export default function Home() {
  const { allNotes = [], isLoading } = useAllNotes();

  console.log(allNotes);

  const deleteNote = api.notes.delete.useMutation({});

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
        <Link
          className="inline-block max-w-fit rounded-lg bg-green-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-green-600 hover:bg-green-700 hover:ring-green-700"
          href="/new-note"
        >
          Add an note
        </Link>
      </main>
    </>
  );
}
