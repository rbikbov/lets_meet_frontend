<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuery } from '@tanstack/vue-query';

import { useAuthStore } from '@/stores/auth';
import { useDialogsStore } from '@/stores/dialogs';
import { DIALOGS } from '@/services/queries/keys';
import { fetchDialogs } from '@/services/dialogs';
import { AppRouteNames } from '@/router';
import { getFullName } from '@/helpers/fullName';
import type { Dialog } from '@/services/api';

import BaseDefaultAvatarWrapper from '@/components/BaseDefaultAvatarWrapper.vue';
import BaseLoader from '@/components/BaseLoader.vue';

const { dialogs } = storeToRefs(useDialogsStore());
const { setDialogs } = useDialogsStore();

const { authUser, isAuthenticated } = storeToRefs(useAuthStore());
const { dialogIdToInterlocutorUserMap } = storeToRefs(useDialogsStore());

const dialogsQuery = useQuery({
  queryKey: [DIALOGS],
  queryFn: () => fetchDialogs(authUser.value!.id),
  onSuccess: (response) => {
    setDialogs(response.data);
  },
  enabled: isAuthenticated,
});

const isDialogLastMessageFromMe = (dialog: Dialog) => {
  if (!isAuthenticated || !dialog.last_message) {
    return false;
  }

  return dialog.last_message.user_id === authUser.value!.id;
};

const getDialogLastMessagePreview = (dialog: Dialog) => {
  if (!dialog.last_message) {
    return '...';
  }

  const prefix = isDialogLastMessageFromMe(dialog) ? 'You: ' : '';

  return `${prefix}${dialog.last_message.description}`;
};
</script>

<template>
  <v-container fluid>
    <v-btn
      class="mx-auto"
      color="success"
      type="button"
      variant="elevated"
      @click="dialogsQuery.refetch"
    >
      Fetch dialogs
    </v-btn>

    <v-list lines="three">
      <v-list-item
        v-for="dialog in dialogs"
        :key="dialog.id"
        :title="getFullName(dialogIdToInterlocutorUserMap[dialog.id])"
        :subtitle="getDialogLastMessagePreview(dialog)"
        :to="{
          name: AppRouteNames.dialogDetail,
          params: { id: dialog.id },
        }"
      >
        <template v-slot:prepend>
          <BaseDefaultAvatarWrapper
            v-slot="{ url, onError }"
            :avatar-url="dialogIdToInterlocutorUserMap[dialog.id].avatar"
          >
            <v-avatar :size="50">
              <v-img alt="Avatar" cover :src="url" @error="onError">
                <template v-slot:placeholder>
                  <BaseLoader />
                </template>
              </v-img>
            </v-avatar>
          </BaseDefaultAvatarWrapper>
        </template>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<style></style>
