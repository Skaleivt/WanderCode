"use client";
import { User } from "@/types/user";
import { nextServer } from "./api";
import { NewNote, Note } from "@/types/note";

export interface NoteSearchResponse {
  notes: Note[];
  totalPages: number;
  page: number;
  perPage: number;
}

export type RegisterRequest = {
  email: string;
  password: string;
};

export type EditRequest = {
  email: string;
  username: string;
  avatar?: string;
};
// фільтрація
export async function fetchNotes({
  searchQuery,
  tag,
  page,
}: {
  searchQuery?: string;
  tag?: string;
  page?: number;
}): Promise<NoteSearchResponse> {
  const response = await nextServer.get<NoteSearchResponse>(`/notes`, {
    params: {
      ...(searchQuery && { searchQuery: searchQuery }),
      ...(tag && tag !== "All" && { tag }),
      perPage: 9,
      page,
    },
  });

  return {
    ...response.data,
  };
}

// Деталі нотатки
export async function fetchNoteById(id: string) {
  const response = await nextServer.get<Note>(`/notes/${id}`);

  return response.data;
}

// Створення нової нотатки
export async function createNote(noteData: NewNote): Promise<Note> {
  const response = await nextServer.post<Note>(`/notes`, noteData);
  return response.data;
}

// Видалення нотатки
export async function deleteNote(id: string): Promise<Note> {
  const response = await nextServer.delete<Note>(`/notes/${id}`);
  return response.data;
}

export async function registerUser(data: RegisterRequest): Promise<User> {
  const response = await nextServer.post(`/auth/register`, data);
  return {
    ...response.data,
  };
}

export async function loginUser(data: RegisterRequest): Promise<User> {
  const response = await nextServer.post(`/auth/login`, data);
  return {
    ...response.data,
  };
}
export const getMe = async () => {
  const { data } = await nextServer.get<User>("/users/me");
  return data;
};
export const checkSession = async (): Promise<boolean> => {
  const res = await nextServer.get<{ success: boolean }>("/auth/session");
  return res.data.success;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export const editProfile = async (data: EditRequest): Promise<EditRequest> => {
  const res = await nextServer.patch("/users/me", data);
  return res.data;
};
