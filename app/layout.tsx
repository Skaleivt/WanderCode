// app/layout.tsx
import type { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';
import { Nunito_Sans, Sora } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import AuthProvider from '@/components/AuthProvider/AuthProvider';
import Container from '@/components/Layout/Container/Container';

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
  title: 'Подорожники - WanderCode | Ваші історії подорожей',
  description:
    'Читайте натхненні нотатки мандрівників про дивовижні місця та створюйте власні історії подорожей.',
  openGraph: {
    title: 'Подорожники - WanderCode',
    description:
      'Прочитати нотатки мандрівників про місця, де вони були, та написати нотатку про власні подорожі.',
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
