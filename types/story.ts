export interface Story {
  _id: string;
  img: string;
  title: string;
  article: string;
  category: string;
  ownerId: string;
  date: string;
  favoriteCount: number;
  isFavorite?: boolean;
}

export interface StoriesResponse {
  data: {
    data: Story[];
    hasNextPage: boolean;
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    hasPreviousPage: boolean;
  };
}

export interface NewStory {
  img: string;
  title: string;
  article: string;
  category: string;
  date?: string;
}
