import { api } from '.';
import type { IdNumber, FetchMeetsParams } from './api';

type UserId = IdNumber;

export function fetchMeets(query: FetchMeetsParams) {
  return api.api.fetchMeets(query);
}

export function initiateMeet(id: UserId) {
  return api.api.initiateMeet(String(id));
}

export function confirmMeet(id: UserId) {
  return api.api.confirmMeet(String(id));
}

export function declineMeet(id: UserId) {
  return api.api.declineMeet(String(id));
}
