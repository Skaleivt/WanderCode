import { Note } from "@/types/note";
import { nextServer } from "./api";
import { User } from "@/types/user";
import { cookies } from "next/headers";
import { AxiosResponse } from "axios";

export interface NoteSearchResponse {
  notes: Note[];
  totalPages: number;
  page: number;
  perPage: number;
}
async function getServerCookies(): Promise<string> {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
}

export async function fetchNotesServer({
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
    headers: {
      Cookie: await getServerCookies(),
    },
  });

  return {
    ...response.data,
  };
}

export const fetchNoteByIdServer = async (id: string): Promise<Note> => {
  const res = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: await getServerCookies(),
    },
  });

  return res.data;
};

export const checkServerSession = async (): Promise<AxiosResponse> => {
  const res = await nextServer.get("/auth/session", {
    headers: {
      Cookie: await getServerCookies(),
    },
  });

  return res;
};

export const getMeServer = async (): Promise<User | null> => {
  try {
    const res = await nextServer.get<User>("/users/me", {
      headers: {
        Cookie: await getServerCookies(),
      },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch user on server:", error);
    return null;
  }
};
