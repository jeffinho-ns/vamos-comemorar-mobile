// src/app/components/intro/intro.tsx
"use client";

import React, { useEffect } from "react";

export default function Intro({ onFinish }: { onFinish: () => void }) {
  // Defina a duração do GIF em milissegundos (ex: 3 segundos = 3000ms)
  const gifDuration = 3000;

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, gifDuration);

    return () => clearTimeout(timer); // Limpa o timer se o componente desmontar antes do fim
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <img
        src="/intro/logo-01.gif" // Caminho para o GIF na pasta /public/intro
        alt="Intro animation"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
