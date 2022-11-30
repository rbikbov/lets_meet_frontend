<script setup lang="ts">
import { AppRouteNames } from '@/router';
import { api } from '@/services';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { VProgressCircular } from 'vuetify/components';

const props = defineProps<{ confirmationCode: string }>();

const router = useRouter();

const title = 'Email confirmation.';
const secondsToRedirect = ref(10);
const redirectMessage = computed(
  () => `Seconds to redirect: ${secondsToRedirect.value}`
);
const message = ref('');

const redirectTimeUpdate = (): Promise<void> => {
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      secondsToRedirect.value--;
      if (!secondsToRedirect.value) {
        clearInterval(intervalId);
        resolve();
      }
    }, 1000);
  });
};

const authSignupConfimationInProcess = ref(false);
onMounted(async () => {
  authSignupConfimationInProcess.value = true;
  try {
    const result = await api.api.v1UsersIdConfirmAccountList(
      props.confirmationCode
    );
    message.value = result.data.message;
    authSignupConfimationInProcess.value = false;
    await redirectTimeUpdate();
    router.push({
      name: AppRouteNames.authSignin,
      replace: true,
    });
  } catch (e) {
    console.warn(e);
  } finally {
    authSignupConfimationInProcess.value = false;
  }
});
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <div>
      <v-progress-circular
        v-if="authSignupConfimationInProcess"
        indeterminate
      ></v-progress-circular>
      <template v-else>
        <p>{{ message }}</p>
        <p>{{ redirectMessage }}</p>
      </template>
    </div>
  </div>
</template>

<style></style>
