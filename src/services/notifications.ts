import { api } from '.';
import type { FetchUserNotificationsParams } from './api';

export function fetchNotifications(requestData: FetchUserNotificationsParams) {
  return api.api.fetchUserNotifications(requestData);
}
