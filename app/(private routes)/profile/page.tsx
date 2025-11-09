import { getMeServer } from "@/lib/api/serverApi";
import { Metadata } from "next";
import css from "./ProfilePage.module.css";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Profile Page | NoteHub",
  description:
    "Manage your profile in NoteHub: update personal details, review activity, and customize your account for a better note-taking experience.",
  openGraph: {
    title: "Profile Page | NoteHub",
    description:
      "Your NoteHub profile: edit personal information, track activity, and adjust account settings to enhance your productivity with notes.",
    url: "https://notehub.com/profile",
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Profile",
      },
    ],
    type: "website",
  },
};

export default async function userProfile() {
  const user = await getMeServer();
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          {user?.avatar && (
            <Image
              src={user?.avatar}
              alt="User Avatar"
              width={120}
              height={120}
              className={css.avatar}
            />
          )}
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user?.username}</p>
          <p>Email: {user?.email}</p>
        </div>
      </div>
    </main>
  );
}
