import { api } from '@/lib/api/api';

export interface Category {
  // бекенд повертає саме такі данні ! це важливо!!!
  _id: string;
  name: string;
}

export async function getCategories(): Promise<Category[]> {
  const res = await api.get('/stories/categories');
  return res.data.data;
}
