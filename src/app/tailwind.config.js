// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'wave-pulse': { // Novo keyframe para a animação de onda
          '0%, 100%': { height: '25%' }, // Inicia e termina baixo
          '50%': { height: '100%' },   // Atinge o pico no meio
        },
      },
      animation: {
        // Novas animações para as barras, com atrasos diferentes
        'wave-pulse-1': 'wave-pulse 1.2s ease-in-out infinite',
        'wave-pulse-2': 'wave-pulse 1.2s ease-in-out infinite 0.2s', // Atraso de 0.2s
        'wave-pulse-3': 'wave-pulse 1.2s ease-in-out infinite 0.4s', // Atraso de 0.4s
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}