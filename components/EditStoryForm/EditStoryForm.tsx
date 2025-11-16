'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Formik, Form, Field, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import ConfirmModal from '@/components/Modal/ConfirmModal';
import Loader from '@/components/Loader/Loader';
import { showErrorToast } from '@/components/ShowErrorToast/ShowErrorToast';

import { nextServer } from '@/lib/api/api';
import styles from './EditStoryForm.module.css';

// ===== Типи з бекенду =====
type StoryFromApi = {
  title: string;
  category: string;
  shortDesc?: string;
  body: string;
  coverUrl?: string;
};

type Category = {
  _id: string;
  value: string;
  label: string;
};


// ----- ShortDesc counter -----
const ShortDescCounter = () => {
  const [field] = useField<string>('shortDesc');
  const left = 61 - (field.value?.length ?? 0);
  return <div className={styles.helper}>Лишилось символів: {left}</div>;
};

// ----- Yup schema -----
const schema = Yup.object({
  cover: Yup.mixed<File>()
    .nullable()
    .test('fileType', 'Підтримуються тільки зображення', f =>
      f ? /^image\//.test(f.type) : true
    ),
  title: Yup.string().trim().min(3).max(100).required('Обовʼязково'),
  category: Yup.string().required('Оберіть категорію'),
  body: Yup.string().trim().min(30).required('Обовʼязково'),
});

// ===== API =====

async function fetchStory(id: string): Promise<StoryFromApi> {
  const res = await nextServer.get(`/stories/${id}`);
  return res.data.data;
}

async function fetchCategories(): Promise<Category[]> {
  const res = await nextServer.get('/categories');
  return res.data.data;
}

async function updateStory(id: string, fd: FormData) {
  const res = await nextServer.patch(`/stories/${id}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

// ===== COMPONENT =====

export default function EditStoryForm({ storyId }: { storyId: string }) {
  const router = useRouter();
  const qc = useQueryClient();

  const [preview, setPreview] = useState<string | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const imgSizes = useMemo(
    () => '(max-width: 768px) 100vw, 865px',
    []
  );

  // === GET story ===
  const { data: story, isLoading: loadingStory } = useQuery<StoryFromApi>({
    queryKey: ['story', storyId],
    queryFn: () => fetchStory(storyId),
  });

  // === GET categories ===
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // === PATCH ===
  const mutation = useMutation({
    mutationFn: (fd: FormData) => updateStory(storyId, fd),
    onSuccess: async () => {
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

  if (loadingStory) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Loader />
      </div>
    );
  }

  if (!story) return <p>Історію не знайдено</p>;

  const initialValues = {
    cover: null as File | null,
    title: story.title,
    category: story.category,
    shortDesc: story.shortDesc || '',
    body: story.body,
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
            onSubmit={async (values, helpers) => {
              const fd = new FormData();
              fd.append('title', values.title);
              fd.append('category', values.category);
              fd.append('shortDesc', values.shortDesc ?? '');
              fd.append('body', values.body);

              if (values.cover) {
                fd.append('cover', values.cover);
              }

              try {
                await mutation.mutateAsync(fd);
              } finally {
                helpers.setSubmitting(false);
              }
            }}
          >
            {({ setFieldValue, isValid, dirty, isSubmitting }) => (
              <Form className={styles.form}>
                {/* COVER */}
                <div className={styles.field}>
                  <span className={styles.labelTitle}>Обкладинка статті</span>

                  <div className={styles.coverBox}>
                    <div className={styles.coverImage}>
                      <Image
                        src={preview || story.coverUrl || '/file.svg'}
                        alt="Обкладинка"
                        fill
                        sizes={imgSizes}
                      />
                    </div>

                    <label className={styles.uploadBtn}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.currentTarget.files?.[0] ?? null;
                          setFieldValue('cover', file);

                          if (file) {
                            const url = URL.createObjectURL(file);
                            setPreview(url);
                          } else {
                            setPreview(null);
                          }
                        }}
                      />
                      Завантажити фото
                    </label>
                    <ErrorMessage name="cover" component="p" className={styles.err} />
                  </div>
                </div>

                {/* TITLE */}
                <label className={styles.field}>
                  <span className={styles.label}>Заголовок</span>
                  <Field name="title" />
                  <ErrorMessage name="title" component="p" className={styles.err} />
                </label>

                {/* CATEGORY */}
                <label className={styles.field}>
                  <span className={styles.label}>Категорія</span>
                  <Field as="select" name="category" className={styles.select}>
                    <option value="" disabled>
                      Оберіть категорію
                    </option>

                    {categories?.map((c) => (
                      <option key={c._id} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="category" component="p" className={styles.err} />
                </label>

                {/* SHORT DESC */}
                <div className={`${styles.field} ${styles.shortOnly}`}>
                  <label className={styles.label}>Короткий опис</label>
                  <Field
                    as="textarea"
                    name="shortDesc"
                    rows={3}
                    className={styles.summaryArea}
                  />
                  <ShortDescCounter />
                </div>

                {/* BODY */}
                <label className={styles.field}>
                  <span className={styles.label}>Текст історії</span>
                  <Field as="textarea" name="body" rows={8} />
                  <ErrorMessage name="body" component="p" className={styles.err} />
                </label>

                {/* ACTIONS */}
                <div className={styles.actions}>
                  <button
                    type="submit"
                    className={styles.primary}
                    disabled={
                      !isValid || !dirty || isSubmitting || mutation.isPending
                    }
                  >
                    {mutation.isPending ? <Loader /> : 'Оновити'}
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

      {/* ERROR MODAL */}
      <ConfirmModal
        isOpen={errorOpen}
        title="Помилка"
        description="Не вдалося оновити історію."
        confirmText="Закрити"
        cancelText=""
        onClose={() => setErrorOpen(false)}
        onConfirm={() => setErrorOpen(false)}
        onCancel={() => setErrorOpen(false)}
      />

      {/* SUCCESS MODAL */}
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