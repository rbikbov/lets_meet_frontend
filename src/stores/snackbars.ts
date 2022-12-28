import { ref } from 'vue';
import { defineStore } from 'pinia';

const generateSnackbarId = (index: number) => `${Date.now()}:${index}`;

interface SnackbarData {
  title: string;
  text: string;
  timeout?: number;
}

interface Snackbar extends SnackbarData {
  id: ReturnType<typeof generateSnackbarId>;
  shown: boolean;
};

export const useSnackbarsStore = defineStore('snackbars', () => {
  const snackbars = ref<Snackbar[]>([]);

  function pushSnackbar(snackbarData: SnackbarData) {
    const newSnackbar = {
      timeout: 5000, // Use -1 to keep open indefinitely
      ...snackbarData,
      id: generateSnackbarId(snackbars.value.length),
      shown: true,
    };
    snackbars.value.push(newSnackbar);
    return newSnackbar;
  }

  function closeSnackbar(snackbar: Snackbar) {
    snackbar.shown = false;
  }

  function removeSnackbar(snackbar: Snackbar) {
    snackbars.value = snackbars.value.filter((s) => s !== snackbar);
  }

  return {
    snackbars,
    pushSnackbar,
    closeSnackbar,
    removeSnackbar,
  };
});
