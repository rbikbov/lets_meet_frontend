<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { AppRouteNames } from '@/router';
import { useAuthStore } from '@/stores/auth';

import UserCreateForm from '@/components/AccountProfileEditForm.vue';
import type { ProfileDataUser } from '@/services/api';

const router = useRouter();
const { fetchUserInfo, updateUserInfo } = useAuthStore();
const { user } = storeToRefs(useAuthStore());

onMounted(async () => {
  try {
    await fetchUserInfo();
  } catch (error) {
    console.warn(error);
  }
});

const userUpdateFormIsLoading = ref(false);
const onAccountProfileEditFormSubmit = async (profile: ProfileDataUser) => {
  userUpdateFormIsLoading.value = true;
  try {
    await updateUserInfo(profile);
    router.push({
      name: AppRouteNames.home,
    });
  } catch (e) {
    console.error({ e });
  } finally {
    userUpdateFormIsLoading.value = false;
  }
};

const onAccountProfileEditFormCancel = () => {
  router.push({ name: AppRouteNames.home });
};
</script>

<template>
  <UserCreateForm
    :loading="userUpdateFormIsLoading"
    :user="user || {}"
    @submit="onAccountProfileEditFormSubmit"
    @cancel="onAccountProfileEditFormCancel"
  />
</template>

<style></style>
