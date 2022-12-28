<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useMutation, useQuery } from '@tanstack/vue-query';

import type { Dialog, Message, User } from '@/services/api';
import { useActionCable } from '@/services/actionCable';
import {
  fetchDialogMessages,
  fetchDialogDetails,
  sendMessage,
} from '@/services/dialogs';
import { DIALOGS, DIALOGS_MESSAGES } from '@/services/queries/keys';

import { useAuthStore } from '@/stores/auth';

import BaseInputWrapper from '@/components/BaseInputWrapper.vue';
import DialogMessageItem from '@/components/DialogMessageItem.vue';
import type { VCol } from 'vuetify/components';

const props = defineProps<{
  dialogId: number;
}>();

const { accessToken, isAuthenticated, authUser } = storeToRefs(useAuthStore());

const messages = ref<Message[]>([]);

const dialogMessagesQuery = useQuery({
  queryKey: [DIALOGS_MESSAGES, props.dialogId],
  queryFn: () => fetchDialogMessages(props.dialogId),
  onSuccess: (response) => {
    messages.value = response.data;
  },
  enabled: false,
});

const dialog = ref<Dialog | null>(null);

const dialogQuery = useQuery({
  queryKey: [DIALOGS, props.dialogId],
  queryFn: () => fetchDialogDetails(props.dialogId),
  onSuccess: async (response) => {
    dialog.value = response.data;
    await dialogMessagesQuery.refetch();
    scrollToLastMessage();
  },
});

let messagesSubscribtion: ReturnType<
  ReturnType<typeof useActionCable>['subscribeToNotificationsChannel']
> = null;

const subscribeToDialogMessages = () => {
  const actionCable = useActionCable({ accessToken });

  messagesSubscribtion = actionCable.subscribeToMessagesChannel({
    received(data) {
      if (data.message.dialog_id !== props.dialogId) {
        return;
      }
      messages.value.push(data.message);
    },
    connected: () =>
      console.log(
        `Connected to messages stream (dialogId = ${props.dialogId})`
      ),
  });
};

const unsubscribeFromDialogMessages = () => {
  if (!messagesSubscribtion) {
    return;
  }

  messagesSubscribtion.unsubscribe();
  console.log(
    `Unsubscribed from messages stream (dialogId = ${props.dialogId})`,
    messagesSubscribtion
  );
};

watch(
  isAuthenticated,
  (val) => {
    if (val) {
      subscribeToDialogMessages();
    } else {
      // TODO: check unsubscribing
      unsubscribeFromDialogMessages();
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  unsubscribeFromDialogMessages();
});

watch(
  () => props.dialogId,
  () => {
    unsubscribeFromDialogMessages();
    subscribeToDialogMessages();
  }
);

const isMsgFormValid = ref(false);
const msgFormComponent = ref<HTMLFormElement | null>(null);

const newMessageText = ref<string>('');
const sendMessageMutation = useMutation({
  mutationFn: () =>
    sendMessage(props.dialogId, { text_message: newMessageText.value }),
  onSuccess: async (response) => {
    msgFormComponent.value?.resetValidation();
    newMessageText.value = '';
    messages.value.push(response.data);
    await nextTick();
    scrollToLastMessage();
  },
});

const onMessageFormSubmit = () => {
  if (!isMsgFormValid.value) {
    return;
  }
  sendMessageMutation.mutate();
};

const required = (v: string) => {
  return !!v || 'Field is required';
};

const interlocutorUser = computed<User | null>(() => {
  return dialog.value && authUser.value
    ? dialog.value.users.find((u) => u.id !== authUser.value?.id)!
    : null;
});

const isMyMsg = (msg: Message) => {
  return msg.user_id === authUser.value?.id;
};

const scrollToLastMessage = () => {
  document.getElementById('lastMessage')?.scrollIntoView({
    behavior: 'smooth',
  });
};
</script>

<template>
  <v-container class="h-100">
    <v-row v-if="true">
      <v-col class="d-flex">
        <!--
        <v-btn type="button" @click="dialogMessagesQuery.refetch">
          Fetch dialog messages
        </v-btn>
        -->
        <v-btn
          class="ml-auto"
          size="small"
          icon
          type="button"
          variant="outlined"
          @click="scrollToLastMessage"
        >
          <v-icon icon="mdi-arrow-down"></v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row
      class="overflow-auto"
      style="height: calc(100% - 60px - 80px + 24px)"
    >
      <v-col v-if="authUser && interlocutorUser" cols="12">
        <div
          v-for="(item, index) in messages"
          :key="item.id"
          class="d-flex flex-row align-top"
          :class="{ 'justify-end': isMyMsg(item) }"
          :id="index === messages.length - 1 ? 'lastMessage' : undefined"
        >
          <DialogMessageItem
            :message="item"
            :isMyMsg="isMyMsg(item)"
            :me="authUser"
            :interlocutor="interlocutorUser"
            :isAuthorPrevMsg="messages[index - 1]?.user_id === item.user_id"
          />
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-form
          class="d-flex"
          ref="msgFormComponent"
          v-model="isMsgFormValid"
          @submit.prevent="onMessageFormSubmit"
        >
          <BaseInputWrapper v-slot="{ inputProps }">
            <v-text-field
              v-bind="inputProps"
              v-model="newMessageText"
              :rules="[required]"
              :readonly="sendMessageMutation.isLoading.value"
              clearable
              placeholder="Type Something"
              type="text"
              hide-details
            />
          </BaseInputWrapper>
          <v-btn
            :loading="sendMessageMutation.isLoading.value"
            :disabled="sendMessageMutation.isLoading.value || !isMsgFormValid"
            icon="mdi-send"
            type="submit"
            class="ml-2 my-auto"
          >
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
