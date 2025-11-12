// app/layout.tsx
import type { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';
import { Nunito_Sans, Sora } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import AuthProvider from '@/components/AuthProvider/AuthProvider';
import Container from '@/components/layout/Container/Container'; // 🚀 ІМПАРТ КАМПАНЕНТА КАНТЭЙНЕРА

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-family',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--second-family',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Подорожники - WanderCode | Вашыя гісторыі падарожжаў',
  description:
    'Чытайце натхняльныя нататкі падарожнікаў пра дзіўныя месцы і стварайце ўласныя гісторыі падарожжаў.',
  openGraph: {
    title: 'Подорожники - WanderCode',
    description:
      'Прачытаць заметкі падарожнікаў аб месцах, дзе яны былі, і напісаць нататку пра свае падарожжы.',
    url: 'localhost:3000',
    siteName: 'Подорожники - WanderCode',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'Подорожники - WanderCode preview',
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={`${nunitoSans.variable}${sora.variable}`}>
      <body>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            <main style={{ flexGrow: 1 }}>
              <Container>{children}</Container>
            </main>
            {modal} <div id="modal-root"></div>
            <Footer />
          </AuthProvider>
          <ToastContainer />
        </TanStackProvider>
      </body>
    </html>
  );
}
