'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Formik, Form, Field, FormikHelpers, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import ConfirmModal from '@/components/Modal/ConfirmModal';
import Loader from '@/components/Loader/Loader';
import { showErrorToast } from '@/components/ShowErrorToast/ShowErrorToast';
import { api } from '@/lib/api/api';

import styles from '@/components/AddStoryForm/EditStoryForm.module.css';

// ---------- Типи ----------
type Category = {
  _id: string;
  value: string;
  label: string;
};

type StoryForEdit = {
  _id: string;
  title: string;
  category: string;
  body: string;
  coverUrl?: string;
};

// ---------- Валідація (майже як при створенні) ----------
const schema = Yup.object({
  cover: Yup.mixed<File>()
    .nullable()
    .test('fileType', 'Підтримуються тільки зображення', (f) =>
      f ? /^image\//.test(f.type) : true
    ),
  title: Yup.string()
    .trim()
    .min(3, 'Мінімум 3 символи')
    .max(100, 'Максимум 100 символів')
    .required('Обовʼязково'),
  category: Yup.string().required('Оберіть категорію'),
  body: Yup.string()
    .trim()
    .min(30, 'Мінімум 30 символів')
    .required('Обовʼязково'),
});

// ---------- API ----------

// 1) Отримати одну історію
async function fetchStory(storyId: string): Promise<StoryForEdit> {
  const res = await api.get(`/stories/${storyId}`);
  const raw = res.data.data;

  return {
    _id: raw._id,
    title: raw.title,
    category: raw.category,
    // підстрахуємося: backend може мати поле article або body
    body: raw.body ?? raw.article ?? '',
    coverUrl: raw.coverUrl ?? raw.img ?? undefined,
  };
}

// 2) Категорії з бекенду
async function fetchCategories(): Promise<Category[]> {
  const res = await api.get('/categories');
  return res.data.data;
}

// 3) Оновити історію (PATCH)
async function patchStory(storyId: string, formData: FormData) {
  const res = await api.patch(`/stories/${storyId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

// ---------- КОМПОНЕНТ ----------

export default function EditStoryForm({ storyId }: { storyId: string }) {
  const router = useRouter();
  const qc = useQueryClient();

  const [preview, setPreview] = useState<string | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  // GET: історія
  const {
    data: story,
    isLoading: loadingStory,
    isError: storyError,
  } = useQuery({
    queryKey: ['story', storyId],
    queryFn: () => fetchStory(storyId),
  });

  // GET: категорії
  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // PATCH: оновлення історії
  const mutation = useMutation({
    mutationFn: (fd: FormData) => patchStory(storyId, fd),
    onSuccess: async () => {
      // інвалідимо:
      await qc.invalidateQueries({ queryKey: ['story', storyId] });
      await qc.invalidateQueries({ queryKey: ['stories'] });
      await qc.invalidateQueries({ queryKey: ['profile', 'my-stories'] });

      setSuccessOpen(true);
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : 'Не вдалося оновити історію';
      showErrorToast(message);
      setErrorOpen(true);
    },
  });

  // Прибираємо objectURL при розмонтуванні
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (loadingStory) {
    return (
      <section className={styles.wrap}>
        <div className={styles.inner}>
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <Loader />
          </div>
        </div>
      </section>
    );
  }

  if (storyError || !story) {
    return (
      <section className={styles.wrap}>
        <div className={styles.inner}>
          <h2 className={styles.title}>Редагувати історію</h2>
          <p>Історію не знайдено.</p>
        </div>
      </section>
    );
  }

  const initialValues = {
    cover: null as File | null,
    title: story.title,
    category: story.category,
    body: story.body,
  };

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

  const onSubmit = async (
    values: typeof initialValues,
    helpers: FormikHelpers<typeof initialValues>
  ) => {
    const fd = new FormData();
    fd.append('title', values.title);
    fd.append('category', values.category);
    fd.append('body', values.body);

    if (values.cover) {
      fd.append('cover', values.cover);
    }

    try {
      await mutation.mutateAsync(fd);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <>
      <section className={styles.wrap}>
        <div className={styles.inner}>
          <h2 className={styles.title}>Редагувати історію</h2>

          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            enableReinitialize
            onSubmit={onSubmit}
          >
            {({ setFieldValue, isValid, isSubmitting, dirty }) => (
              <Form className={styles.form}>
                <div className={styles.content}>
                  {/* Обкладинка */}
                  <div className={styles.field}>
                    <span className={styles.labelTitle}>Обкладинка статті</span>

                    <div className={styles.coverBox}>
                      <div className={styles.coverImage}>
                        <Image
                          src={preview || story.coverUrl || '/file.svg'}
                          alt="Обкладинка статті"
                          fill
                          sizes="(max-width: 768px) 100vw, 865px"
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
                        Завантажити нове фото
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
                      className={styles.select}
                      disabled={loadingCategories}
                    >
                      <option value="" disabled>
                        {loadingCategories
                          ? 'Завантаження…'
                          : 'Оберіть категорію'}
                      </option>

                      {categories?.map((c: Category) => (
                        <option key={c._id} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="category"
                      component="p"
                      className={styles.err}
                    />
                  </label>

                  {/* Текст історії */}
                  <label className={styles.field}>
                    <span className={styles.label}>Текст історії</span>
                    <Field as="textarea" name="body" rows={8} />
                    <ErrorMessage
                      name="body"
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
                        <Loader /> <span className="sr-only">Оновлення…</span>
                      </>
                    ) : (
                      'Оновити'
                    )}
                  </button>

                  <button
                    type="button"
                    className={styles.ghost}
                    onClick={() => router.push(`/stories/${storyId}`)}
                  >
                    Скасувати
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </section>

      {/* Помилка */}
      <ConfirmModal
        isOpen={errorOpen}
        title="Помилка"
        description="Не вдалося оновити історію. Спробуйте ще раз."
        confirmText="Закрити"
        cancelText=""
        onClose={() => setErrorOpen(false)}
        onConfirm={() => setErrorOpen(false)}
        onCancel={() => setErrorOpen(false)}
      />

      {/* Успіх */}
      <ConfirmModal
        isOpen={successOpen}
        variant="success"
        title="Готово!"
        description="Історію успішно оновлено."
        cancelText="Повернутись"
        confirmText="До історії"
        onClose={() => setSuccessOpen(false)}
        onCancel={() => {
          setSuccessOpen(false);
          router.push(`/stories/${storyId}`);
        }}
        onConfirm={() => {
          setSuccessOpen(false);
          router.push(`/stories/${storyId}`);
        }}
      />
    </>
  );
}
