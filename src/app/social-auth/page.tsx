"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SocialAuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Pega o token e userId da query string
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userId = urlParams.get("userId");

    if (token && userId) {
      // Salva no localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", userId);

      // Redireciona para home ou dashboard
      router.replace("/");
    } else {
      // Caso não tenha token, redireciona para login
      router.replace("/login");
    }
  }, [router]);

  return <p>Autenticando...</p>;
}
