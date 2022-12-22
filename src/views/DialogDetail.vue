<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
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
import { getFullName } from '@/helpers/fullName';
import { getFullDateTime } from '@/helpers/dateFormatter';

import BaseInputWrapper from '@/components/BaseInputWrapper.vue';
import BaseDefaultAvatarWrapper from '@/components/BaseDefaultAvatarWrapper.vue';

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
  onSuccess: (response) => {
    dialog.value = response.data;
    dialogMessagesQuery.refetch();
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
  onSuccess: (response) => {
    msgFormComponent.value?.resetValidation();
    newMessageText.value = '';
    messages.value.push(response.data);
    // messages.value.push(response.data);
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

const formatMessageTitle = (title: string) => `${title}:`;

const interlocutorUser = computed<User | null>(() => {
  return dialog.value && authUser.value
    ? dialog.value.users.find((u) => u.id !== authUser.value?.id)!
    : null;
});

const getMessageTitle = (msg: Message): string => {
  if (msg.user_id === authUser.value?.id) {
    return formatMessageTitle(
      authUser.value ? getFullName(authUser.value) : 'From me'
    );
  }

  return formatMessageTitle(
    interlocutorUser.value ? getFullName(interlocutorUser.value) : 'For me'
  );
};

const getMessageSubtitle = (msg: Message): string => {
  const parts: string[] = [getFullDateTime(msg.created_at)];

  if (msg.updated_at !== msg.created_at) {
    parts.push(`Edited at ${getFullDateTime(msg.updated_at)}`);
  }

  return parts.join(' ');
};

const isMyMsg = (msg: Message) => {
  return msg.user_id === authUser.value?.id;
};
</script>

<template>
  <v-container class="fill-height overflow-auto">
    <v-btn
      v-if="false"
      class="mx-auto mb-4"
      color="success"
      type="button"
      variant="elevated"
      @click="dialogMessagesQuery.refetch"
    >
      Fetch dialog messages
    </v-btn>

    <v-row class="pb-2 fill-height">
      <v-col>
        <div
          v-for="(item, index) in messages"
          :key="item.id"
          class="d-flex flex-row align-top"
          :class="{ 'justify-end': isMyMsg(item) }"
        >
          <v-card
            :title="
              messages[index - 1]?.user_id !== item.user_id
                ? getMessageTitle(item)
                : ''
            "
            :subtitle="getMessageSubtitle(item)"
            :text="item.description"
            class="mb-2"
            density="compact"
            max-width="85%"
            min-width="35%"
          >
            <template
              v-if="messages[index - 1]?.user_id !== item.user_id"
              v-slot:prepend
            >
              <BaseDefaultAvatarWrapper
                v-slot="{ url }"
                :avatar-url="
                  isMyMsg(item) ? authUser?.avatar : interlocutorUser?.avatar
                "
              >
                <v-avatar :size="40">
                  <v-img alt="Avatar" cover :src="url"></v-img>
                </v-avatar>
              </BaseDefaultAvatarWrapper>
            </template>
          </v-card>
          <!-- <div
            :class="{ 'mr-3': isMyMsg(item), 'ml-3': !isMyMsg(item) }"
            :style="{ order: isMyMsg(item) ? 0 : 1 }"
          >
            <div
          v-if="messages[index - 1]?.user_id !== item.user_id"
            >{{ getMessageTitle(item) }}</div>
            <div>{{ getMessageSubtitle(item) }}</div>
            <div>{{ item.description }}</div>
          </div>
          <v-avatar
            v-if="messages[index - 1]?.user_id !== item.user_id"
           :size="36">
            <v-img
              alt="Avatar"
              cover
              :src="isMyMsg(item) ? authUser?.avatar : interlocutorUser?.avatar"
            ></v-img>
          </v-avatar> -->
        </div>
      </v-col>
    </v-row>

    <v-theme-provider with-background style="position: sticky; bottom: 0">
      <v-row>
        <v-col>
          <v-form
            class="d-flex flex-row align-start"
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
                class="my-4"
                clearable
                placeholder="Type Something"
                type="text"
              ></v-text-field>
            </BaseInputWrapper>

            <v-btn
              :loading="sendMessageMutation.isLoading.value"
              :disabled="sendMessageMutation.isLoading.value || !isMsgFormValid"
              icon="mdi-send"
              class="ml-4 my-4"
              type="submit"
            >
            </v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-theme-provider>
  </v-container>
</template>

<style></style>
