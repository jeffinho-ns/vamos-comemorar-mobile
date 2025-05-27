// src/app/components/intro/intro.tsx
"use client";

import React, { useEffect } from "react";

export default function Intro({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 6000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <video
        src="/intro/intro-v.mp4" // coloque o vídeo em /public/intro/intro-v.mp4
        autoPlay
        muted
        playsInline
        onEnded={onFinish}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
