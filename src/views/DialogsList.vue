<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useInfiniteQuery } from '@tanstack/vue-query';

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

const dialogsQuery = useInfiniteQuery({
  queryKey: [DIALOGS],
  queryFn: ({ pageParam }) => {
    return fetchDialogs({
      id: String(authUser.value!.id),
      page: pageParam,
    });
  },
  getNextPageParam: (lastPage, allPages) =>
    lastPage.data.has_next ? lastPage.data.current_page! + 1 : false,
  getPreviousPageParam: (firstPage, allPages) =>
    firstPage.data.has_prev ? firstPage.data.current_page! - 1 : false,
  onSuccess: (responses) => {
    const allDialogs = responses.pages.map((r) => r.data.results).flat();
    setDialogs(allDialogs);
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
    <v-row dense>
      <v-col class="d-flex" cols="12">
        <v-btn
          v-if="!false"
          class="mx-auto"
          type="button"
          variant="elevated"
          icon
          :loading="dialogsQuery.isLoading.value"
          @click="dialogsQuery.refetch"
        >
          <v-icon icon="mdi-refresh"></v-icon>
        </v-btn>
      </v-col>

      <v-col class="d-flex" cols="12">
        <v-list class="flex-grow-1">
          <v-list-item
            v-for="dialog in dialogs"
            :key="dialog.id"
            :title="getFullName(dialogIdToInterlocutorUserMap[dialog.id])"
            :subtitle="getDialogLastMessagePreview(dialog)"
            :to="{
              name: AppRouteNames.dialogDetail,
              params: { id: dialog.id },
            }"
            class="mb-2 pa-3"
            elevation="8"
            rounded
            variant="outlined"
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
      </v-col>

      <v-col class="d-flex" cols="12">
        <v-btn
          v-if="dialogsQuery.hasPreviousPage?.value"
          class="mx-auto"
          size="small"
          type="button"
          variant="outlined"
          :loading="dialogsQuery.isFetchingPreviousPage.value"
          @click="dialogsQuery.fetchPreviousPage"
        >
          Fetch previous
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
