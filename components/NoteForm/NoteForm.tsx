"use client";
import css from "../NoteForm/NoteForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createNote } from "../../lib/api/clientApi";
import { showErrorToast } from "../ShowErrorToast/ShowErrorToast";
import type { NewNote } from "../../types/note";
import { useNoteDraftStore } from "@/lib/store/noteStore";

export default function NoteForm() {
  const queryClient = useQueryClient();

  const router = useRouter();
  const close = () => router.back();

  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const { mutate } = useMutation({
    mutationFn: (newNote: NewNote) => createNote(newNote),
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      close();
    },
    onError: () => {
      showErrorToast("Error creating note");
    },
  });

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newNote: NewNote = {
      title: String(formData.get("title") || ""),
      content: String(formData.get("content") || ""),
      tag: String(formData.get("tag") || "Todo"),
    };
    mutate(newNote);
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={draft.title}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={draft.content}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={close}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton}>
          Create note
        </button>
      </div>
    </form>
  );
}
