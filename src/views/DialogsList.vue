<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuery } from '@tanstack/vue-query';

import { useAuthStore } from '@/stores/auth';
import { useDialogsStore } from '@/stores/dialogs';
import { DIALOGS } from '@/services/queries/keys';
import { fetchDialogs } from '@/services/dialogs';
import { AppRouteNames } from '@/router';

const { dialogs } = storeToRefs(useDialogsStore());
const { setDialogs } = useDialogsStore();

const { user } = storeToRefs(useAuthStore());

const dialogsQuery = useQuery({
  queryKey: [DIALOGS],
  queryFn: () => fetchDialogs(user.value?.id!),
  onSuccess: (response) => {
    setDialogs(response.data);
  },
});
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

    <v-row dense>
      <v-col
        v-for="dialog in dialogs"
        :key="`${dialog.incoming_id} ${dialog.outgoing_id}`"
        cols="12"
      >
        <v-card
          :title="`${dialog.incoming_id} ${dialog.outgoing_id}`"
          :subtitle="`Dialog confirmed is ${dialog.confirmed}`"
          text="Lorem ipsum dolor sit amet consectetur, adipisicing elit.?"
        >
          <v-btn
            type="button"
            :to="{
              name: AppRouteNames.dialogDetail,
              params: { id: dialog.id },
            }"
          >
            Open dialog
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
