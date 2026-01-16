import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  
  build: {
    outDir: 'dist',
    
    rollupOptions: {
      input: './index.html'
    }
  },
  
  server: {
    open: true,
  },
  base: './',
});