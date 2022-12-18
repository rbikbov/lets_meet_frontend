import { api } from '.';
import type { IdNumber } from './api';

type UserId = IdNumber;

export function fetchUsers() {
  return api.api.v1UsersList();
}

export function fetchUserInfo(id: UserId) {
  return api.api.v1UsersDetail(String(id));
}
