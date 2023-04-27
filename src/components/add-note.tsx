import { api } from "@/utils/api";

function useAddNewNote(): ReturnType<typeof api.notes.create.useMutation> {
  const apiContext = api.useContext();

  const addNewNote = api.notes.create.useMutation({
    onMutate: async () => {
      await apiContext.notes.get.all.cancel();
      const optimisitcUpdate = apiContext.notes.get.all.getData();

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

export function AddNoteButton() {
  const addNewNote = useAddNewNote();
  function handleAddNote() {
    const res = addNewNote.mutate({});
    console.log({ res });
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
