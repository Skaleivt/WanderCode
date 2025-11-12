import type { Metadata } from "next";
import TravellersStories from "@/components/TravellersStories/TravellersStories";
import styles from "./StoriesPage.module.css";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

export const metadata: Metadata = {
  title: "Історії Мандрівників | Подорожники",
  description:
    "Надихаючі історії мандрівників з усього світу: Європа, Азія, гори, пустелі та океани. Читайте досвід інших та плануйте власні пригоди.",
};

const StoriesPage = () => {
  return (
    <main className={styles.page}>
      <section className={styles.section}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.heading}>Історії  Мандрівників</h1>

            {/* Ряд табів (desktop/tablet) */}
            <div className={styles.filtersRow}>
              <button
                type="button"
                className={`${styles.filterBtn} ${styles.filterBtnActive}`}
              >
                Всі історії
              </button>
              <button type="button" className={styles.filterBtn}>
                Європа
              </button>
              <button type="button" className={styles.filterBtn}>
                Азія
              </button>
              <button type="button" className={styles.filterBtn}>
                Гори
              </button>
              {/* Додавай інші, якщо потрібні */}
            </div>

            {/* Select для мобільного (адаптив робить CSS) */}
            <div className={styles.filtersSelectWrapper}>
              <label htmlFor="stories-category" className={styles.selectLabel}>
                Категорії
              </label>
              <select
                id="stories-category"
                className={styles.select}
                defaultValue="all"
              >
                <option value="all">Всі історії</option>
                <option value="europe">Європа</option>
                <option value="asia">Азія</option>
                <option value="mountains">Гори</option>
              </select>
            </div>
          </header>

          {/* Тут живе вся логіка: стартова кількість карток, +3, лоадер, toast, empty state */}
          <TanStackProvider>
            <TravellersStories />
          </TanStackProvider>
        </div>
      </section>
    </main>
  );
};

export default StoriesPage;