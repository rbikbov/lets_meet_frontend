import { api } from '.';
import type {
  Dialog,
  DialogSendMessagePayload,
  ReadDialogMessagesPayload,
  FetchUserDialogsParams,
  FetchDialogMessagesParams,
} from './api';

export function fetchDialogs(requestData: FetchUserDialogsParams) {
  return api.api.fetchUserDialogs(requestData);
}

export function fetchDialogDetails(id: Dialog['id']) {
  return api.api.fetchDialog(String(id));
}

export function fetchDialogMessages(requestData: FetchDialogMessagesParams) {
  return api.api.fetchDialogMessages(requestData);
}

export function sendMessage(
  dialogId: Dialog['id'],
  data: DialogSendMessagePayload
) {
  return api.api.dialogSendMessage(String(dialogId), data);
}

export function readMessages(
  userId: number,
  dialogId: number,
  data: ReadDialogMessagesPayload
) {
  return api.api.readDialogMessages(String(userId), String(dialogId), data);
}
