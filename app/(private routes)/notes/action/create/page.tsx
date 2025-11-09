import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Note | NoteHub",
  description:
    "Create a new note in your NoteHub workspace. Add a title, content, and organize it with categories and tags.",
  openGraph: {
    title: "Create Note | NoteHub",
    description:
      "Start writing a new note in NoteHub. Capture your ideas, tasks, or reminders with ease.",
    url: "https://notehub.com/notes/create",
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Create Note",
      },
    ],
    type: "website",
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        {<NoteForm />}
      </div>
    </main>
  );
}
