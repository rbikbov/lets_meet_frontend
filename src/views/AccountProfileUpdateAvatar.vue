<script setup lang="ts">
import { ref } from 'vue';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import type { AxiosProgressEvent } from 'axios';

import { AppRouteNames } from '@/router';
import { useAuthStore } from '@/stores/auth';
import { AUTH_USER } from '@/services/queries/keys';
import { fetchMe, updateUserAvatar } from '@/services/auth';

import AccountProfileUpdateAvatarForm from '@/components/AccountProfileUpdateAvatarForm.vue';
import type { AvatarFile } from '@/services/api';

const router = useRouter();
const authStore = useAuthStore();
const { jwtPayload } = storeToRefs(useAuthStore());

const fetchMeQuery = useQuery({
  queryKey: [AUTH_USER],
  queryFn: () => fetchMe(),
});

const accountProfileUpdateAvatarForm = ref<
  typeof AccountProfileUpdateAvatarForm | null
>();

const avatarUploadingProgress = ref(0);
const onAvatarUploadProgress = (progressEvent: AxiosProgressEvent) => {
  avatarUploadingProgress.value = progressEvent.progress
    ? progressEvent.progress * 100
    : 0;
};

const updateUserAvatarMutation = useMutation(
  // mutationKey: [],
  (data: AvatarFile) =>
    updateUserAvatar(jwtPayload.value!.id, data, {
      onUploadProgress: onAvatarUploadProgress,
    }),
  {
    onSuccess: (response) => {
      authStore.setAuthUser(response.data);
      accountProfileUpdateAvatarForm.value?.clearAvatars();
      // accountProfileUpdateAvatarForm.value?.methods?.clearAvatars();
      avatarUploadingProgress.value = 0;
      router.push({
        name: AppRouteNames.accountProfile,
      });
    },
  }
);

const onAccountProfileUpdateAvatarFormSubmit = async (data: AvatarFile) => {
  updateUserAvatarMutation.mutate(data);
};

const onAccountProfileUpdateAvatarFormCancel = () => {
  router.push({ name: AppRouteNames.accountProfile });
};
</script>

<template>
  <AccountProfileUpdateAvatarForm
    ref="accountProfileUpdateAvatarForm"
    :loading="
      updateUserAvatarMutation.isLoading.value || fetchMeQuery.isLoading.value
    "
    :avatarUploadingProgress="avatarUploadingProgress"
    @submit="onAccountProfileUpdateAvatarFormSubmit"
    @cancel="onAccountProfileUpdateAvatarFormCancel"
  >
  </AccountProfileUpdateAvatarForm>
</template>

<style></style>
