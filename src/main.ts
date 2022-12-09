import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin, VueQueryPluginOptions } from '@tanstack/vue-query';

import App from './App.vue';
import router from './router';

import './assets/main.css';

// Vuetify
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';

const app = createApp(App);

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi', // This is already the default value - only for display purposes
    sets: {},
  },
});

app.use(vuetify);

app.use(createPinia());

app.use(router);

const vueQueryConfig: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  },
};
app.use(VueQueryPlugin, vueQueryConfig);

app.mount('#app');
