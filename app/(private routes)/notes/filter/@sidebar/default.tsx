import css from "./SidebarNotes.module.css";
import Link from "next/link";

const tags = ["All", "Work", "Personal", "Meeting", "Shopping", "Todo"];

export default function SidebarNotes() {
  return (
    <>
      <Link className={css.menuLink} href="/notes/action/create">
        Create note
      </Link>
      <ul className={css.menuList}>
        {tags.map((tag) => (
          <li key={tag} className={css.menuItem}>
            <Link
              href={
                tag === "All" ? "/notes/filter/All" : `/notes/filter/${tag}`
              }
              className={css.menuLink}
            >
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
