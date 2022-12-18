<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import type { AxiosProgressEvent } from 'axios';

import { AppRouteNames } from '@/router';
import { useAuthStore } from '@/stores/auth';
import type { ProfileDataUser, User } from '@/services/api';
import { AUTH_USER } from '@/services/queries/keys';
import { fetchMe, updateUserAvatar, updateUserInfo } from '@/services/auth';

import AccountProfileEditForm from '@/components/AccountProfileEditForm.vue';
import AccountProfileAvatarInput, {
  AvatarModelValueList,
} from '@/components/AccountProfileAvatarInput.vue';
import BaseAvatarWrapper from '@/components/BaseAvatarWrapper.vue';

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
      // router.push({
      //   name: AppRouteNames.home,
      // });
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

const avatars = ref<AvatarModelValueList>([]);

watch(avatars.value, (newVal) => {
  console.log('avatars', newVal);
});

const onAccountProfileEditFormSubmit = async (profile: ProfileDataUser) => {
  if (JSON.stringify(initialData.value) !== JSON.stringify(profile)) {
    initialData.value = { ...initialData.value, ...profile };
    updateUserInfoMutation.mutate(profile);
  }

  if (avatars.value.length) {
    updateUserAvatarMutation.mutate(avatars.value[0].file);
  }
};

const onAccountProfileEditFormCancel = () => {
  router.push({ name: AppRouteNames.accountProfile });
};

const avatarUploadingProgress = ref(0);
const onAvatarUploadProgress = (progressEvent: AxiosProgressEvent) => {
  avatarUploadingProgress.value = progressEvent.progress
    ? progressEvent.progress * 100
    : 0;
};

const updateUserAvatarMutation = useMutation(
  // mutationKey: [],
  (avatar: File) =>
    updateUserAvatar(jwtPayload.value!.id, avatar, {
      onUploadProgress: onAvatarUploadProgress,
    }),
  {
    onSuccess: (response) => {
      authStore.setAuthUser(response.data);
      avatars.value = [];
      avatarUploadingProgress.value = 0;
      // router.push({
      //   name: AppRouteNames.home,
      // });
    },
  }
);

const isAvatarChanged = computed(() => Boolean(avatars.value.length));
</script>

<template>
  <div>
    <AccountProfileEditForm
      :loading="
        updateUserInfoMutation.isLoading.value || fetchMeQuery.isLoading.value
      "
      :initialData="initialData"
      :isAvatarChanged="isAvatarChanged"
      @submit="onAccountProfileEditFormSubmit"
      @cancel="onAccountProfileEditFormCancel"
    >
      <template #default>
        <v-row class="mb-2">
          <template v-if="avatars.length">
            <v-col
              v-for="img in avatars"
              :key="img.previewUrl"
              class="d-flex child-flex"
              cols="12"
            >
              <v-img
                :src="img.previewUrl"
                aspect-ratio="1"
                cover
                class="bg-grey-lighten-2"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey-lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-col>
          </template>
          <v-col v-else class="d-flex child-flex" cols="12">
            <BaseAvatarWrapper v-slot="{ url }">
              <v-img
                :src="url"
                aspect-ratio="1"
                cover
                class="bg-grey-lighten-2"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular
                      indeterminate
                      color="grey-lighten-5"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </BaseAvatarWrapper>
          </v-col>
        </v-row>

        <AccountProfileAvatarInput
          v-model="avatars"
          :progress="avatarUploadingProgress"
          :loading="updateUserAvatarMutation.isLoading.value"
        />
      </template>
    </AccountProfileEditForm>
  </div>
</template>

<style></style>
