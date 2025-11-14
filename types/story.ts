// export interface Story {
//   id: string;
//   title: string;
//   content: string;
//   tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
//   createdAt: string;
//   updatedAt: string;
// }

// export interface NewStory {
//   title: string;
//   content: string;
//   tag: string;
// }
// переписати для типу сторі те що є це тільки для прикладу


export type Story = {
  id: string;
  title: string;
  category: string;
  text: string;
  coverUrl?: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};

export type StoriesResponse = {
  items: Story[];
  page: number;
  total: number;
};

export type CreateStoryPayload = {
  title: string;
  category: string;
  text: string;
  cover?: File | null;
};