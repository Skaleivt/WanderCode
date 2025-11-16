"use client";
import { ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import styles from "./AuthForm.module.css";

interface AuthFormWrapperProps {
  initialForm: "login" | "register";
  loginForm: ReactNode;
  registerForm: ReactNode;
}

export default function AuthFormWrapper({
  initialForm,
  loginForm,
  registerForm,
}: AuthFormWrapperProps) {
  const [currentForm, setCurrentForm] = useState(initialForm);
  const router = useRouter();

  useEffect(() => {
    setCurrentForm(initialForm);
  }, [initialForm]);

  const toggleForm = () => {
    const nextForm = currentForm === "login" ? "register" : "login";
    setCurrentForm(nextForm);
    router.push(`/auth/${nextForm}`);
  };

  const variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.08 } },
    exit: {
      opacity: 0,
      x: -50,
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentForm}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={variants}
      >
        <motion.div variants={fieldVariants}>
          {currentForm === "login" ? loginForm : registerForm}
        </motion.div>

        <motion.div variants={fieldVariants} className={styles.toggleContainer}>
          <div className={styles.toggleLink} onClick={toggleForm}>
            {currentForm === "login"
              ? "Ще немає акаунту? Зареєструватися"
              : "Вже є акаунт? Увійти"}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
