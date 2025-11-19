import { Header } from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

type Props = {
  children: React.ReactNode;
};

export default function PublicLayout({ children }: Props) {
  return (
    <>
      <Header isAuthenticated={false} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
