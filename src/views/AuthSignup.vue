<script setup lang="ts">
import { useRouter } from 'vue-router';

import { AppRouteNames } from '@/router';
import type { SignupRequestDataUser } from '@/services/api';
import { mungeEmailAddress } from '@/helpers/mungeEmailAddress';

import UserCreateForm from '@/components/AuthSignupForm.vue';
import { signUp } from '@/services/auth';
import { useMutation } from '@tanstack/vue-query';

const router = useRouter();

const signUpMutation = useMutation(
  // mutationKey: [],
  (credentials: SignupRequestDataUser) => signUp(credentials),
  {
    onSuccess: (response) => {
      const mungedEmail = mungeEmailAddress(response.data.user.email!);
      router.push({
        name: AppRouteNames.authSignupThanks,
        query: {
          email: mungedEmail,
        },
      });
    },
  }
);

const onUserCreateFormSubmit = (credentials: SignupRequestDataUser) => {
  signUpMutation.mutate(credentials);
};
</script>

<template>
  <UserCreateForm
    :loading="signUpMutation.isLoading.value"
    @submit="onUserCreateFormSubmit"
  />
</template>

<style></style>
