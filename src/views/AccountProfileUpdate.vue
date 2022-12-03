<script setup lang="ts">
import { ref, watch } from 'vue';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { AppRouteNames } from '@/router';
import { useAuthStore } from '@/stores/auth';

import UserCreateForm from '@/components/AccountProfileEditForm.vue';
import type { ProfileDataUser } from '@/services/api';
import { AUTH_USER } from '@/services/queries/keys';
import { fetchUserInfo, updateUserInfo } from '@/services/auth';

const router = useRouter();
const { jwtPayload, user } = storeToRefs(useAuthStore());

const fetchMe = useQuery({
  queryKey: [AUTH_USER],
  queryFn: () => fetchUserInfo(jwtPayload.value!.id),
});

const updateUserInfoMutation = useMutation(
  (profile: ProfileDataUser) => updateUserInfo(jwtPayload.value!.id, profile),
  {
    onSuccess: (response) => {
      const authStore = useAuthStore();
      authStore.setAuthUser(response.data);
      router.push({
        name: AppRouteNames.home,
      });
    },
  }
);

const currentUserData = ref<ProfileDataUser>({
  first_name: user.value?.first_name,
  last_name: user.value?.last_name,
  age: user.value?.age,
});

const onAccountProfileEditFormSubmit = async (profile: ProfileDataUser) => {
  currentUserData.value = { ...currentUserData.value, ...profile };
  updateUserInfoMutation.mutate(profile);
};

const onAccountProfileEditFormCancel = () => {
  router.push({ name: AppRouteNames.home });
};

watch(user, (value) => value && (currentUserData.value = value));
</script>

<template>
  <UserCreateForm
    :loading="updateUserInfoMutation.isLoading.value || fetchMe.isLoading.value"
    :user="currentUserData"
    @submit="onAccountProfileEditFormSubmit"
    @cancel="onAccountProfileEditFormCancel"
  />
</template>

<style></style>
