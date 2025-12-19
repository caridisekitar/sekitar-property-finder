import path from 'path';
import { defineConfig, loadEnv } from 'vite';
// import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [tailwindcss()],
      define: {
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.API_URL': JSON.stringify(env.API_URL),
        'process.env.API_KEY': JSON.stringify(env.API_KEY),
        'process.env.API_SECRET': JSON.stringify(env.API_SECRET),
        'process.env.ORIGIN': JSON.stringify(env.ORIGIN)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
