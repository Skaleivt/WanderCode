// app/page.tsx
import React from 'react';

import PopularSection from '@/components/PopularSection/PopularSection';
import css from './page.module.css';
import Link from 'next/link';
import { cookies } from 'next/headers';
import Container from '@/components/Container/Container';
import TravellersSectionHome from '@/components/Travellers/TravellersSectionHome/TravellersSectionHome';

export default async function HomePage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has('accessToken');
  let link;
  let btnText;
  if (isAuthenticated) {
    link = '/auth/profile';
    btnText = 'Збережені';
  } else {
    link = '/auth/register';
    btnText = 'Зареєструватися';
  }

  return (
    <>
      <Container>
        <section className={css.heroContainer}>
          <div className={css.hero}>
            <h1 className={css.heroTitle}>Відкрийте світ подорожей з нами!</h1>
            <p className={css.heroText}>
              Приєднуйтесь до нашої спільноти мандрівників, де ви зможете
              ділитися своїми історіями та отримувати натхнення для нових
              пригод. Відкрийте для себе нові місця та знайдіть однодумців!
            </p>
            <button className={css.heroBtn}>
              <Link href="#Join">Доєднатись</Link>
            </button>
          </div>
        </section>

        <section className={css.about}>
          <div>
            <div className={css.aboutContainer}>
              <h2 className={css.aboutTitle}>
                Проєкт, створений для тих, хто живе подорожами
              </h2>
              <p className={css.aboutText}>
                Ми віримо, що кожна подорож — це унікальна історія, варта того,
                щоб нею поділилися. Наша платформа створена, щоб об`єднати
                людей, закоханих у відкриття нового. Тут ви можете ділитися
                власним досвідом, знаходити друзів та надихатися на наступні
                пригоди разом з нами.
              </p>
            </div>
            <ul className={css.aboutList}>
              <li className={css.aboutItem}>
                <div className={css.aboutItemContainer}>
                  <svg className={css.aboutItemIcon}>
                    <use href="/symbol-defs.svg#icon-wand_stars"></use>
                  </svg>
                  <h3 className={css.aboutItemTitle}>Наша місія</h3>
                  <p className={css.aboutItemText}>
                    Об`єднувати людей через любов до пригод та надихати на нові
                    відкриття.
                  </p>
                </div>
              </li>
              <li className={css.aboutItem}>
                <div className={css.aboutItemContainer}>
                  <svg className={css.aboutItemIcon}>
                    <use href="/symbol-defs.svg#icon-travel_luggage_and_bags"></use>
                  </svg>
                  <h3 className={css.aboutItemTitle}>Автентичні історії</h3>
                  <p className={css.aboutItemText}>
                    Ми цінуємо справжні, нередаговані враження від мандрівників
                    з усього світу.
                  </p>
                </div>
              </li>
              <li className={css.aboutItem}>
                <div className={css.aboutItemContainer}>
                  <svg className={css.aboutItemIcon}>
                    <use href="/symbol-defs.svg#icon-communication"></use>
                  </svg>
                  <h3 className={css.aboutItemTitle}>Ваша спільнота</h3>
                  <p className={css.aboutItemText}>
                    Станьте частиною спільноти, де кожен може бути і автором, і
                    читачем.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>
        <section className={css.popularStoriesSection}>
          <h2 className={css.popularStoriesTitle}>Популярні історії</h2>
          <PopularSection />
        </section>
        <section className={css.travellersHomeSection}>
          <h2 className={css.travellersHomeTitle}>Наші Мандрівники</h2>
          <TravellersSectionHome />
        </section>
        {/* <TravellersPage /> */}
        <section id="Join" className={css.containerSec}>
          <div className={css.joinUs}>
            <h2 className={css.title}>Приєднуйтесь до нашої спільноти</h2>
            <p className={css.text}>
              Долучайтеся до мандрівників, які діляться своїми історіями та
              надихають на нові пригоди.
            </p>
            <button className={css.btn}>
              <Link href={link} prefetch={false}>
                {btnText}
              </Link>
            </button>
          </div>
        </section>
      </Container>
    </>
  );
}
