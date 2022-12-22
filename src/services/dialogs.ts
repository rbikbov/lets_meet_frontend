import { api } from '.';
import type { Dialog, IdNumber, DialogSendMessagePayload } from './api';

type UserId = IdNumber;

export function fetchDialogs(id: UserId) {
  return api.api.fetchUserDialogs(String(id));
}

export function fetchDialogDetails(id: Dialog['id']) {
  return api.api.fetchDialog(String(id));
}

export function fetchDialogMessages(id: UserId) {
  return api.api.fetchDialogMessages(String(id));
}

export function sendMessage(dialogId: number, data: DialogSendMessagePayload) {
  return api.api.dialogSendMessage(String(dialogId), data);
}
