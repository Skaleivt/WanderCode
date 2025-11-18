import axios from "axios";
import type { StoriesResponse, Story, NewStory } from "@/types/story";
import { nextServer } from "@/lib/api/api";

export const storiesKeys = {
  all: ["stories"] as const,
  saved: () => ["stories", "saved"] as const,
  mine: () => ["stories", "mine"] as const,
};

export async function getSavedStories(page = 1, limit = 9): Promise<StoriesResponse> {
  const { data } = await axios.get("/api/stories/saved", { params: { page, limit } });
  return data;
}

export async function getMyStories(page = 1, limit = 9): Promise<StoriesResponse> {
  const { data } = await axios.get("/api/stories/mine", { params: { page, limit } });
  return data;
}

export async function createStory(payload: NewStory): Promise<Story> {
  // формуємо multipart (фото опційне)
  const fd = new FormData();
  fd.append("title", payload.title);
  fd.append("category", payload.category);
  fd.append("shortDesc", payload.shortDesc ?? '');
  fd.append("body", payload.body);
  if (payload.cover) fd.append("cover", payload.cover);

  const { data } = await axios.post("/api/stories", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; // очікується { id, ... }
}
export async function getCategories() {
  const { data } = await axios.get("/api/categories");
  return data.data; // припускаю структура: { data: Category[] }
}

export async function getStoryById(id: string): Promise<Story> {
  const res = await nextServer.get(`/stories/${id}`);
  return res.data.data;
}

export async function updateStory(id: string, form: FormData): Promise<Story> {
  const res = await nextServer.patch(`/stories/${id}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}

