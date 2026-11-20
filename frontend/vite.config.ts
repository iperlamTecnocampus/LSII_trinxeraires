import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendTarget = env.VITE_API_DOMAIN || 'http://localhost:8080';
  const backendProxy = { target: backendTarget, changeOrigin: true };

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': backendProxy,
        '/oauth2': backendProxy,
        '/login/oauth2': backendProxy,
      },
    },
  };
});
