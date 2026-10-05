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
              // Strip any single or repeated /BD-Launch-site- prefix
              let cleanUrl = req.url.split('?')[0];
              while (cleanUrl.startsWith('/BD-Launch-site-')) {
                cleanUrl = cleanUrl.slice('/BD-Launch-site-'.length);
                if (!cleanUrl.startsWith('/')) cleanUrl = '/' + cleanUrl;
              }

              if (
                cleanUrl.startsWith('/images/') ||
                cleanUrl.startsWith('/videos/') ||
                cleanUrl.startsWith('/firefly.png') ||
                cleanUrl.startsWith('/logo.png')
              ) {
                const filePath = path.join(__dirname, 'public', cleanUrl);
                if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                  const ext = path.extname(filePath).toLowerCase();
                  const mimeTypes: Record<string, string> = {
                    '.png': 'image/png',
                    '.jpg': 'image/jpeg',
                    '.jpeg': 'image/jpeg',
                    '.webp': 'image/webp',
                    '.svg': 'image/svg+xml',
                    '.mp4': 'video/mp4',
                  };
                  res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
                  fs.createReadStream(filePath).pipe(res);
                  return;
                }
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
