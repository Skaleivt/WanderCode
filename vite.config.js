import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: `${NEXT_PUBLIC_API_URL}`,
  },
});
