import { api } from '.';
import type {
  IdNumber,
  FetchMeetsParams,
  ConfirmMeetPayload,
  DeclineMeetPayload,
  UpdatePullPersonsByFilterParams,
} from './api';

type UserId = IdNumber;

export function fetchMeets(query: FetchMeetsParams) {
  return api.api.fetchMeets(query);
}

export function initiateMeet(id: UserId) {
  return api.api.initiateMeet(String(id));
}

export function confirmMeet(id: UserId, data: ConfirmMeetPayload) {
  return api.api.confirmMeet(String(id), data);
}

export function declineMeet(id: UserId, data: DeclineMeetPayload) {
  return api.api.declineMeet(String(id), data);
}

export async function updatePullPersonsByFilter(
  queryParams: UpdatePullPersonsByFilterParams = {}
) {
  return api.api.updatePullPersonsByFilter(queryParams);
}

export function fetchCurrentPerson() {
  return api.api.fetchCurrentPerson();
}

export function initiateCurrentPerson() {
  return api.api.initiateCurrentPerson();
}

export function skipCurrentPerson() {
  return api.api.skipCurrentPerson();
}
