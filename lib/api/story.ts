import axios from "axios";
import type { StoriesResponse, Story, NewStory } from "@/types/story";

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
