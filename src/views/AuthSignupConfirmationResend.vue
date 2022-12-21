<script setup lang="ts">
import { useRouter } from 'vue-router';

import { AppRouteNames } from '@/router';
import { useMutation } from '@tanstack/vue-query';
import { signUpConfirmationEmailResend } from '@/services/auth';
import type { V1UsersResendConfirmationCreatePayload } from '@/services/api';

import AuthSignupConfirmationResendForm from '@/components/AuthSignupConfirmationResendForm.vue';

const router = useRouter();

const signupConfirmationResendMutation = useMutation(
  (data: V1UsersResendConfirmationCreatePayload) =>
    signUpConfirmationEmailResend(data),
  {
    onSuccess: async () => {
      router.push({
        name: AppRouteNames.authSignin,
      });
    },
  }
);

const onSignupConfirmationFormSubmit = (
  data: V1UsersResendConfirmationCreatePayload
) => {
  signupConfirmationResendMutation.mutate(data);
};
</script>

<template>
  <AuthSignupConfirmationResendForm
    :loading="signupConfirmationResendMutation.isLoading.value"
    @submit="onSignupConfirmationFormSubmit"
  />
</template>

<style></style>
