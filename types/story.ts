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

export interface DetailedStory {
  _id: string;
  img: string;
  title: string;
  article: string;
  category: {
    _id: string;
    title: string;
  };
  owner: {
    _id: string;
    name: string;
    avatarUrl: string;
  };
  date: string;
  favoriteCount: number;
}
