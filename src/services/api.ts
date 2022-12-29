/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export type IdNumber = number;

export enum GenderType {
  Male = 'male',
  Female = 'female',
}

export enum NotificationType {
  System = 'system',
  Initiate = 'initiate',
  Confirm = 'confirm',
  Visited = 'visited',
  Mutuality = 'mutuality',
}

export interface JwtPayload {
  id: IdNumber;
  /** @format email */
  email: string;
  admin: boolean;
  salt: string;
  /** @format date-time */
  expires_in: string;
}

export interface SigninRequestDataUser {
  /** @format email */
  email: string;
  /** @format password */
  password: string;
}

export type SignupRequestDataUser = SigninRequestDataUser & {
  /** @format password */
  password_confirmation: string;
  first_name: string;
};

export interface ProfileDataUser {
  first_name: string;
  last_name?: string;
  age?: number;
  gender?: GenderType;
}

export interface AvatarFile {
  avatar?: File;
}

export interface User {
  id: IdNumber;
  first_name: string;
  last_name?: string;
  age?: number;
  gender?: GenderType;
  avatar?: string;
  city?: string;
  initiates?: IdNumber[];
  black_list?: IdNumber[];
}

export type Me = User & {
  /** @format email */
  email: string;
};

export interface InvalidUser {
  email?: string[];
  password?: string[];
}

export interface AccessToken {
  user_id: IdNumber;
  token: string;
  /** @format date-time */
  expires_in: string;
  refresh: string;
}

export interface Dialog {
  id: IdNumber;
  incoming_id: IdNumber;
  outgoing_id: IdNumber;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
  users: UsersArray;
  last_message?: Message;
}

export interface Message {
  id: IdNumber;
  dialog_id: IdNumber;
  user_id: IdNumber;
  description: string;
  read: boolean;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
}

export interface Notification {
  id: IdNumber;
  user_id: IdNumber;
  content?: object;
  used: boolean;
  /** @format date-time */
  created_at: string;
  /** @format date-time */
  updated_at: string;
  notification_type: NotificationType;
}

export interface Error {
  errors?: {
    detail?: string[];
    [key: string]: any;
  };
}

export type UsersArray = User[];

export type DialogsArray = Dialog[];

export type MessagesArray = Message[];

export type NotificationsArray = Notification[];

export type FetchCountryCitiesData = any[];

export type FetchCountriesData = object;

export interface DialogSendMessagePayload {
  text_message: string;
}

export type DialogSendMessageData = Message;

export type DialogSendMessageError = Error;

export type FetchUserDialogsData = DialogsArray;

export type FetchUserDialogsError = Error;

export type FetchDialogData = Dialog;

export type FetchDialogError = Error;

export type FetchDialogMessagesData = MessagesArray;

export type FetchDialogMessagesError = Error;

export interface ReadDialogMessagesPayload {
  message_ids: IdNumber[];
}

export interface ReadDialogMessagesData {
  read_ids: IdNumber[];
}

export interface FetchMeetsParams {
  search?: {
    age_min?: number;
    age_max?: number;
    gender?: GenderType;
    city?: string;
    page?: number;
    per?: number;
  };
}

export type FetchMeetsData = UsersArray;

export type InitiateMeetData = any;

export type InitiateMeetError = Error;

export interface ConfirmMeetPayload {
  notification_id?: IdNumber;
}

export type ConfirmMeetData = any;

export type ConfirmMeetError = Error;

export interface DeclineMeetPayload {
  notification_id?: IdNumber;
}

export type DeclineMeetData = any;

export type DeclineMeetError = Error;

export type FetchUserNotificationsData = NotificationsArray;

export type FetchUserNotificationsError = Error;

export type CloseNotificationData = any;

export type CloseNotificationError = Error;

export interface OpenSessionPayload {
  user: SigninRequestDataUser;
}

export type OpenSessionData = AccessToken;

export type OpenSessionError = Error;

export interface RefreshSessionPayload {
  token: string;
}

export type RefreshSessionData = AccessToken;

export type RefreshSessionError = Error;

export type CloseSessionData = any;

export interface CreateUserPayload {
  user?: SignupRequestDataUser;
}

export type CreateUserData = any;

export type CreateUserError = Error;

export type FetchUsersData = UsersArray;

export interface ResendConfirmMailPayload {
  /** @format email */
  email: string;
}

export type ResendConfirmMailData = any;

export type ResendConfirmMailError = Error;

export type FetchUserData = User;

export type FetchUserError = Error;

export interface UpdateUserPayload {
  profile?: ProfileDataUser;
}

export type UpdateUserData = Me;

export type ConfirmAccountData = any;

export type ConfirmAccountError = Error;

export type FetchCurrentUserData = Me;

export type FetchCurrentUserError = Error;

export type LoadAvatarData = Me;

export type AddUserToBlackListData = any;

export type RemoveUserFromBlackListData = any;

export namespace Api {
  /**
   * No description
   * @tags Cities
   * @name FetchCountryCities
   * @summary return cities by country
   * @request GET:/api/v1/cities
   * @secure
   */
  export namespace FetchCountryCities {
    export type RequestParams = {
      country: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FetchCountryCitiesData;
  }
  /**
   * No description
   * @tags Cities
   * @name FetchCountries
   * @summary return all countries
   * @request GET:/api/v1/cities/country
   * @secure
   */
  export namespace FetchCountries {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FetchCountriesData;
  }
  /**
   * No description
   * @tags Dialogs
   * @name DialogSendMessage
   * @summary creates message
   * @request POST:/api/v1/dialogs/{id}/send_message
   * @secure
   */
  export namespace DialogSendMessage {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DialogSendMessagePayload;
    export type RequestHeaders = {};
    export type ResponseBody = DialogSendMessageData;
  }
  /**
   * No description
   * @tags Dialogs
   * @name FetchUserDialogs
   * @summary return dialogs
   * @request GET:/api/v1/users/{id}/dialogs
   * @secure
   */
  export namespace FetchUserDialogs {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FetchUserDialogsData;
  }
  /**
   * No description
   * @tags Dialogs
   * @name FetchDialog
   * @summary return dialog
   * @request GET:/api/v1/dialogs/{id}
   * @secure
   */
  export namespace FetchDialog {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FetchDialogData;
  }
  /**
   * No description
   * @tags Dialogs
   * @name FetchDialogMessages
   * @summary return dialog messages
   * @request GET:/api/v1/dialogs/{id}/messages
   * @secure
   */
  export namespace FetchDialogMessages {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FetchDialogMessagesData;
  }
  /**
   * No description
   * @tags Dialogs
   * @name ReadDialogMessages
   * @summary read messages by ids
   * @request PATCH:/api/v1/users/{user_id}/dialogs/{id}/read_messages
   * @secure
   */
  export namespace ReadDialogMessages {
    export type RequestParams = {
      userId: string;
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ReadDialogMessagesPayload;
    export type RequestHeaders = {};
    export type ResponseBody = ReadDialogMessagesData;
  }
  /**
   * No description
   * @tags Meets
   * @name FetchMeets
   * @summary Search persons
   * @request GET:/api/v1/meets
   */
  export namespace FetchMeets {
    export type RequestParams = {};
    export type RequestQuery = {
      search?: {
        age_min?: number;
        age_max?: number;
        gender?: GenderType;
        city?: string;
        page?: number;
        per?: number;
      };
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FetchMeetsData;
  }
  /**
   * No description
   * @tags Meets
   * @name InitiateMeet
   * @summary initiate meet
   * @request POST:/api/v1/meets/{id}/initiate
   * @secure
   */
  export namespace InitiateMeet {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = InitiateMeetData;
  }
  /**
   * No description
   * @tags Meets
   * @name ConfirmMeet
   * @summary confirm meet
   * @request POST:/api/v1/meets/{id}/confirm
   * @secure
   */
  export namespace ConfirmMeet {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ConfirmMeetPayload;
    export type RequestHeaders = {};
    export type ResponseBody = ConfirmMeetData;
  }
  /**
   * No description
   * @tags Meets
   * @name DeclineMeet
   * @summary decline meet
   * @request DELETE:/api/v1/meets/{id}/decline
   * @secure
   */
  export namespace DeclineMeet {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = DeclineMeetPayload;
    export type RequestHeaders = {};
    export type ResponseBody = DeclineMeetData;
  }
  /**
   * No description
   * @tags Notifications
   * @name FetchUserNotifications
   * @summary return notifications
   * @request GET:/api/v1/users/{id}/notifications
   * @secure
   */
  export namespace FetchUserNotifications {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FetchUserNotificationsData;
  }
  /**
   * No description
   * @tags Notifications
   * @name CloseNotification
   * @summary close notify
   * @request PATCH:/api/v1/notifications/{id}/close
   * @secure
   */
  export namespace CloseNotification {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CloseNotificationData;
  }
  /**
   * No description
   * @tags Sessions
   * @name OpenSession
   * @summary Creates a session
   * @request POST:/api/v1/sessions
   * @secure
   */
  export namespace OpenSession {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = OpenSessionPayload;
    export type RequestHeaders = {};
    export type ResponseBody = OpenSessionData;
  }
  /**
   * No description
   * @tags Sessions
   * @name RefreshSession
   * @summary Refresh session
   * @request POST:/api/v1/sessions/refresh
   * @secure
   */
  export namespace RefreshSession {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = RefreshSessionPayload;
    export type RequestHeaders = {};
    export type ResponseBody = RefreshSessionData;
  }
  /**
   * No description
   * @tags Sessions
   * @name CloseSession
   * @summary Delete session
   * @request DELETE:/api/v1/sessions/logout
   * @secure
   */
  export namespace CloseSession {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CloseSessionData;
  }
  /**
   * No description
   * @tags Users
   * @name CreateUser
   * @summary Creates a user
   * @request POST:/api/v1/users
   * @secure
   */
  export namespace CreateUser {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateUserPayload;
    export type RequestHeaders = {};
    export type ResponseBody = CreateUserData;
  }
  /**
   * No description
   * @tags Users
   * @name FetchUsers
   * @summary Return users list
   * @request GET:/api/v1/users
   * @secure
   */
  export namespace FetchUsers {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FetchUsersData;
  }
  /**
   * No description
   * @tags Users
   * @name ResendConfirmMail
   * @summary Resend confirmation mail
   * @request POST:/api/v1/users/resend_confirmation
   * @secure
   */
  export namespace ResendConfirmMail {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ResendConfirmMailPayload;
    export type RequestHeaders = {};
    export type ResponseBody = ResendConfirmMailData;
  }
  /**
   * No description
   * @tags Users
   * @name FetchUser
   * @summary Return user
   * @request GET:/api/v1/users/{id}
   * @secure
   */
  export namespace FetchUser {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FetchUserData;
  }
  /**
   * No description
   * @tags Users
   * @name UpdateUser
   * @summary Update user
   * @request PATCH:/api/v1/users/{id}
   * @secure
   */
  export namespace UpdateUser {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateUserPayload;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateUserData;
  }
  /**
   * No description
   * @tags Users
   * @name ConfirmAccount
   * @summary Confirm account
   * @request GET:/api/v1/users/{id}/confirm_account
   * @secure
   */
  export namespace ConfirmAccount {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConfirmAccountData;
  }
  /**
   * No description
   * @tags Users
   * @name FetchCurrentUser
   * @summary Return current user
   * @request GET:/api/v1/users/me
   * @secure
   */
  export namespace FetchCurrentUser {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = FetchCurrentUserData;
  }
  /**
   * No description
   * @tags Users
   * @name LoadAvatar
   * @summary Load user avatar
   * @request PATCH:/api/v1/users/{id}/load_avatar
   * @secure
   */
  export namespace LoadAvatar {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = AvatarFile;
    export type RequestHeaders = {};
    export type ResponseBody = LoadAvatarData;
  }
  /**
   * No description
   * @tags Users
   * @name AddUserToBlackList
   * @summary Added user to BL
   * @request PATCH:/api/v1/users/{id}/add_to_black_list
   * @secure
   */
  export namespace AddUserToBlackList {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = AddUserToBlackListData;
  }
  /**
   * No description
   * @tags Users
   * @name RemoveUserFromBlackList
   * @summary Remove user from BL
   * @request PATCH:/api/v1/users/{id}/remove_from_black_list
   * @secure
   */
  export namespace RemoveUserFromBlackList {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = RemoveUserFromBlackListData;
  }
}

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from 'axios';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || 'http://{defaultHost}' });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === 'object' && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== 'string') {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title API V1
 * @version v1
 * @baseUrl http://{defaultHost}
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Cities
     * @name FetchCountryCities
     * @summary return cities by country
     * @request GET:/api/v1/cities
     * @secure
     */
    fetchCountryCities: (country: string, params: RequestParams = {}) =>
      this.request<FetchCountryCitiesData, any>({
        path: `/api/v1/cities`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Cities
     * @name FetchCountries
     * @summary return all countries
     * @request GET:/api/v1/cities/country
     * @secure
     */
    fetchCountries: (params: RequestParams = {}) =>
      this.request<FetchCountriesData, any>({
        path: `/api/v1/cities/country`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Dialogs
     * @name DialogSendMessage
     * @summary creates message
     * @request POST:/api/v1/dialogs/{id}/send_message
     * @secure
     */
    dialogSendMessage: (id: string, data: DialogSendMessagePayload, params: RequestParams = {}) =>
      this.request<DialogSendMessageData, DialogSendMessageError>({
        path: `/api/v1/dialogs/${id}/send_message`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Dialogs
     * @name FetchUserDialogs
     * @summary return dialogs
     * @request GET:/api/v1/users/{id}/dialogs
     * @secure
     */
    fetchUserDialogs: (id: string, params: RequestParams = {}) =>
      this.request<FetchUserDialogsData, FetchUserDialogsError>({
        path: `/api/v1/users/${id}/dialogs`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Dialogs
     * @name FetchDialog
     * @summary return dialog
     * @request GET:/api/v1/dialogs/{id}
     * @secure
     */
    fetchDialog: (id: string, params: RequestParams = {}) =>
      this.request<FetchDialogData, FetchDialogError>({
        path: `/api/v1/dialogs/${id}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Dialogs
     * @name FetchDialogMessages
     * @summary return dialog messages
     * @request GET:/api/v1/dialogs/{id}/messages
     * @secure
     */
    fetchDialogMessages: (id: string, params: RequestParams = {}) =>
      this.request<FetchDialogMessagesData, FetchDialogMessagesError>({
        path: `/api/v1/dialogs/${id}/messages`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Dialogs
     * @name ReadDialogMessages
     * @summary read messages by ids
     * @request PATCH:/api/v1/users/{user_id}/dialogs/{id}/read_messages
     * @secure
     */
    readDialogMessages: (userId: string, id: string, data: ReadDialogMessagesPayload, params: RequestParams = {}) =>
      this.request<ReadDialogMessagesData, any>({
        path: `/api/v1/users/${userId}/dialogs/${id}/read_messages`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Meets
     * @name FetchMeets
     * @summary Search persons
     * @request GET:/api/v1/meets
     */
    fetchMeets: (query: FetchMeetsParams, params: RequestParams = {}) =>
      this.request<FetchMeetsData, any>({
        path: `/api/v1/meets`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Meets
     * @name InitiateMeet
     * @summary initiate meet
     * @request POST:/api/v1/meets/{id}/initiate
     * @secure
     */
    initiateMeet: (id: string, params: RequestParams = {}) =>
      this.request<InitiateMeetData, InitiateMeetError>({
        path: `/api/v1/meets/${id}/initiate`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Meets
     * @name ConfirmMeet
     * @summary confirm meet
     * @request POST:/api/v1/meets/{id}/confirm
     * @secure
     */
    confirmMeet: (id: string, data: ConfirmMeetPayload, params: RequestParams = {}) =>
      this.request<ConfirmMeetData, ConfirmMeetError>({
        path: `/api/v1/meets/${id}/confirm`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Meets
     * @name DeclineMeet
     * @summary decline meet
     * @request DELETE:/api/v1/meets/{id}/decline
     * @secure
     */
    declineMeet: (id: string, data: DeclineMeetPayload, params: RequestParams = {}) =>
      this.request<DeclineMeetData, DeclineMeetError>({
        path: `/api/v1/meets/${id}/decline`,
        method: 'DELETE',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Notifications
     * @name FetchUserNotifications
     * @summary return notifications
     * @request GET:/api/v1/users/{id}/notifications
     * @secure
     */
    fetchUserNotifications: (id: string, params: RequestParams = {}) =>
      this.request<FetchUserNotificationsData, FetchUserNotificationsError>({
        path: `/api/v1/users/${id}/notifications`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Notifications
     * @name CloseNotification
     * @summary close notify
     * @request PATCH:/api/v1/notifications/{id}/close
     * @secure
     */
    closeNotification: (id: string, params: RequestParams = {}) =>
      this.request<CloseNotificationData, CloseNotificationError>({
        path: `/api/v1/notifications/${id}/close`,
        method: 'PATCH',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Sessions
     * @name OpenSession
     * @summary Creates a session
     * @request POST:/api/v1/sessions
     * @secure
     */
    openSession: (data: OpenSessionPayload, params: RequestParams = {}) =>
      this.request<OpenSessionData, OpenSessionError>({
        path: `/api/v1/sessions`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Sessions
     * @name RefreshSession
     * @summary Refresh session
     * @request POST:/api/v1/sessions/refresh
     * @secure
     */
    refreshSession: (data: RefreshSessionPayload, params: RequestParams = {}) =>
      this.request<RefreshSessionData, RefreshSessionError>({
        path: `/api/v1/sessions/refresh`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Sessions
     * @name CloseSession
     * @summary Delete session
     * @request DELETE:/api/v1/sessions/logout
     * @secure
     */
    closeSession: (params: RequestParams = {}) =>
      this.request<CloseSessionData, void>({
        path: `/api/v1/sessions/logout`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name CreateUser
     * @summary Creates a user
     * @request POST:/api/v1/users
     * @secure
     */
    createUser: (data: CreateUserPayload, params: RequestParams = {}) =>
      this.request<CreateUserData, CreateUserError>({
        path: `/api/v1/users`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name FetchUsers
     * @summary Return users list
     * @request GET:/api/v1/users
     * @secure
     */
    fetchUsers: (params: RequestParams = {}) =>
      this.request<FetchUsersData, any>({
        path: `/api/v1/users`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name ResendConfirmMail
     * @summary Resend confirmation mail
     * @request POST:/api/v1/users/resend_confirmation
     * @secure
     */
    resendConfirmMail: (data: ResendConfirmMailPayload, params: RequestParams = {}) =>
      this.request<ResendConfirmMailData, ResendConfirmMailError>({
        path: `/api/v1/users/resend_confirmation`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name FetchUser
     * @summary Return user
     * @request GET:/api/v1/users/{id}
     * @secure
     */
    fetchUser: (id: string, params: RequestParams = {}) =>
      this.request<FetchUserData, FetchUserError>({
        path: `/api/v1/users/${id}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UpdateUser
     * @summary Update user
     * @request PATCH:/api/v1/users/{id}
     * @secure
     */
    updateUser: (id: string, data: UpdateUserPayload, params: RequestParams = {}) =>
      this.request<UpdateUserData, any>({
        path: `/api/v1/users/${id}`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name ConfirmAccount
     * @summary Confirm account
     * @request GET:/api/v1/users/{id}/confirm_account
     * @secure
     */
    confirmAccount: (id: string, params: RequestParams = {}) =>
      this.request<ConfirmAccountData, ConfirmAccountError>({
        path: `/api/v1/users/${id}/confirm_account`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name FetchCurrentUser
     * @summary Return current user
     * @request GET:/api/v1/users/me
     * @secure
     */
    fetchCurrentUser: (params: RequestParams = {}) =>
      this.request<FetchCurrentUserData, FetchCurrentUserError>({
        path: `/api/v1/users/me`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name LoadAvatar
     * @summary Load user avatar
     * @request PATCH:/api/v1/users/{id}/load_avatar
     * @secure
     */
    loadAvatar: (id: string, data: AvatarFile, params: RequestParams = {}) =>
      this.request<LoadAvatarData, any>({
        path: `/api/v1/users/${id}/load_avatar`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name AddUserToBlackList
     * @summary Added user to BL
     * @request PATCH:/api/v1/users/{id}/add_to_black_list
     * @secure
     */
    addUserToBlackList: (id: string, params: RequestParams = {}) =>
      this.request<AddUserToBlackListData, any>({
        path: `/api/v1/users/${id}/add_to_black_list`,
        method: 'PATCH',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name RemoveUserFromBlackList
     * @summary Remove user from BL
     * @request PATCH:/api/v1/users/{id}/remove_from_black_list
     * @secure
     */
    removeUserFromBlackList: (id: string, params: RequestParams = {}) =>
      this.request<RemoveUserFromBlackListData, any>({
        path: `/api/v1/users/${id}/remove_from_black_list`,
        method: 'PATCH',
        secure: true,
        ...params,
      }),
  };
}
