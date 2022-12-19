import { api } from '.';
import type {
  Dialog,
  IdNumber,
  V1DialogsSendMessageCreatePayload,
} from './api';

type UserId = IdNumber;

export function fetchDialogs(id: UserId) {
  return api.api.v1UsersDialogsDetail(String(id));
}

export function fetchDialogDetails(id: Dialog['id']) {
  return api.api.v1DialogsDetail(String(id));
}

export function fetchDialogMessages(id: UserId) {
  return api.api.v1DialogsMessagesDetail(String(id));
}

export function sendMessage(
  dialogId: number,
  data: V1DialogsSendMessageCreatePayload
) {
  return api.api.v1DialogsSendMessageCreate(String(dialogId), data);
}
