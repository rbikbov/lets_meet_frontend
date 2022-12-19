import { computed, ref, watch } from 'vue';
import { defineStore, storeToRefs } from 'pinia';

import type { Dialog } from '@/services/api';
import { useAuthStore } from './auth';
import { useActionCable } from '@/services/actionCable';
import { fetchDialogDetails } from '@/services/dialogs';

type DialogIdToInterlocutorUserMap = {
  [key: Dialog['id']]: Dialog['users'][number];
};

export const useDialogsStore = defineStore('dialogs', () => {
  const { authUser } = storeToRefs(useAuthStore());

  const dialogs = ref<Dialog[]>([]);

  function setDialogs(data: Dialog[]) {
    dialogs.value = data;
  }

  function sortDialogsByLastMessage() {
    dialogs.value.sort((a, b) =>
      (a.last_message?.created_at || 0) > (b.last_message?.created_at || 0)
        ? -1
        : 1
    );
  }

  watch(dialogs, () => {
    sortDialogsByLastMessage();
  });

  const dialogIdToInterlocutorUserMap = computed<DialogIdToInterlocutorUserMap>(
    () => {
      if (!authUser.value) {
        return {};
      }

      return dialogs.value.reduce((acc, dialog) => {
        const interlocutorUserId =
          dialog.incoming_id === authUser.value?.id
            ? dialog.outgoing_id
            : dialog.incoming_id;
        acc[dialog.id] = dialog.users.find(
          (usr) => usr.id === interlocutorUserId
        )!;
        return acc;
      }, {} as DialogIdToInterlocutorUserMap);
    }
  );

  const { accessToken, isAuthenticated } = storeToRefs(useAuthStore());

  const actionCable = useActionCable({ accessToken });

  let messagesSubscribtion: ReturnType<
    typeof actionCable.subscribeToNotificationsChannel
  > = null;

  watch(
    accessToken,
    (val) => {
      if (isAuthenticated.value && val) {
        messagesSubscribtion = actionCable.subscribeToMessagesChannel({
          async received(data) {
            const dialog = dialogs.value.find(
              ({ id }) => id === data.message.dialog_id
            );

            if (dialog) {
              dialog.last_message = data.message;
              return;
            } else {
              const newDialogResponse = await fetchDialogDetails(
                data.message.dialog_id!
              );
              dialogs.value.unshift(newDialogResponse.data);
            }
          },
          connected: () =>
            console.log('Connected to messages stream for dialogs updating'),
        });
      } else {
        // TODO: check unsubscribing
        messagesSubscribtion?.unsubscribe();
      }
    },
    { immediate: true }
  );

  return {
    dialogs,

    dialogIdToInterlocutorUserMap,

    setDialogs,
  };
});
