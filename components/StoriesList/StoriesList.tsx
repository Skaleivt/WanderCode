'use client';

import Image from "next/image";

import css from './StoriesList.module.css';

interface StoriesListProps {
    stories: Array<any>; // TODO: any -> Story
}

export default function StoriesList({ stories }: StoriesListProps) {
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
    
    return <>
        <h2>Популярні історії</h2> 
        <ul className={css.list}>
            {stories.map(item => <li className={css.listItem} key={item._id}>
                <img className={css.img} src={item.img} alt={item.title} />
                
                <div className={css.content}>
                    <div className={css.info}>
                        <div className={css.category}>{item.category}</div>
                        <h3 className={css.title}>{item.title}</h3>
                        <p className={css.description}>{item.article}</p>
                    </div>

                    <div className={css.owner}>
                        <img className={css.avatar} src={item.img} alt={item.ownerId} />
                        <div className={css.ownerInfo}>
                            <div>{item.ownerId}</div>
                            <div>{getDateString(new Date(item.date))} &#8226; {item.favoriteCount} <Image src="/favorite.svg" width={12} height={12} alt="Favorite" /></div>
                        </div>
                    </div>
                    
                    <div className={css.buttonPanel}>
                        <button 
                            onClick={() => viewStory(item._id)}
                            className={css.button} 
                        >
                            Переглянути статтю
                        </button>
                        <button 
                            onClick={() => toogleFavoriteStory(item._id)}
                            className={[css.button, css.favoriteButton].join(" ")}
                        >
                            <Image src="/favorite.svg" width={20} height={20} alt="Favorite" />
                        </button>
                    </div>
                </div>
            </li>)}
        </ul>
    </>;
}