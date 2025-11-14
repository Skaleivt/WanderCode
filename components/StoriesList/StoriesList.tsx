// import {
//     useState
// } from 'react';

import css from './StoriesList.module.css';

// import {
//     useMutation,
//     useQueryClient
// } from '@tanstack/react-query';

// import toast from 'react-hot-toast';

// import Link from 'next/link';


interface StoriesListProps {
    stories: Array<any>; // TODO: any -> Story
}

export default function StoriesList({ stories }: StoriesListProps) {
    // const [deletingId,
    // setDeletingId]=useState<string | null>(null);
    // const queryClient=useQueryClient();

    function getDateString(date: Date): string {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    }

    
    return <>
        <h2>Популярні історії</h2> 
        <ul className={css.list}>
            {stories.map(item => <li className={css.listItem} key={item._id}>
                <img className={css.img} src={item.img} alt={item.title} />
                <div className={css.content}>
                    <div className={css.category}>{item.category}</div>
                    <h3 className={css.title}>{item.title}</h3>
                    <p className={css.description}>{item.article}</p>
                    <div>{item.ownerId}</div>
                    <div>{getDateString(new Date(item.date))}</div>
                    <div>{item.favoriteCount}</div>
                </div>
            </li>)}
        </ul>
    </>;


    // return (<ul className= {css.list}> {
    //         // notes.map(item=> (<li key= {
    //         //             item.id
    //         //         }

    //         //         className= {
    //         //             css.listItem
    //         //         }

    //         //         > <h2 className= {
    //         //             css.title
    //         //         }

    //         //         > {
    //         //             item.title
    //         //         }

    //         //         </h2> <p className= {
    //         //             css.content
    //         //         }

    //         //         > {
    //         //             item.content
    //         //         }

    //         //         </p> <div className= {
    //         //             css.footer
    //         //         }

    //         //         > <span className= {
    //         //             css.tag
    //         //         }

    //         //         > {
    //         //             item.tag
    //         //         }

    //         //         </span> <Link href= {
    //         //             `/notes/$ {
    //         //                 item.id
    //         //             }

    //         //             `
    //         //         }

    //         //         >View details</Link> <button className= {
    //         //             css.button
    //         //         }

    //         //         onClick= {
    //         //             ()=> handleDelete(item.id)
    //         //         }

    //         //         disabled= {
    //         //             deletingId===item.id
    //         //         }

    //         //         > {
    //         //             deletingId===item.id ? 'Deleting...' : 'Delete'
    //         //         }

    //         //         </button> </div> </li>))
    //         // }

    //     }</ul>);
}