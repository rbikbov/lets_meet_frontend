import { api } from '.';

export function fetchUsers() {
  return api.api.v1UsersList();
}
