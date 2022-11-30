import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import './assets/main.css';

// Vuetify
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
// import * as components from 'vuetify/components';
// import * as directives from 'vuetify/directives';

const app = createApp(App);

const vuetify = createVuetify({
  // components,
  // directives,
  icons: {
    defaultSet: 'mdi', // This is already the default value - only for display purposes
    sets: {},
  },
});

app.use(vuetify);

app.use(createPinia());
app.use(router);

app.mount('#app');
