<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { AppRouteNames } from '@/router';
import { useMutation } from '@tanstack/vue-query';
import { signUpConfirm } from '@/services/auth';

const props = defineProps<{ confirmationCode: string }>();

const router = useRouter();

const title = 'Email confirmation.';
const secondsToRedirect = ref(10);
const redirectMessage = computed(
  () => `Seconds to redirect: ${secondsToRedirect.value}`
);
const message = ref('');

const redirectTimeoutInProcess = ref(false);
const redirectTimeUpdate = (): Promise<void> => {
  redirectTimeoutInProcess.value = true;
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      secondsToRedirect.value--;
      if (!secondsToRedirect.value) {
        clearInterval(intervalId);
        redirectTimeoutInProcess.value = false;
        resolve();
      }
    }, 1000);
  });
};

const signupConfirmMutation = useMutation(
  (confirmationCode: string) => signUpConfirm(confirmationCode),
  {
    onSuccess: async (response) => {
      message.value = response.data.message;
      await redirectTimeUpdate();
      router.push({
        name: AppRouteNames.authSignin,
        replace: true,
      });
    },
  }
);

onMounted(() => {
  signupConfirmMutation.mutate(props.confirmationCode);
});
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <div>
      <v-progress-circular
        v-if="signupConfirmMutation.isLoading"
        indeterminate
      ></v-progress-circular>
      <template v-if="redirectTimeoutInProcess">
        <p>{{ message }}</p>
        <p>{{ redirectMessage }}</p>
      </template>
    </div>
  </div>
</template>

<style></style>
