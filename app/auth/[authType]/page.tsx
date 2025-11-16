"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import LoginForm from "../../components/forms/LoginForm";
import RegistrationForm from "../../components/forms/RegistrationForm";
import AuthFormWrapper from "../../components/forms/AuthFormWrapper";

interface AuthPageProps {
  params: { authType: "login" | "register" };
}

export default function AuthPage({ params }: AuthPageProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user"); // наприклад, user токен
    if (storedUser) {
      setIsAuthenticated(true);
      router.replace("/");
    }
  }, [router]);

  if (isAuthenticated) return null;

  return (
    <AuthFormWrapper
      initialForm={params.authType}
      loginForm={<LoginForm />}
      registerForm={<RegistrationForm />}
    />
  );
}
