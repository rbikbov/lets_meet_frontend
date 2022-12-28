import type { AxiosProgressEvent } from 'axios';
import { api } from '.';
import type {
  IdNumber,
  ProfileDataUser,
  SigninRequestDataUser,
  SignupRequestDataUser,
  ResendConfirmMailPayload,
  AvatarFile,
} from './api';

// export type UserId = number | string;
type UserId = IdNumber;

export function signUp(user: SignupRequestDataUser) {
  return api.api.createUser({ user });
}

export function fetchMe() {
  return api.api.fetchCurrentUser();
}

export function signOut() {
  return api.api.closeSession();
}

export function signIn(user: SigninRequestDataUser) {
  return api.api.openSession({ user });
}

export function signUpConfirm(confirmationCode: string) {
  return api.api.confirmAccount(confirmationCode);
}

export function signUpConfirmationEmailResend(data: ResendConfirmMailPayload) {
  return api.api.resendConfirmMail(data);
}

export function refreshAccessToken(refreshToken: string) {
  return api.api.refreshSession({ token: refreshToken });
}

export function updateUserInfo(id: UserId, profile: ProfileDataUser) {
  return api.api.updateUser(String(id), { profile });
}

export function updateUserAvatar(
  id: UserId,
  data: AvatarFile,
  options?: { onUploadProgress: (progressEvent: AxiosProgressEvent) => void }
) {
  return api.api.loadAvatar(String(id), data, options);
}
