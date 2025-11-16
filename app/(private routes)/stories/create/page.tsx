import AddStoryForm from '@/components/StoriesForm/AddStoryForm';

export const metadata = {
  title: 'Створити нову історію — Подорожники',
  description:
    'Завантажте обкладинку, додайте заголовок, категорію та текст історії.',
};

export default async function AddStoryPage() {
  return <AddStoryForm />;
}
