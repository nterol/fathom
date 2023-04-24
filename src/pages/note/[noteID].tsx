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

  await helpers.notes.get.byID.prefetch({ id });

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
  const postQuery = api.notes.get.byID.useQuery({ id });

  if (postQuery.status !== "success") {
    return <div>If you&amp;re seeing this something went very very wrong</div>;
  }
  const { data } = postQuery;

  console.log(data);

  const formatDate = data?.createdAt
    ? new Date(data.createdAt).toLocaleDateString("fr", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  return (
    <main className="flex min-h-screen w-full flex-row gap-2 p-2 ">
      <section className="flex w-full flex-col rounded-lg bg-slate-200 p-4">
        <div className="flex justify-between ">
          <h1 className="text-2xl font-bold">{data?.title}</h1>
          <span className="text-sm font-bold">{formatDate}</span>
        </div>
        <div>{data?.description}</div>
      </section>
      {data?.id ? <GraphColumn currentNoteID={data?.id} /> : null}
    </main>
  );
}
