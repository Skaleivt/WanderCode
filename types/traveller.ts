// types/traveller.ts

import { User } from './user';
export interface Traveller extends User {
  _id: string;
  description?: string;
  articlesAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TravellersResponse {
  status: number;
  message: string;
  data: {
    data: Traveller[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
