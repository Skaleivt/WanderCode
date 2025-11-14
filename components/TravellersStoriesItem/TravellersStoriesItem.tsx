// components/TravellersStoriesItem/TravellersStoriesItem.tsx (КАНЧАТКОВАЯ ВЕРСІЯ)
import React from 'react';
// !!! АБАВЯЗКОВА: Імпарт тыпу Story !!!
// Калі шлях іншы, выкарыстоўвайце свой шлях, напрыклад, '../types/story'
import { Story } from '@/types/story';

// АБНАЎЛЕННЕ: Даданне пропса story
interface TravellersStoriesItemProps {
  story: Story; // Гэта вырашае памылку тыпаў у PopularSection.tsx
  // Вы можаце выдаліць title, калі ён не выкарыстоўваецца
}

export default function TravellersStoriesItem({
  story,
}: TravellersStoriesItemProps) {
  return (
    <div style={{ padding: '10px', border: '1px solid #ccc' }}>
      {/* Выкарыстоўваем дадзеныя story */}
      <h4>Элемент Гісторыі: {story.title || 'Без загалоўка'}</h4>
      <p>Аўтар: {story.ownerId}</p>
    </div>
  );
}
