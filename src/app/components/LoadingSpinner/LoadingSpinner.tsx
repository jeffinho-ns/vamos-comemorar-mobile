// components/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Container para as barras de onda sonora */}
      <div className="flex items-end h-24 w-24 justify-between space-x-2 border border-red-500"> {/* Borda vermelha para depuração */}
        {/* Barra 1 - Cor mais clara */}
        <div className="w-4 h-10 bg-lime-400 rounded-full animate-wave-pulse-1"></div> {/* Adicionei h-10 */}
        {/* Barra 2 - Cor mais clara */}
        <div className="w-4 h-10 bg-cyan-400 rounded-full animate-wave-pulse-2"></div> {/* Adicionei h-10 */}
        {/* Barra 3 - Cor mais clara */}
        <div className="w-4 h-10 bg-amber-400 rounded-full animate-wave-pulse-3"></div> {/* Adicionei h-10 */}
      </div>
      <p className="mt-4 text-lg text-white">Carregando eventos...</p>
    </div>
  );
};

export default LoadingSpinner;