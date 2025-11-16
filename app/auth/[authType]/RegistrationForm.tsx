"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import styles from "./AuthForm.module.css";

interface RegistrationFormProps {
  onToggle?: () => void; // 🔥 додано для Header
}

const RegistrationSchema = Yup.object().shape({
  name: Yup.string().required("Ім’я обов’язкове"),
  email: Yup.string().email("Невірний email").required("Email обов’язковий"),
  password: Yup.string()
    .min(6, "Мінімум 6 символів")
    .required("Пароль обов’язковий"),
});

export default function RegistrationForm({ onToggle }: RegistrationFormProps) {
  return (
    <Formik
      initialValues={{ name: "", email: "", password: "" }}
      validationSchema={RegistrationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await axios.post("/auth/register", values);
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
          <h2>Реєстрація</h2>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Field className={styles.input} name="name" placeholder="Ім’я" />
            <ErrorMessage
              name="name"
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
            transition={{ delay: 0.15 }}
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

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              Зареєструватися
            </button>
          </motion.div>

          {/* 🔥 Це toggle-посилання */}
          {onToggle && (
            <motion.div
              className={styles.toggleLink}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              onClick={onToggle}
            >
              Вже є акаунт? Увійти
            </motion.div>
          )}
        </Form>
      )}
    </Formik>
  );
}
