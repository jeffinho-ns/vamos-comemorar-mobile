// components/LoadingSpinner.tsx
import React from 'react';
import Image from 'next/image'; // Importe o componente Image do Next.js

const LoadingSpinner: React.FC = () => {
  return (
    // Este é o container central que alinha o conteúdo
    <div className="flex flex-col items-center justify-center">
      {/* Imagem do GIF */}
      <Image
        src="/intro/loading.mp4" // <--- Altere para o caminho do seu GIF na pasta `public`
        alt="Carregando..."
        width={150} // Ajuste a largura conforme o tamanho do seu GIF
        height={150} // Ajuste a altura conforme o tamanho do seu GIF
        unoptimized // Essencial para GIFs para evitar otimizações que podem quebrar a animação
        className="mb-4" // Margem inferior para separar do texto
      />
      <p className="mt-4 text-lg text-white">Carregando eventos...</p>
    </div>
  );
};

export default LoadingSpinner;