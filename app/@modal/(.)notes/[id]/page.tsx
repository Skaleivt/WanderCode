import { fetchNoteByIdServer } from "@/lib/api/serverApi";
import NotePreviewModal from "./NotePreview.client";
import { QueryClient, dehydrate } from "@tanstack/react-query";

type Props = {
  params: Promise<{ id: string }>;
};

const NotePreview = async ({ params }: Props) => {
  const queryClient = new QueryClient();
  const { id } = await params;
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteByIdServer(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return <NotePreviewModal dehydratedState={dehydratedState} />;
};

export default NotePreview;
