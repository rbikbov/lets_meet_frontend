<script setup lang="ts">
import { computed } from 'vue';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import { AppRouteNames } from '@/router';
import { useAuthStore } from '@/stores/auth';
import type { ProfileDataUser, User } from '@/services/api';
import { AUTH_USER } from '@/services/queries/keys';
import { fetchMe, updateUserInfo } from '@/services/auth';

import AccountProfileUpdateInfoForm from '@/components/AccountProfileUpdateInfoForm.vue';

const router = useRouter();
const authStore = useAuthStore();
const { jwtPayload, authUser } = storeToRefs(useAuthStore());

const fetchMeQuery = useQuery({
  queryKey: [AUTH_USER],
  queryFn: () => fetchMe(),
});

const updateUserInfoMutation = useMutation(
  // mutationKey: [],
  (profile: ProfileDataUser) => updateUserInfo(jwtPayload.value!.id, profile),
  {
    onSuccess: (response) => {
      authStore.setAuthUser(response.data);
      router.push({
        name: AppRouteNames.accountProfile,
      });
    },
  }
);

const getEditableFieldsFromInitialData = (
  data: User | null
): ProfileDataUser => {
  return {
    first_name: data?.first_name || '',
    last_name: data?.last_name,
    age: data?.age,
    gender: data?.gender,
  };
};

const initialData = computed<ProfileDataUser>({
  get: () => getEditableFieldsFromInitialData(authUser.value),
  set: (newVal: ProfileDataUser) => {
    (Object.keys(newVal) as Array<keyof Required<ProfileDataUser>>).forEach(
      (key) => {
        // @ts-ignore
        initialData.value[key] = newVal[key];
      }
    );
  },
});

const onAccountProfileUpdateInfoFormSubmit = async (
  profile: ProfileDataUser
) => {
  if (JSON.stringify(initialData.value) !== JSON.stringify(profile)) {
    initialData.value = { ...initialData.value, ...profile };
    updateUserInfoMutation.mutate(profile);
  }
};

const onAccountProfileUpdateInfoFormCancel = () => {
  router.push({ name: AppRouteNames.accountProfile });
};
</script>

<template>
  <AccountProfileUpdateInfoForm
    :loading="
      updateUserInfoMutation.isLoading.value || fetchMeQuery.isLoading.value
    "
    :initialData="initialData"
    @submit="onAccountProfileUpdateInfoFormSubmit"
    @cancel="onAccountProfileUpdateInfoFormCancel"
  />
</template>

<style></style>
