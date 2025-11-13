export interface Story { 
  _id: string;
  img: string;
  title: string;
  article: string;
  category: string;
  ownerId: string;
  date: string;
  favoriteCount: number;
}

export interface StoriesResponse {
  stories: Story[];
  hasMore: boolean;
}

export interface NewStory {
  img: string;
  title: string;
  article: string;
  category: string;
  date?: string;
}