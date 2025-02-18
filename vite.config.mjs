import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';

export default defineConfig(() => {
  return {
    define: {
      'process.env': {
        VITE_APP_VERSION: process.env.VITE_APP_VERSION,
        GENERATE_SOURCEMAP: process.env.GENERATE_SOURCEMAP,
        PUBLIC_URL: process.env.PUBLIC_URL,
        VITE_APP_BASE_NAME: process.env.VITE_APP_BASE_NAME,
        VITE_APP_API_URL: process.env.VITE_APP_API_URL,
        VITE_APP_AWS_POOL_ID: process.env.VITE_APP_AWS_POOL_ID,
        VITE_APP_AWS_APP_CLIENT_ID: process.env.VITE_APP_AWS_APP_CLIENT_ID,
        VITE_STRIPE_PUBLISHABLE_KEY: process.env.VITE_STRIPE_PUBLISHABLE_KEY
      }
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
    base: process.env.VITE_APP_BASE_NAME,
    plugins: [react(), jsconfigPaths()]
  };
});
