import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NewStory } from '@/types/story';

type StoryDraftStore = {
  draft: NewStory;
  setDraft: (story: NewStory) => void;
  clearDraft: () => void;
};

const initialDraft: NewStory = {
  img: '',
  title: '',
  description: '',
  category: '',
};

export const useStoryDraftStore = create<StoryDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (story) => set({ draft: story }),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'story-draft',
    }
  )
);
