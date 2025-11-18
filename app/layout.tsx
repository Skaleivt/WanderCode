// app/layout.tsx
import type { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';
import { Nunito_Sans, Sora } from 'next/font/google';
import './globals.css';

import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import AuthProvider from '@/components/AuthProvider/AuthProvider';
import { Suspense } from 'react';
import Loader from '@/components/Loader/Loader';

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
  title: 'Подорожники - WanderCode | Ваші історії про подорожі',
  description:
    'Читайте надихаючі нотатки мандрівників про дивовижні місця та створюйте власні історії подорожей.',
  openGraph: {
    title: 'Подорожники - WanderCode',
    description:
      'Прочитайте нотатки мандрівників про місця, які вони відвідали, та напишіть нотатку про їхні подорожі.',
    url: 'https://wander-code.vercel.app',
    siteName: 'Подорожники - WanderCode',
    images: [
      {
        url: '/wandercode.jpg',
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
          <Suspense fallback={<Loader />}>
            <AuthProvider>
              <main style={{ flexGrow: 1 }}>{children}</main>
              {modal} <div id="modal-root"></div>
            </AuthProvider>
          </Suspense>
          <ToastContainer />
        </TanStackProvider>
      </body>
    </html>
  );
}
