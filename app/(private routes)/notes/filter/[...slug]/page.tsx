import NotesClient from "./Notes.client";
import { fetchNotesServer } from "@/lib/api/serverApi";
import type { NoteSearchResponse } from "@/lib/api/serverApi";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug?: string[] }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = (await params).slug?.[0] || "All";
  const selectedTag = tag === "All" ? "All" : tag;

  return {
    title: `Notes tag: ${selectedTag} | NoteHub`,
    description: `Browse all notes tagged with "${selectedTag}" on NoteHub. Discover and manage notes related to this topic.`,
    openGraph: {
      title: `Notes tag: ${selectedTag} | NoteHub`,
      description: `View and explore notes marked with the tag "${selectedTag}". Find all your content related to this category in one place.`,
      url: `https://notehub.com/notes/filter/${selectedTag}`,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `Notes tagged with ${selectedTag}`,
        },
      ],
      type: "website",
    },
  };
}

export default async function NotesPage({ params }: Props) {
  const paramsQuery = await params;
  const [tag] = paramsQuery.slug || [];
  const page = 1;

  const initialData: NoteSearchResponse = await fetchNotesServer({
    tag,
    searchQuery: "",
    page,
  });

  return <NotesClient initialData={initialData} tag={tag} />;
}
