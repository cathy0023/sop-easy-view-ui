import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 将 megaview- 开头的标签视为自定义元素
          isCustomElement: (tag) => tag.startsWith('megaview-')
        }
      }
    })
  ]
});





