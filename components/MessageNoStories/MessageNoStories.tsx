'use client';

import { useRouter } from 'next/navigation';
import css from './MessageNoStories.module.css';

interface MessageNoStoriesProps {
  text: string;
  buttonText: string;
  route?: string;
}

export default function MessageNoStories({
  text,
  buttonText,
  route = '/stories',
}: MessageNoStoriesProps) {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push(route);
  };

  return (
    <div className={css.container}>
      <div className={css.messageBox}>
        <p className={css.message}>{text}</p>
        <button className={css.button} onClick={handleButtonClick}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}
