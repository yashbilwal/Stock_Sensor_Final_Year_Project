import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    // Define environment variables at build time
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://stock-sensor-backend.onrender.com/api'),
  },
});
