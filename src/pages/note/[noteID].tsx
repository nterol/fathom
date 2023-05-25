import { Editor } from "@/components/editor";
import { GraphColumn } from "@/components/graph-column";
import { appRouter } from "@/server/api/root";
import { prisma } from "@/server/db";
import { api } from "@/utils/api";
import { createServerSideHelpers } from "@trpc/react-query/server";

import { type InferGetStaticPropsType, type GetStaticPropsContext } from "next";
import superjson from "superjson";

export async function getStaticProps(
  ctx: GetStaticPropsContext<{ noteID: string }>
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma },
    transformer: superjson,
  });
  const id = ctx.params?.noteID as string;

  await helpers.notes.get.byID.prefetch({ id, withGraph: true });

  return {
    props: {
      id,
      trpcState: helpers.dehydrate(),
    },
    revalidate: 1,
  };
}

export const getStaticPaths = async () => {
  const notes = await prisma.notes.findMany({ select: { id: true } });

  return {
    paths: notes.map((note) => ({
      params: {
        noteID: note.id,
      },
    })),
    fallback: "blocking",
  };
};

export default function NotePage({
  id,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const postQuery = api.notes.get.byID.useQuery({ id, withGraph: true });

  if (postQuery.status !== "success") {
    return <div>If you&amp;re seeing this something went very very wrong</div>;
  }
  const { data } = postQuery;

  console.log({ data });

  return (
    <main className="flex min-h-screen w-full flex-row gap-2 p-2">
      {data?.content ? (
        <Editor
          content={data.content}
          title={data.title}
          description={data.description}
          createdAt={data.createdAt}
        />
      ) : null}
      {data?.id ? <GraphColumn currentNoteID={data?.id} /> : null}
    </main>
  );
}
