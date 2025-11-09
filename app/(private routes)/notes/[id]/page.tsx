import { fetchNoteByIdServer } from "@/lib/api/serverApi";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";
import { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteByIdServer(id);
  return {
    title: `Note: ${note.title} | NoteHub`,
    description: note.content.slice(0, 30),
    openGraph: {
      title: `Note: ${note.title}`,
      description: note.content.slice(0, 100),
      url: `https://notehub.com/notes/${id}`,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
      type: "article",
    },
  };
}

export default async function NoteDetails({ params }: Props) {
  const queryClient = new QueryClient();
  const { id } = await params;
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteByIdServer(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return <NoteDetailsClient dehydratedState={dehydratedState} />;
}
