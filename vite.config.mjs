import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig(() => {
  return {
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
    base: process.env.VITE_APP_BASE_NAME,
    plugins: [react(), jsconfigPaths()]
  };
});
