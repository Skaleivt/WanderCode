import Image from "next/image";

import { Story } from '@/types/story';

import css from './TravellersStoriesItem.module.css';

type TravelersStoriesItemProps = {
  story: Story;
};

export default function TravelersStoriesItem({
  story,
}: TravelersStoriesItemProps) {
  const getDateString = (date: Date): string => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}.${month}.${year}`;
  }

  const viewStory = (id: string): void => {
      
  };

  const toogleFavoriteStory = (id: string): void => {
      
  };

  return (
    <div className={css.story}>
      <img className={css.img} src={story.img} alt={story.title} />
                
      <div className={css.content}>
          <div className={css.info}>
              <div className={css.category}>{story.category}</div>
              <h3 className={css.title}>{story.title}</h3>
              <p className={css.description}>{story.article}</p>
          </div>

          <div className={css.owner}>
              <img className={css.avatar} src={story.img} alt={story.ownerId} />
              <div className={css.ownerInfo}>
                  <div>{story.ownerId}</div>
                  <div>{getDateString(new Date(story.date))} &#8226; {story.favoriteCount} <Image src="/favorite.svg" width={12} height={12} alt="Favorite" /></div>
              </div>
          </div>
          
          <div className={css.buttonPanel}>
              <button 
                  onClick={() => viewStory(story._id)}
                  className={css.button} 
              >
                  Переглянути статтю
              </button>
              <button 
                  onClick={() => toogleFavoriteStory(story._id)}
                  className={[css.button, css.favoriteButton].join(" ")}
              >
                  <Image src="/favorite.svg" width={20} height={20} alt="Favorite" />
              </button>
          </div>
      </div>
    </div>
  );
}
