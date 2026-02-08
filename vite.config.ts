import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 1. Increase the warning limit to 1000 KiB (1MB)
    chunkSizeWarningLimit: 1000,
    
    // 2. Optimization: Split large libraries into their own files
    rollupOptions: {
      output: {
        manualChunks(id) {
          // If the file is in node_modules, put it in the 'vendor' chunk
          if (id.includes('node_modules')) {
            // Further split React core to help with browser caching
            if (id.includes('react')) {
              return 'react-core';
            }
            // Put heavy icons and UI libs in their own chunk
            if (id.includes('lucide') || id.includes('framer-motion')) {
              return 'ui-vendors';
            }
            return 'vendor';
          }
        },
      },
    },
  },
});
