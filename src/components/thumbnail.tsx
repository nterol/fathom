import Link from "next/link";

type Note = { id: string; title: string | null };

type ThumbnailProps = {
  note: Note;
  children?: React.ReactNode;
};

export function Thumbnail({ note, children }: ThumbnailProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-4">
      <Link href={`/note/${note.id}`} className="w-full py-4">
        <h5 className="text-1xl font-bold">{note.title}</h5>
      </Link>
      {children}
    </div>
  );
}

export function MiniThumbnail({ note }: { note: Note }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-4">
      <div className="w-full py-4">
        <h5 className="text-1xl font-bold">{note.title}</h5>
      </div>
    </div>
  );
}
