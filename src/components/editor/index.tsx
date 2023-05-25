import { type Prisma } from "@prisma/client";
import { EditorContent, type JSONContent, useEditor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import StarterKit from "@tiptap/starter-kit";

import c from "classnames";
import s from "@/styles/editor.module.css";

type EditorProp = {
  createdAt: Date;
  title: string | null;
  description: string | null;
  content: Prisma.JsonValue;
};

export function Editor({ content }: EditorProp) {
  //   const formatDate = createdAt
  //     ? new Date(createdAt).toLocaleDateString("fr", {
  //         weekday: "short",
  //         year: "numeric",
  //         month: "short",
  //         day: "numeric",
  //       })
  //     : "N/A";

  const editor = useEditor({
    extensions: [StarterKit, Document, Paragraph, Text, Heading],
    editorProps: { attributes: { class: "h-full w-full focus:outline-none" } },
    content: {
      type: "doc",
      content: content as JSONContent[],
    },
  });
  return (
    <section
      className={c(
        s.editor,
        "flex max-h-screen w-full flex-col overflow-scroll rounded-lg bg-slate-200 p-8"
      )}
    >
      <EditorContent editor={editor} />
    </section>
  );
}
