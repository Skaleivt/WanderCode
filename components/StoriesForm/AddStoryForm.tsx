'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, FormikHelpers, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import { showErrorToast } from '@/components/ShowErrorToast/ShowErrorToast';
import Loader from '@/components/Loader/Loader';
import styles from './AddStoryForm.module.css';
// import { useField } from 'formik';
import { useQuery } from '@tanstack/react-query';
import { createStory, getCategories } from '@/lib/api/story';
import { Category } from '@/types/story';

// // ---- Лічильник символів для короткого опису
// const ShortDescLiveCounter = () => {
//   const [field] = useField<string>('shortDesc');
//   const left = 61 - (field.value?.length ?? 0);
//   return (
//     <div className={styles.helper}>Лишилось символів: {Math.max(0, left)}</div>
//   );
// };

// ---- Типи форми
export interface AddStoryFormValues {
  cover: File | null;
  title: string;
  category: string;
  // shortDesc?: string;
  description: string;
}
// ---- Валідація
const schema = Yup.object({
  cover: Yup.mixed<File>()
    .required('Додайте обкладинку')
    .test('fileType', 'Підтримуються зображення', (f) =>
      f ? /^image\//.test(f.type) : false
    ),
  title: Yup.string()
    .trim()
    .min(3, 'мін. 3 символи')
    .max(100, 'макс. 100')
    .required('Обовʼязково'),
  category: Yup.string().required('оберіть категорію'),
  description: Yup.string()
    .trim()
    .min(30, 'мін. 30 символів')
    .required('Обовʼязково'),
});

// ---- Початкові значення
const initialValues: AddStoryFormValues = {
  cover: null,
  title: '',
  category: '',
  // shortDesc: '',
  description: '',
};

type ApiError = Error & {
  status?: number;
  response?: {
    status: number;
    data: unknown;
  };
};

export default function AddStoryForm() {
  const router = useRouter();
  const qc = useQueryClient();

  const [preview, setPreview] = useState<string | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [publishedOpen, setPublishedOpen] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

  // --- Категорії з бекенду
  const { data: categories, isLoading: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
  const mutation = useMutation<{ id: string }, Error, AddStoryFormValues>({
    mutationFn: createStory,
    onSuccess: async (data) => {
      await qc.invalidateQueries({ queryKey: ['profile', 'my-stories'] });
      setCreatedId(data.id); // зберігаємо ID нової історії
      setPublishedOpen(true); // відкриваємо модалку успіху
    },
    onError: (err: ApiError) => {
      const status = err?.response?.status || err?.status;

      if (status === 401 || status === 403) {
        setErrorOpen(true);
      } else {
        showErrorToast(err.message || 'Не вдалося зберегти історію');
      }
    },
  });

  const handleFileChange = (
    file: File | null,
    setFieldValue: (
      field: string,
      value: unknown,
      shouldValidate?: boolean
    ) => void
  ) => {
    setFieldValue('cover', file, true);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  // Прибираємо objectURL коли превʼю змінюється/компонент розмонтовується
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onSubmit = async (
    values: AddStoryFormValues,
    helpers: FormikHelpers<AddStoryFormValues>
  ) => {
    try {
      await mutation.mutateAsync(values);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  // Мемо для розміру зображення в залежності від ширини (за бажанням)
  const imgSizes = useMemo(() => '(max-width: 768px) 100vw, 865px', []);
  if (catLoading) return <Loader />;
  console.log(categories);
  return (
    <>
      <section className={styles.wrap}>
        <div className={styles.inner}>
          <h2 className={styles.title}>Створити нову історію</h2>

          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={onSubmit}
          >
            {({ setFieldValue, isValid, dirty, isSubmitting, values }) => (
              <Form className={styles.form}>
                <div className={styles.content}>
                  <div className={styles.field}>
                    <span className={styles.labelTitle}>Обкладинка статті</span>

                    {/* Обкладинка */}
                    <div className={styles.coverBox}>
                      <div className={styles.coverImage}>
                        <Image
                          src={preview || '/file.svg'}
                          alt="Попередній перегляд обкладинки"
                          fill
                          sizes={imgSizes}
                          priority
                        />
                      </div>

                      <label className={styles.uploadBtn}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileChange(
                              e.currentTarget.files?.[0] ?? null,
                              setFieldValue
                            )
                          }
                        />
                        Завантажити фото
                      </label>
                      <ErrorMessage
                        name="cover"
                        component="p"
                        className={styles.err}
                      />
                    </div>
                  </div>
                  {/* Заголовок */}
                  <label className={styles.field}>
                    <span className={styles.label}>Заголовок</span>
                    <Field
                      name="title"
                      maxLength={100}
                      placeholder="Введіть заголовок історії"
                    />
                    <ErrorMessage
                      name="title"
                      component="p"
                      className={styles.err}
                    />
                  </label>

                  {/* Категорія */}
                  <label className={styles.field}>
                    <span className={styles.label}>Категорія</span>
                    <Field
                      as="select"
                      name="category"
                      className={`${styles.select} ${values.category === '' ? styles.placeholder : ''}`}
                    >
                      <option value="" disabled>
                        Категорія
                      </option>
                      {categories?.map((c: Category) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="category"
                      component="p"
                      className={styles.err}
                    />
                  </label>

                  <label className={styles.field}>
                    <span className={styles.label}>Текст історії</span>
                    <Field
                      as="textarea"
                      name="description"
                      rows={8}
                      placeholder="Ваша  історія тут"
                    />
                    <ErrorMessage
                      name="description"
                      component="p"
                      className={styles.err}
                    />
                  </label>
                </div>
                {/* Кнопки */}
                <div className={styles.actions}>
                  <button
                    type="submit"
                    className={styles.primary}
                    disabled={
                      !isValid || !dirty || isSubmitting || mutation.isPending
                    }
                    aria-busy={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader /> <span className="sr-only">Збереження…</span>
                      </>
                    ) : (
                      'Зберегти'
                    )}
                  </button>
                  <button
                    type="button"
                    className={styles.ghost}
                    onClick={() => router.back()}
                  >
                    Відмінити
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </section>

      {/* Модалка підтвердження помилки */}
      <ConfirmModal
        isOpen={errorOpen}
        title="Помилка під час збереження"
        description="Щоб зберегти статтю вам треба увійти, якщо ще немає облікового запису — зареєструйтесь."
        cancelText="Увійти"
        confirmText="Зареєструватись"
        onClose={() => setErrorOpen(false)} // бекдроп/ESC — просто закрити
        onCancel={() => {
          setErrorOpen(false);
          router.push('/auth/login');
        }} // Ліва кнопка
        onConfirm={() => {
          setErrorOpen(false);
          router.push('/auth/register');
        }} // Права кнопка
      />

      {/* Модалка успішної публікації —*/}

      <ConfirmModal
        variant="success"
        isOpen={publishedOpen}
        title="Історію опубліковано"
        description="Все готово! Можете переглянути публікацію або повернутись на головну."
        cancelText="На головну"
        confirmText="До історії"
        onClose={() => setPublishedOpen(false)}
        onCancel={() => {
          setPublishedOpen(false);
          router.push('/');
        }}
        onConfirm={() => {
          setPublishedOpen(false);
          if (createdId) {
            router.push(`/stories/${createdId}`);
          }
        }}
      />
    </>
  );
}
