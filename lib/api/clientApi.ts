// lib/api/clientApi.ts
import axios from 'axios';
import { StoriesResponse } from '@/types/story';
import { User } from '@/types/user'; // Імпартуем асноўны тып User

// ===============================================
// === ТЫПЫ ДЛЯ АЎТЭНТЫФІКАЦЫІ ===
// ===============================================

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

// Тып поўнага адказу ад бэкенда пасля ўваходу/рэгістрацыі
export type AuthResponse = {
  token: string;
  user: User; // Выкарыстоўваем імпартаваны тып User
};

// ===============================================
// === ФУНКЦЫІ АЎТЭНТЫФІКАЦЫІ ===
// ===============================================

export async function registerUser(
  credentials: RegisterRequest
): Promise<AuthResponse> {
  const response = await axios.post('/api/auth/register', credentials);
  return response.data;
}

export async function loginUser(
  credentials: LoginRequest
): Promise<AuthResponse> {
  const response = await axios.post('/api/auth/login', credentials);
  return response.data;
}

// ===============================================
// === ІСНУЮЧЫЯ ФУНКЦЫІ ===
// ===============================================

export async function checkSession(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error during session check:', error);
    return false;
  }
}

export async function getMe() {
  return null;
}

export const getPopularStories = async (page = 1): Promise<StoriesResponse> => {
  const response = await axios.get(
    `/api/stories?type=popular&page=${page}&limit=6`
  );
  return response.data;
};
