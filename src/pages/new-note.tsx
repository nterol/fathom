import Head from "next/head";
import Link from "next/link";
import { useState, type FormEvent } from "react";

import { DescriptionInput, TitleInput } from "@/components/Input";
import { api } from "@/utils/api";

function useAddNewNote(): ReturnType<typeof api.notes.create.useMutation> {
  const apiContext = api.useContext();

  const addNewNote = api.notes.create.useMutation({
    onMutate: async () => {
      await apiContext.notes.get.all.cancel();
      const optimisitcUpdate = apiContext.notes.get.all.getData();
      console.log(optimisitcUpdate);
      if (optimisitcUpdate) {
        apiContext.notes.get.all.setData(undefined, optimisitcUpdate);
      }
    },
    onSettled: async () => {
      await apiContext.notes.get.all.invalidate();
    },
  });

  return addNewNote;
}

export default function NewNotePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const addNewNote = useAddNewNote();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    addNewNote.mutate({
      title,
      description,
    });
    setDescription("");
    setTitle("");
  }

  return (
    <>
      <Head>
        <title>New note</title>
        <meta name="description" content="Create new note" />
        <link rel="icon" href="/favicon.ico"></link>
      </Head>
      <main className="mx-auto flex min-h-screen flex-col justify-center gap-4 py-10 md:container">
        <Link
          className="indigo-700 inline-block py-4 text-base font-semibold leading-7 text-green-700"
          href="/"
        >
          &larr; Go back
        </Link>
        <h1 className="mb-6 text-left text-3xl font-bold tracking-tight text-gray-900">
          New note
        </h1>
        Create new Note
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <TitleInput value={title} setValue={setTitle} />
          <DescriptionInput value={description} setValue={setDescription} />
          <button
            type="submit"
            className="max-w-fit rounded-lg bg-green-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-green-600 hover:bg-green-700 hover:ring-green-700"
          >
            Add a note
          </button>
        </form>
      </main>
    </>
  );
}
