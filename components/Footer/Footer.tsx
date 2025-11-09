import css from "../Footer/Footer.module.css";

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: Viktor Skalei</p>
          <p>
            Contact us:
            <a href="mailto:student@notehub.app"> student@notehub.app</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
