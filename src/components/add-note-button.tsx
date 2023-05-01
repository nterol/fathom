import { api } from "@/utils/api";
import { useRouter } from "next/router";

function useAddNewNote(
  apiContext: ReturnType<typeof api.useContext>
): ReturnType<typeof api.notes.create.useMutation> {
  const router = useRouter();

  const addNewNote = api.notes.create.useMutation({
    onMutate: async () => {
      await apiContext.notes.get.all.cancel();
      const optimisitcUpdate = apiContext.notes.get.all.getData();

      if (optimisitcUpdate) {
        apiContext.notes.get.all.setData(undefined, optimisitcUpdate);
      }
    },
    onSettled: async (data) => {
      await apiContext.notes.get.all.invalidate();
      if (!data?.id) return;
      await router.push(`/note/${data.id}`);
    },
  });

  return addNewNote;
}

export function AddNoteButton() {
  const apiContext = api.useContext();
  const addNewNote = useAddNewNote(apiContext);

  function handleAddNote() {
    const noteNumber = 1 + (apiContext.notes.get.all.getData()?.length ?? 0);
    addNewNote.mutate({ title: `My new note #${noteNumber}` });
  }
  return (
    <button
      className="inline-block max-w-fit rounded-lg bg-green-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-green-600 hover:bg-green-700 hover:ring-green-700"
      onClick={handleAddNote}
    >
      Add an note
    </button>
  );
}
