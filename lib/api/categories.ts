import { nextServer } from "@/lib/api/api";

export interface Category {
  _id: string;
  value: string;
  label: string;
}

export async function getCategories(): Promise<Category[]> {
  const res = await nextServer.get("/categories");
  return res.data.data;  // бекенд повертає data: { data: [] }
}