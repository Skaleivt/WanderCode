import Link from "next/link";
import css from "./page.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | NoteHub",
  description:
    "The page you are looking for could not be found. Return to the homepage to explore your notes.",
  openGraph: {
    title: "Page Not Found | NoteHub",
    description:
      "We couldn't find the page you were looking for. Go back to the homepage and continue managing your notes.",
    url: "https://notehub.com/not-found",
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "404 Not Found",
      },
    ],
    type: "website",
  },
};

export default function NotFound() {
  return (
    <div className={css.container}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
      <Link className={css.button} href="/">
        Go back Home
      </Link>
    </div>
  );
}
