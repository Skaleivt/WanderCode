"use client";

import Image from "next/image";
import css from "./EditProfilePage.module.css";
import { editProfile, EditRequest, getMe } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { ApiError } from "next/dist/server/api-utils";
import { showErrorToast } from "@/components/ShowErrorToast/ShowErrorToast";

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setLocalUser] = useState<EditRequest | null>(null);
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMe();
        setLocalUser(data);
        document.title = `Edit Profile | ${data.username || "User"}`;
        document
          .querySelector('meta[name="description"]')
          ?.setAttribute(
            "content",
            `Editing a user profile ${data.username || ""}`
          );
      } catch {
        showErrorToast("Failed to load user data");
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const formData = new FormData(e.currentTarget);
    const formValues: EditRequest = {
      email: user.email,
      username: String(formData.get("username")),
    };
    try {
      const res = await editProfile(formValues);

      if (res) {
        setUser(res);
        router.push("/profile");
      } else {
        showErrorToast("Invalid email or password");
      }
    } catch (error) {
      showErrorToast((error as ApiError).message ?? "Oops... some error");
    }
  };
  const close = () => router.back();
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        {user?.avatar && (
          <Image
            src={user?.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        )}

        <form onSubmit={handleSubmit} className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              name="username"
              id="username"
              type="text"
              className={css.input}
            />
          </div>

          <p>Email: {user?.email ?? "Loading..."}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button onClick={close} type="button" className={css.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
