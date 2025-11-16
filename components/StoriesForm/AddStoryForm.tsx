
'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, FormikHelpers, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import {showErrorToast} from '@/components/ShowErrorToast/ShowErrorToast';
import Loader from '@/components/Loader/Loader';
import styles from './AddStoryForm.module.css';
import { useField } from 'formik'; 
// ---- Лічильник символів для короткого опису
const ShortDescLiveCounter = () => {
  const [field] = useField<string>('shortDesc');  
  const left = 61 - (field.value?.length ?? 0);
  return (
    <div className={styles.helper}>
      Лишилось символів: {Math.max(0, left)}
    </div>
  );
};

// ---- Типи форми
export interface AddStoryFormValues {
  cover: File | null;
  title: string;
  category: string;
  shortDesc?: string; 
  body: string;
}

// ---- Категорії (підстав свої, якщо є у constants)
const CATEGORIES = [
  { value: 'Поради', label: 'Поради' },
  { value: 'Маршрути', label: 'Маршрути' },
  { value: 'Лайфхаки', label: 'Лайфхаки' },
  { value: 'Інше', label: 'Інше' },
];

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
  category: Yup.string()
    .oneOf(CATEGORIES.map((c) => c.value),'оберіть категорію')
    .required('Обовʼязково'),
  body: Yup.string().trim().min(30, 'мін. 30 символів').required('Обовʼязково'),
});

// ---- Початкові значення
const initialValues: AddStoryFormValues = {
  cover: null,
  title: '',
  category: '',
shortDesc: '',
  body: '',
};


// ---- API-клієнт
async function createStory(values: AddStoryFormValues): Promise<{ id: string }> {
  const form = new FormData();
  if (values.cover) form.append('cover', values.cover);
  form.append('title', values.title);
  form.append('category', values.category);
  form.append('body', values.body);
  form.append('shortDesc', values.shortDesc ?? '');
  const res = await fetch('/api/stories', { method: 'POST', body: form });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || 'Помилка створення історії');
  }
  return res.json();
}

export default function AddStoryForm() {
  const router = useRouter();
  const qc = useQueryClient();
  const [preview, setPreview] = useState<string | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [publishedOpen, setPublishedOpen] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const mutation = useMutation<{ id: string }, Error, AddStoryFormValues>({
    mutationFn: createStory,
    onSuccess: async (data) => {
        await qc.invalidateQueries({ queryKey: ['profile', 'my-stories'] });
        setCreatedId(data.id);        // зберігаємо ID нової історії
        setPublishedOpen(true);       // відкриваємо модалку успіху
    },
    onError: (err) => {
      showErrorToast(err.message || 'Не вдалося зберегти історію');
      setErrorOpen(true);
    },
  });

  const handleFileChange = (
    file: File | null,
    setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => void
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
  ) => { try{
    await mutation.mutateAsync(values);
  }finally{
    helpers.setSubmitting(false);
  }
  };

  // Мемо для розміру зображення в залежності від ширини (за бажанням)
  const imgSizes = useMemo(
    () => '(max-width: 768px) 100vw, 865px',
    []
  );

  return (
    <>
      <section className={styles.wrap}>
 <div className={styles.inner}>
        <h2 className={styles.title}>Створити нову історію</h2>

        <Formik initialValues={initialValues} validationSchema={schema} onSubmit={onSubmit}>
          {({ setFieldValue, isValid, dirty, isSubmitting, values}) => (
       
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
                      handleFileChange(e.currentTarget.files?.[0] ?? null, setFieldValue)
                    }
                  />
                  Завантажити фото
                </label>
                <ErrorMessage name="cover" component="p" className={styles.err} />
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
                <ErrorMessage name="title" component="p" className={styles.err} />
              </label>

              {/* Категорія */}
              <label className={styles.field}>
                <span className={styles.label}>Категорія</span>
                <Field as="select" name="category"  className={`${styles.select} ${values.category === '' ? styles.placeholder : ''}`}>
                 <option value="" disabled>Категорія</option> 
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="category" component="p" className={styles.err} />
              </label>
     {/* Короткий опис — показуємо ТІЛЬКИ на моб/планшеті */}
      <div className={`${styles.field} ${styles.shortOnly}`}>
  <label className={styles.label} 
  >Короткий опис</label>
  <Field
    as="textarea"
    id="shortDesc"
    name="shortDesc"
    rows={3}
    maxLength={61}                             
    placeholder="Введіть короткий опис історії"
    className={styles.summaryArea}
  />
  <ErrorMessage name="shortDesc" component="p" className={styles.err} />
 
  <ShortDescLiveCounter />
 
              </div>
              {/* Текст */}
              <label className={styles.field}>
                <span className={styles.label}>Текст історії</span>
                <Field  as="textarea" name="body" rows={8} placeholder="Ваша  історія тут" />
                <ErrorMessage name="body" component="p" className={styles.err} />
              </label>
            </div>
              {/* Кнопки */}
              <div className={styles.actions}>
                <button
                  type="submit"
                  className={styles.primary}
                  disabled={!isValid || !dirty || isSubmitting || mutation.isPending}
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
                <button type="button" className={styles.ghost} onClick={() => router.back()}>
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
  onClose={() => setErrorOpen(false)}                 // бекдроп/ESC — просто закрити
  onCancel={() => { setErrorOpen(false); router.push('/login'); }}   // Ліва кнопка
  onConfirm={() => { setErrorOpen(false); router.push('/register'); }} // Права кнопка
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
{/* Модалка виходу — поки що не використовується */}

{/* <ConfirmModal
  variant="confirm"
  isOpen={logoutOpen}
  title="Ви точно хочете вийти?"
  description="Ми будемо сумувати за вами!"
  cancelText="Відмінити"
  confirmText="Вийти"
  onClose={() => setLogoutOpen(false)}
  onCancel={() => setLogoutOpen(false)}
  onConfirm={() => { setLogoutOpen(false); doLogout(); }}
/> */}
    </>
      );
}