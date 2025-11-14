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

    
    return <>
        <h2>Популярні історії</h2> 
        <ul className={css.list}>
            {stories.map(item => <li className={css.listItem} key={item}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
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