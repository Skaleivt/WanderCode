// lib/api/clientApi.ts
import axios from 'axios';
import { StoriesResponse } from '@/types/story';

import { nextServer } from './api';
import { Story, DetailedStory } from '@/types/story';

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

export const fetchStoryById = async (id: string): Promise<DetailedStory> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/stories/${id}`,
    {
      withCredentials: true,
    }
  );
  const story = response.data.data;

  // Створюємо правильний формат для DetailedStory
  return {
    _id: story._id,
    img: story.img,
    title: story.title,
    article: story.article,
    date: story.date,
    favoriteCount: story.favoriteCount,
    owner: story.owner, // з бекенду приходить { _id, name, avatarUrl }
    category: story.category, // з бекенду приходить { _id, title }
  };
};

/* Додаю функцію для кнопки зберігти історію  */
export const saveStory = async (id: string) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/stories/save/${id}`,
    {},
    { withCredentials: true }
  );
  return response.data;
};
