<script setup lang="ts">
// @ts-nocheck
import { useMutation } from '@tanstack/vue-query';

import { useRightDrawerRoutingStore } from '@/stores/rightDrawerRouting';
import { useAuthStore } from '@/stores/auth';
import { useSnackbarsStore } from '@/stores/snackbars';
import type { OpenSessionPayload, SigninRequestDataUser } from '@/services/api';
import { signIn } from '@/services/auth';

import AuthSigninForm from '@/components/AuthSigninForm.vue';

const authStore = useAuthStore();
const rightDrawerStore = useRightDrawerRoutingStore();

const { pushSnackbar } = useSnackbarsStore();

const authSigninMutation = useMutation(
  // mutationKey: [],
  (credentials: SigninRequestDataUser) => signIn(credentials),
  {
    onError: (error) => {
      if (!error) {
        return;
      }

      let title: string = '';
      let text: string = '';

      if (error.name === 'AxiosError') {
        // const text = JSON.stringify(error);
        title = String(error.response.status);
        text = error.response.data.error;
      }

      pushSnackbar({ title, text });
      // if (Array.isArray((error as any).response.data.error)) {
      //   (error as any).response.data.error.forEach((el: any) =>
      //     createToast(el.message, {
      //       position: 'top-right',
      //       type: 'warning',
      //     })
      //   );
      // } else {
      //   createToast((error as any).response.data.message, {
      //     position: 'top-right',
      //     type: 'danger',
      //   });
      // }
    },
    onSuccess: (response) => {
      // createToast('Successfully logged in', {
      //   position: 'top-right',
      // });
      authStore.setTokens({
        accessToken: response.data.token,
        refreshToken: response.data.refresh,
      });
      pushSnackbar({
        title: 'Successfully signin',
        text: `Hello ${
          (JSON.parse(response.config.data) as OpenSessionPayload).user.email
        }`,
        timeout: -1,
      });

      rightDrawerStore.close();
    },
  }
);

const onAuthSigninFormSubmit = async (user: SigninRequestDataUser) => {
  authSigninMutation.mutate({
    email: user.email,
    password: user.password,
  });
};
</script>

<template>
  <AuthSigninForm
    :loading="authSigninMutation.isLoading.value"
    @submit="onAuthSigninFormSubmit"
  />
</template>

<style></style>
