// src/app/components/intro/intro.tsx
"use client";

import React, { useEffect, useState } from "react";

export default function Intro({ onFinish }: { onFinish: () => void }) {
  const [videoEnded, setVideoEnded] = useState(false);

  // Manipulador para o evento onEnded do vídeo
  const handleVideoEnded = () => {
    setVideoEnded(true);
    // Chama onFinish APENAS depois que o vídeo realmente terminou.
    // Isso garante que a transição para a Home só ocorra APÓS a reprodução completa.
    onFinish();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <video
        src="/intro/intro-v.mp4" // Caminho correto para o vídeo na pasta /public
        autoPlay
        muted // Essencial para autoplay funcionar em muitos navegadores móveis
        playsInline // Essencial para reprodução no fluxo da página em muitos navegadores móveis
        onEnded={handleVideoEnded} // O principal gatilho
        onError={(e) => console.error("Erro ao carregar/reproduzir vídeo:", e)} // Ajuda a depurar problemas de carregamento
        className="w-full h-full object-cover"
      >
        Seu navegador não suporta a tag de vídeo.
      </video>
    </div>
  );
}