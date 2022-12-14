import { api } from '.';
import type { IdNumber, V1MeetsListParams } from './api';

type UserId = IdNumber;

export function fetchMeets(query: V1MeetsListParams) {
  return api.api.v1MeetsList(query);
}

export function likePerson(id: UserId) {
  return api.api.v1MeetsLikePersonCreate(String(id));
}

export function confirmLikePerson(id: UserId) {
  return api.api.v1MeetsConfirmCreate(String(id));
}
