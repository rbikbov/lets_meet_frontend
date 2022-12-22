import { api } from '.';
import type { IdNumber } from './api';

type UserId = IdNumber;

export function fetchNotifications(id: UserId) {
  return api.api.fetchUserNotifications(String(id));
}
