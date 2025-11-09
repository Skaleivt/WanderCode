import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NewNote } from "@/types/story";

type StoryDraftStore = {
  draft: NewNote;
  setDraft: (note: NewNote) => void;
  clearDraft: () => void;
};

const initialDraft: NewNote = {
  title: "",
  content: "",
  tag: "Todo",
  // поля для історії перевизначити
};

export const useStoryDraftStore = create<StoryDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (story) => set({ draft: story }),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "story-draft",
    }
  )
);
