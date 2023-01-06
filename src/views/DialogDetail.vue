<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/vue-query';
import { useDebounceFn } from '@vueuse/core';
import type { VCol } from 'vuetify/components';

import { AppRouteNames } from '@/router';
import type { Dialog, Message, User } from '@/services/api';
import { useActionCable } from '@/services/actionCable';
import {
  fetchDialogMessages,
  fetchDialogDetails,
  sendMessage,
  readMessages,
} from '@/services/dialogs';
import { DIALOGS, DIALOGS_MESSAGES } from '@/services/queries/keys';

import { useAuthStore } from '@/stores/auth';
import { getFullName } from '@/helpers/fullName';

import BaseInputWrapper from '@/components/BaseInputWrapper.vue';
import DialogMessageItem from '@/components/DialogMessageItem.vue';
import BaseDefaultAvatarWrapper from '@/components/BaseDefaultAvatarWrapper.vue';
import BaseLoader from '@/components/BaseLoader.vue';

const props = defineProps<{
  dialogId: number;
}>();

const { accessToken, isAuthenticated, authUser } = storeToRefs(useAuthStore());

const dialog = ref<Dialog | null>(null);
const messages = ref<Message[]>([]);

const dialogMessagesQuery = useInfiniteQuery({
  queryKey: [DIALOGS_MESSAGES, props.dialogId],
  queryFn: ({ pageParam }) => {
    return fetchDialogMessages({
      id: String(props.dialogId),
      page: pageParam,
    });
  },
  getNextPageParam: (lastPage, allPages) =>
    lastPage.data.has_next ? lastPage.data.current_page! + 1 : false,
  getPreviousPageParam: (firstPage, allPages) =>
    firstPage.data.has_prev ? firstPage.data.current_page! - 1 : false,
  onSuccess: (responses) => {
    messages.value = responses.pages.map((r) => r.data.results).flat();
  },
  enabled: false,
});

const fetchPreviousClicked = async () => {
  getScrollState();
  const { scrollTop, scrollHeight } = { ...scrollState };

  await dialogMessagesQuery.fetchPreviousPage();

  getScrollState();
  const top = scrollTop + (scrollState.scrollHeight - scrollHeight);

  scrollTo({ top });
};

const dialogQuery = useQuery({
  queryKey: [DIALOGS, props.dialogId],
  queryFn: () => fetchDialogDetails(props.dialogId),
  onSuccess: async (response) => {
    dialog.value = response.data;
    await dialogMessagesQuery.refetch();
    // await dialogMessagesQuery.fetchPreviousPage();
    scrollToBottom();
  },
});

let messagesSubscribtion: ReturnType<
  ReturnType<typeof useActionCable>['subscribeToNotificationsChannel']
> = null;

const subscribeToDialogMessages = () => {
  const actionCable = useActionCable({ accessToken });

  messagesSubscribtion = actionCable.subscribeToMessagesChannel({
    async received(data) {
      if (data.message.dialog_id !== props.dialogId) {
        return;
      }
      messages.value.push(data.message);
      await nextTick();

      const lastMsgEl = getLastMessageElement();
      if (!lastMsgEl) {
        return;
      }
      const { scrollHeight, scrollTop, clientHeight } = scrollState;
      const isLastMsgVisible =
        scrollHeight - clientHeight - scrollTop - lastMsgEl.offsetHeight <
        lastMsgEl.offsetHeight;
      if (isLastMsgVisible) {
        scrollToBottom();
      }
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

let dialogNotificationsSubscribtion: ReturnType<
  ReturnType<typeof useActionCable>['subscribeToNotificationsChannel']
> = null;

const subscribeToDialogNotificationsMessages = () => {
  const actionCable = useActionCable({ accessToken });

  dialogNotificationsSubscribtion =
    actionCable.subscribeToDialogNotificationsChannel({
      received(data) {
        if (data.dialog_id !== props.dialogId) {
          return;
        }
        messages.value.forEach((m) => {
          if (!data.messages_readed_ids.includes(m.id)) {
            return;
          }
          m.read = true;
        });
      },
      connected: () =>
        console.log(
          `Connected to dialog notifications stream (dialogId = ${props.dialogId})`
        ),
    });
};

const unsubscribeFromDialogNotificationsMessages = () => {
  if (!dialogNotificationsSubscribtion) {
    return;
  }

  dialogNotificationsSubscribtion.unsubscribe();
  console.log(
    `Unsubscribed from dialog notifications stream (dialogId = ${props.dialogId})`,
    dialogNotificationsSubscribtion
  );
};

watch(
  isAuthenticated,
  (val) => {
    if (val) {
      subscribeToDialogMessages();
      subscribeToDialogNotificationsMessages();
    } else {
      unsubscribeFromDialogMessages();
      unsubscribeFromDialogNotificationsMessages();
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  unsubscribeFromDialogMessages();
  unsubscribeFromDialogNotificationsMessages();
});

watch(
  () => props.dialogId,
  () => {
    unsubscribeFromDialogMessages();
    unsubscribeFromDialogNotificationsMessages();
    subscribeToDialogMessages();
    subscribeToDialogNotificationsMessages();
  }
);

const newMessageText = ref<string>('');
const isMsgFormValid = computed<boolean>(() => !!newMessageText.value);
const msgFormComponent = ref<HTMLFormElement | null>(null);

const sendMessageMutation = useMutation({
  mutationFn: () =>
    sendMessage(props.dialogId, { text_message: newMessageText.value }),
  onSuccess: async (response) => {
    msgFormComponent.value?.resetValidation();
    newMessageText.value = '';
    messages.value.push(response.data);
    await nextTick();
    scrollToBottom();
  },
});

const onMessageFormSubmit = () => {
  if (!isMsgFormValid.value) {
    return;
  }
  sendMessageMutation.mutate();
};

const interlocutorUser = computed<User | null>(() => {
  return dialog.value && authUser.value
    ? dialog.value.users.find((u) => u.id !== authUser.value?.id)!
    : null;
});

const isMyMsg = (msg: Message) => {
  return msg.user_id === authUser.value?.id;
};

const getMessageElement = (msg: Message) =>
  document.getElementById(`message_${msg.id}`);

const getLastMessageElement = () =>
  messages.value.length
    ? getMessageElement(messages.value[messages.value.length - 1])
    : null;

const getMessagesScrollableContainer = () =>
  document.getElementById('messagesScrollableContainer');

const scrollTo = (options: { top: number; behavior?: 'smooth' }) => {
  getMessagesScrollableContainer()?.scrollTo(options);
};

const scrollToBottom = () => {
  getScrollState();
  scrollTo({
    top: scrollState.scrollHeight + scrollState.clientHeight,
    behavior: 'smooth',
  });
};

const intersectedMessagesIds = new Set<Message['id']>();
const onIntersect = (
  msg: Message,
  isIntersecting: boolean,
  entries: IntersectionObserverEntry[]
  // observer: IntersectionObserver
) => {
  if (
    !isIntersecting ||
    msg.read ||
    isMyMsg(msg) ||
    entries[0].intersectionRatio < 0.5
  ) {
    return;
  }

  intersectedMessagesIds.add(msg.id);
  debouncedReadMessages();
};

const readMessagesMutation = useMutation({
  mutationFn: async ({
    userId,
    dialogId,
    message_ids,
  }: {
    userId: number;
    dialogId: number;
    message_ids: number[];
  }) =>
    readMessages(userId, dialogId, {
      message_ids,
    }),
  onSuccess: async (response) => {
    response.data.read_ids.forEach((id) => {
      messages.value.forEach((m) => {
        if (m.id === id) {
          m.read = true;
        }
      });
    });
  },
});

const debouncedReadMessages = useDebounceFn(
  () => {
    if (
      !interlocutorUser.value ||
      !dialog.value ||
      !intersectedMessagesIds.size
    ) {
      return;
    }
    readMessagesMutation.mutate({
      userId: interlocutorUser.value.id,
      dialogId: dialog.value.id,
      message_ids: Array.from(intersectedMessagesIds.values()),
    });
    intersectedMessagesIds.clear();
  },
  1000,
  { maxWait: 3000 }
);

const scrollState = reactive({
  clientHeight: 0,
  scrollHeight: 0,
  scrollTop: 0,
  fromBottom: 0,
  fromBottomPercent: 0,
});

const getScrollState = () => {
  const el = getMessagesScrollableContainer();
  if (!el) {
    return;
  }
  const { scrollHeight, scrollTop, clientHeight } = el;
  const fromBottom = scrollHeight - scrollTop - clientHeight;
  const fromBottomPercent = scrollHeight
    ? Math.ceil((fromBottom / scrollHeight) * 100)
    : 0;

  scrollState.scrollHeight = scrollHeight;
  scrollState.scrollTop = scrollTop;
  scrollState.fromBottom = fromBottom;
  scrollState.fromBottomPercent = fromBottomPercent;
};

const debouncedOnScroll = useDebounceFn(getScrollState, 500, { maxWait: 1500 });
</script>

<template>
  <v-container class="h-100">
    <v-row>
      <v-col class="d-flex pr-12 elevation-4">
        <div class="my-auto mr-2">
          <v-btn
            icon
            size="30"
            variant="outlined"
            :to="{ name: AppRouteNames.dialogs }"
          >
            <v-icon icon="mdi-arrow-left"></v-icon>
          </v-btn>
        </div>

        <div class="flex-grow-1 d-flex">
          <BaseDefaultAvatarWrapper
            v-slot="{ url, onError }"
            :avatar-url="interlocutorUser?.avatar"
          >
            <v-avatar class="mr-2" :size="40">
              <v-img alt="Avatar" cover :src="url" @error="onError">
                <template v-slot:placeholder>
                  <BaseLoader />
                </template>
              </v-img>
            </v-avatar>
          </BaseDefaultAvatarWrapper>

          <div>
            <div class="text-caption font-bold">
              {{ getFullName(interlocutorUser || {}) }}
            </div>
            <div class="text-caption font-italic">
              {{
                `${interlocutorUser?.gender}, ${interlocutorUser?.age}, ${interlocutorUser?.city}`
              }}
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row
      id="messagesScrollableContainer"
      v-scroll.self="debouncedOnScroll"
      class="overflow-auto"
      style="height: calc(100% - 60px - 80px + 2px)"
    >
      <v-col
        v-if="authUser && interlocutorUser"
        cols="12"
        class="d-flex flex-column"
      >
        <v-btn
          v-if="dialogMessagesQuery.hasPreviousPage?.value"
          class="mx-auto mb-4"
          size="small"
          type="button"
          variant="outlined"
          :loading="dialogMessagesQuery.isFetchingPreviousPage.value"
          @click="fetchPreviousClicked"
        >
          Fetch previous messages
        </v-btn>

        <div
          v-for="item in messages"
          :key="item.id"
          class="d-flex flex-row align-top"
          :class="{ 'justify-end': isMyMsg(item) }"
          :id="`message_${item.id}`"
        >
          <DialogMessageItem
            v-intersect="{
              handler: (isIntersecting: boolean, entries: IntersectionObserverEntry[]) =>
                onIntersect(item, isIntersecting, entries),
              options: {
                threshold: [0, 0.5, 1.0],
              },
            }"
            :message="item"
          />
        </div>

        <v-btn
          v-if="scrollState.fromBottomPercent > 20"
          icon
          class="ma-8"
          :style="`position: absolute; right: 0; bottom: 80px`"
          size="large"
          type="button"
          variant="tonal"
          @click="scrollToBottom"
        >
          <v-icon icon="mdi-arrow-down"></v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="elevation-4">
      <v-col>
        <v-form
          class="d-flex"
          ref="msgFormComponent"
          @submit.prevent="onMessageFormSubmit"
        >
          <BaseInputWrapper v-slot="{ inputProps }">
            <v-text-field
              v-bind="inputProps"
              v-model="newMessageText"
              :readonly="sendMessageMutation.isLoading.value"
              :maxlength="1024"
              persistent-counter
              persistent-hint
              hint="Type Something =)"
              placeholder="Hello!"
              clearable
              required
              type="text"
              autofocus
            />
          </BaseInputWrapper>
          <v-btn
            :loading="sendMessageMutation.isLoading.value"
            :disabled="sendMessageMutation.isLoading.value || !isMsgFormValid"
            icon="mdi-send"
            type="submit"
            class="ml-2 mb-auto"
          >
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
