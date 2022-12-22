import { api } from '.';
import type { IdNumber } from './api';

type UserId = IdNumber;

export function fetchUsers() {
  return api.api.fetchUsers();
}

export function fetchUserInfo(id: UserId) {
  return api.api.fetchUser(String(id));
}
