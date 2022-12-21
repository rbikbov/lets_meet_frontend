<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { AppRouteNames } from '@/router';
import type { SignupRequestDataUser } from '@/services/api';
import { mungeEmailAddress } from '@/helpers/mungeEmailAddress';

import UserCreateForm from '@/components/AuthSignupForm.vue';
import { signUp } from '@/services/auth';
import { useMutation } from '@tanstack/vue-query';

const router = useRouter();

const email = ref('');

const signUpMutation = useMutation(
  // mutationKey: [],
  (credentials: SignupRequestDataUser) => signUp(credentials),
  {
    onSuccess: () => {
      const mungedEmail = mungeEmailAddress(email.value);
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
  email.value = credentials.email;
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
