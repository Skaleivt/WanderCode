"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import styles from "./AuthForm.module.css";

interface LoginFormProps {
  onToggle?: () => void;
}
import css from './AuthPage.module.css';
import { AuthorizationRequest, getMe, loginUser } from '@/lib/api/clientApi';

import { useState } from 'react';
import { ApiError } from 'next/dist/server/api-utils';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Невірний email").required("Email обов’язковий"),
  password: Yup.string().required("Пароль обов’язковий"),
});

export default function LoginForm({ onToggle }: LoginFormProps) {
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={LoginSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await axios.post("/auth/login", values);
          window.location.href = "/";
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Щось пішло не так");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          <h2>Вхід</h2>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Field
              className={styles.input}
              name="email"
              placeholder="Email"
              type="email"
            />
            <ErrorMessage
              name="email"
              component="div"
              className={styles.error}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Field
              className={styles.input}
              name="password"
              placeholder="Пароль"
              type="password"
            />
            <ErrorMessage
              name="password"
              component="div"
              className={styles.error}
            />
          </motion.div>
      if (res) {
        const me = await getMe();
        if (me) setUser(me);
        router.push('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError((error as ApiError).message ?? 'Oops... some error');
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Вхід</h1>
      <p className={css.formText}>Вітаємо знову у спільноту мандрівників!</p>
      <form onSubmit={handleSubmit} className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="email">Пошта*</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
            placeholder="hello@podorozhnyky.ua"
          />
        </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              Увійти
            </button>
          </motion.div>

          {/* Toggle посилання для переходу до реєстрації */}
          {onToggle && (
            <motion.div
              className={styles.toggleLink}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={onToggle}
            >
              Ще немає акаунту? Зареєструватися
            </motion.div>
          )}
        </Form>
      )}
    </Formik>
  );
}
