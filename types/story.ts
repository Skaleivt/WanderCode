// types/story.ts
export interface Story {
  _id: string;
  img: string;
  title: string;
  article: string;
  category: Category;
  ownerId: {
    selectedStories: [];
    default: [];
    _id: string;
    name: string;
    avatarUrl?: string;
    articlesAmount?: number;
    description?: string;
  };
  date: string;
  favoriteCount: number;
  shortDesc?: string;
  body: string;
  coverUrl?: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
}

export interface StoriesResponse {
  data: {
    data: Story[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    page: number;
    perPage: number;
    hasPreviousPage: boolean;
  };
}

export interface NewStory {
  img: string;
  title: string;
  category: string;
  date?: string;
  description: string;
  cover?: File;
}

export interface Category {
  _id: string;
  name: string;
}

export interface CategoryResponse {
  data: Category[];
}

export interface DetailedStory {
  _id: string;
  img: string;
  title: string;
  article: string;
  category: {
    _id: string;
    name: string;
  };
  owner: {
    _id: string;
    name: string;
    avatarUrl: string;
  };
  date: string;
  favoriteCount: number;
}
