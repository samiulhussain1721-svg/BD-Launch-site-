import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
  return {
    base: '/',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'root-static-fallback',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url) {
              // Strip any single or repeated /BD-Launch-site- prefix and let Vite handle static serving with Content-Length & caching
              while (req.url.startsWith('/BD-Launch-site-')) {
                req.url = req.url.slice('/BD-Launch-site-'.length);
                if (!req.url.startsWith('/')) req.url = '/' + req.url;
              }
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
