import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'MegaviewUI',
      formats: ['es', 'umd', 'iife'],
      fileName: (format) => `megaview-ui.${format}.js`
    },
    rollupOptions: {
      output: {
        // 保持代码可读性
        compact: false
      }
    }
  }
});



