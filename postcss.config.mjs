// postcss.config.mjs
export default {
  plugins: {
    // O erro indica que precisamos usar '@tailwindcss/postcss' como o plugin
    '@tailwindcss/postcss': {},
    autoprefixer: {}, // Autoprefixer como um plugin irmão
  },
};