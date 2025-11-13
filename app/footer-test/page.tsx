import Footer from '@/components/Footer/Footer';

export default function FooterTestPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flex: '1 0 auto', padding: '40px' }}>
        <h1>Тест Footer</h1>
     

        <p>Тут можна нічого не верстати, просто щоб сторінка існувала 🙂</p>
      </main>
      <Footer />
    </div>
  );
}