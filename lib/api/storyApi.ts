import { addStoryToSaved, removeStoryFromSaved } from './clientApi';

export const toggleStoryBookmark = async (
  storyId: string,
  currentlySaved: boolean,
) => {
  if (currentlySaved) {
    await removeStoryFromSaved(storyId);
    return { saved: false };
  }
  await addStoryToSaved(storyId);
  return { saved: true };
};