import type { AxiosProgressEvent } from 'axios';
import { api } from '.';
import type {
  ProfileDataUser,
  SigninRequestDataUser,
  SignupRequestDataUser,
} from './api';

type UserId = number | string;

export function signUp(user: SignupRequestDataUser) {
  return api.api.v1UsersCreate({ user });
}

export function fetchUserInfo(id: UserId) {
  return api.api.v1UsersDetail(String(id));
}

export function editUserInfo(id: UserId, data: ProfileDataUser) {
  return api.api.v1UsersPartialUpdate(String(id), { profile: data });
}

export function signOut() {
  return api.api.v1SessionsLogoutDelete();
}

export function signIn(user: SigninRequestDataUser) {
  return api.api.v1SessionsCreate({ user });
}

export function signUpConfirm(confirmationCode: string) {
  return api.api.v1UsersConfirmAccountDetail(confirmationCode);
}

export function refreshAccessToken(refreshToken: string) {
  return api.api.v1SessionsRefreshCreate({ token: refreshToken });
}

export function updateUserInfo(id: UserId, profile: ProfileDataUser) {
  return api.api.v1UsersPartialUpdate(String(id), { profile });
}

export function updateUserAvatar(
  id: UserId,
  avatar: File,
  options?: { onUploadProgress: (progressEvent: AxiosProgressEvent) => void }
) {
  return api.api.v1UsersLoadAvatarPartialUpdate(
    String(id),
    { avatar },
    options
  );
}
