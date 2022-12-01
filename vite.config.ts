import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import analyzer from 'rollup-plugin-analyzer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    analyzer({ summaryOnly: true }),
    vuetify({
      autoImport: true,
      styles: 'sass',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
