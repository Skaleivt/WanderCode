// lib/api/clientApi.ts
import axios from 'axios';
import { StoriesResponse } from '@/types/story';

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

