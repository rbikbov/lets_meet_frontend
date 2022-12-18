<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useMutation } from '@tanstack/vue-query';

import { AppRouteNames } from '@/router';
import { useAuthStore } from '@/stores/auth';
import type { SigninRequestDataUser } from '@/services/api';

import AuthSigninForm from '@/components/AuthSigninForm.vue';
import { signIn } from '@/services/auth';

const router = useRouter();
const authStore = useAuthStore();

// const createToast = console.log;

const authSigninMutation = useMutation(
  // mutationKey: [],
  (credentials: SigninRequestDataUser) => signIn(credentials),
  {
    // onError: (error) => {
    //   if (Array.isArray((error as any).response.data.error)) {
    //     (error as any).response.data.error.forEach((el: any) =>
    //       createToast(el.message, {
    //         position: 'top-right',
    //         type: 'warning',
    //       })
    //     );
    //   } else {
    //     createToast((error as any).response.data.message, {
    //       position: 'top-right',
    //       type: 'danger',
    //     });
    //   }
    // },
    onSuccess: (response) => {
      // createToast('Successfully logged in', {
      //   position: 'top-right',
      // });
      authStore.setTokens({
        accessToken: response.data.token,
        refreshToken: response.data.refresh,
      });
      router.push({
        name: AppRouteNames.home,
      });
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
