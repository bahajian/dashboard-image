import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      'process.env': Object.keys(process.env).reduce((acc, key) => {
        if (key.startsWith('VITE_')) {
          acc[key] = process.env[key] || env[key]; // ✅ Remove JSON.stringify to prevent extra quotes
        }
        return acc;
      }, {}),
      global: 'globalThis' // ✅ Fix "global is not defined" error
    },
    server: {
      open: true,
      port: process.env.PORT || 3000,
      host: true
    },
    preview: {
      open: true,
      host: true
    },
    resolve: {
      alias: [
        {
          find: /^~(.+)/,
          replacement: path.join(process.cwd(), 'node_modules/$1')
        },
        {
          find: /^src(.+)/,
          replacement: path.join(process.cwd(), 'src/$1')
        }
      ]
    },
    base: process.env.VITE_APP_BASE_NAME || env.VITE_APP_BASE_NAME,
    plugins: [react(), jsconfigPaths()]
  };
});
