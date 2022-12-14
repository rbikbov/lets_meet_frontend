<script setup lang="ts">
import { ref } from 'vue';
// import { storeToRefs } from 'pinia';
import { useMutation, useQuery } from '@tanstack/vue-query';

// import { useAuthStore } from '@/stores/auth';
// import { useDialogsStore } from '@/stores/dialogs';
// import { DIALOGS } from '@/services/queries/keys';
import { fetchDialogMessages, sendMessage } from '@/services/dialogs';
// import { AppRouteNames } from '@/router';
import BaseInputWrapper from '@/components/BaseInputWrapper.vue';
import { DIALOGS } from '@/services/queries/keys';
import { useMessagesStore } from '@/stores/messages';
import { storeToRefs } from 'pinia';

// const { dialogs } = storeToRefs(useDialogsStore());
// const { setDialogs } = useDialogsStore();

const props = defineProps<{
  dialogId: number;
}>();

// const { user } = storeToRefs(useAuthStore());

const messagesStore = useMessagesStore();
const { messages } = storeToRefs(useMessagesStore());

// const messages = ref<MessagesArray>([]);

const dialogMessagesQuery = useQuery({
  queryKey: [DIALOGS, props.dialogId],
  queryFn: () => fetchDialogMessages(props.dialogId),
  onSuccess: (response) => {
    messagesStore.setMessages(response.data);
    // setDialogs(response.data);
  },
});

const newMessageText = ref<string>('');
const sendMessageMutation = useMutation({
  // queryKey: [MEETS_LIKE_PERSON],
  mutationFn: () =>
    sendMessage(props.dialogId, { text_message: newMessageText.value }),
  onSuccess: (response) => {
    newMessageText.value = '';
    messagesStore.setMessages([...messages.value, response.data]);
    // messages.value.push(response.data);
  },
});
</script>

<template>
  <v-container fluid>
    <v-btn
      class="mx-auto mb-4"
      color="success"
      type="button"
      variant="elevated"
      @click="dialogMessagesQuery.refetch"
    >
      Fetch dialog messages
    </v-btn>

    <v-row dense>
      <v-col
        v-for="message in messages"
        :key="JSON.stringify(message)"
        cols="12"
      >
        <v-card
          :title="`${message.user_id} ${message.dialog_id}`"
          :subtitle="`message is ${JSON.stringify(message)}`"
          :text="message.description"
        >
          <!-- <v-btn type="button" :to="{ name: AppRouteNames.dialogDetail }">
            likePerson
          </v-btn> -->
        </v-card>
      </v-col>
    </v-row>

    <v-divider></v-divider>

    <v-form @submit.prevent="sendMessageMutation.mutate">
      <BaseInputWrapper v-slot="{ inputProps }">
        <!-- :rules="[required]" -->
        <v-text-field
          v-bind="inputProps"
          v-model="newMessageText"
          :readonly="sendMessageMutation.isLoading.value"
          class="mt-4"
          clearable
          label="Message"
          type="text"
        ></v-text-field>
      </BaseInputWrapper>

      <v-btn :loading="sendMessageMutation.isLoading.value" type="submit">
        Send Message
      </v-btn>
    </v-form>
  </v-container>
</template>

<style></style>
