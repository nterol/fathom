import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import { MiniThumbnail } from "./thumbnail";

function NodeList({ currentNoteID }: GraphColumnProps) {
  const { data: allNotes, isLoading } = api.notes.get.all.useQuery();
  const createRelation = api.notes.createRelation.useMutation();
  function handleCreateRelation({ id }: { id: string }) {
    return function () {
      createRelation.mutate({ sourceID: currentNoteID, targetID: id });
    };
  }

  return (
    <>
      {isLoading && !allNotes ? (
        <div
          style={{ "--delay": `${Math.random()}s` } as React.CSSProperties}
          className="placeholder h-11 w-1/2 rounded-lg bg-slate-500"
        />
      ) : null}
      {allNotes
        ? allNotes?.map((note) =>
            note.id === currentNoteID ? null : (
              <div
                className="flex flex-col gap-1"
                key={note.id}
                onClick={handleCreateRelation({ id: note.id })}
              >
                <MiniThumbnail note={note} />
              </div>
            )
          )
        : null}
    </>
  );
}

type GraphColumnProps = {
  currentNoteID: string;
};

export function GraphColumn({ currentNoteID }: GraphColumnProps) {
  const [trigger, setTrigger] = useState(false);

  useEffect(() => () => setTrigger(false), []);

  return (
    <section className="flex w-[20%] min-w-[300px] flex-col gap-4 rounded-lg bg-blue-200 p-4">
      <div className="h-40 w-full rounded-lg bg-red-200" />
      {trigger ? (
        <NodeList currentNoteID={currentNoteID} />
      ) : (
        <button
          onClick={() => setTrigger(true)}
          className="max-w-fit rounded-lg bg-green-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-green-600 hover:bg-green-700 hover:ring-green-700"
        >
          Add a relation
        </button>
      )}
    </section>
  );
}
