import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Container from '@/components/Container/Container';
type Props = {
  children: React.ReactNode;
};

export default function PublicLayout({ children }: Props) {
  return (
    <>
      <Header />
      <main>
        <Container>{children}</Container>
      </main>
      <Footer />
    </>
  );
}
