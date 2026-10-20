import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [react(), tailwindcss()], base: './',
  build: { rollupOptions: { output: { manualChunks: {
    mathTypesetting: ['katex'], animation: ['motion/react'], react: ['react', 'react-dom'],
  } } } },
});
