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
};

export interface ProfileDataUser {
  first_name?: string;
  last_name?: string;
  age?: number;
  gender?: GenderType;
}

export interface AvatarFile {
  avatar?: File;
}

export interface User {
  id: IdNumber;
  /** @format email */
  email: string;
  first_name?: string;
  last_name?: string;
  age?: number;
  gender?: GenderType;
  avatar?: string;
  likes?: IdNumber[];
}

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

export type UsersArray = User[];

export interface V1SessionsCreatePayload {
  user: SigninRequestDataUser;
}

export type V1SessionsCreateData = AccessToken;

export interface V1SessionsRefreshCreatePayload {
  token: string;
}

export type V1SessionsRefreshCreateData = AccessToken;

export type V1SessionsLogoutDeleteData = any;

export interface V1UsersCreatePayload {
  user?: SignupRequestDataUser;
}

export type V1UsersCreateData = any;

export type V1UsersCreateError = {
  errors?: InvalidUser;
};

export type V1UsersListData = UsersArray;

export type V1UsersDetailData = User;

export interface V1UsersPartialUpdatePayload {
  profile?: ProfileDataUser;
}

export type V1UsersPartialUpdateData = User;

export type V1UsersConfirmAccountDetailData = any;

export type V1UsersLoadAvatarPartialUpdateData = User;

export namespace Api {
  /**
   * No description
   * @tags Sessions
   * @name V1SessionsCreate
   * @summary Creates a session
   * @request POST:/api/v1/sessions
   * @secure
   */
  export namespace V1SessionsCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = V1SessionsCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = V1SessionsCreateData;
  }
  /**
   * No description
   * @tags Sessions
   * @name V1SessionsRefreshCreate
   * @summary Refresh session
   * @request POST:/api/v1/sessions/refresh
   * @secure
   */
  export namespace V1SessionsRefreshCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = V1SessionsRefreshCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = V1SessionsRefreshCreateData;
  }
  /**
   * No description
   * @tags Sessions
   * @name V1SessionsLogoutDelete
   * @summary Delete session
   * @request DELETE:/api/v1/sessions/logout
   * @secure
   */
  export namespace V1SessionsLogoutDelete {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = V1SessionsLogoutDeleteData;
  }
  /**
   * No description
   * @tags Users
   * @name V1UsersCreate
   * @summary Creates a user
   * @request POST:/api/v1/users
   * @secure
   */
  export namespace V1UsersCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = V1UsersCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = V1UsersCreateData;
  }
  /**
   * No description
   * @tags Users
   * @name V1UsersList
   * @summary Return users list
   * @request GET:/api/v1/users
   * @secure
   */
  export namespace V1UsersList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = V1UsersListData;
  }
  /**
   * No description
   * @tags Users
   * @name V1UsersDetail
   * @summary Return user
   * @request GET:/api/v1/users/{id}
   * @secure
   */
  export namespace V1UsersDetail {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = V1UsersDetailData;
  }
  /**
   * No description
   * @tags Users
   * @name V1UsersPartialUpdate
   * @summary Update user
   * @request PATCH:/api/v1/users/{id}
   * @secure
   */
  export namespace V1UsersPartialUpdate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = V1UsersPartialUpdatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = V1UsersPartialUpdateData;
  }
  /**
   * No description
   * @tags Users
   * @name V1UsersConfirmAccountDetail
   * @summary Confirm account
   * @request GET:/api/v1/users/{id}/confirm_account
   * @secure
   */
  export namespace V1UsersConfirmAccountDetail {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = V1UsersConfirmAccountDetailData;
  }
  /**
   * No description
   * @tags Users
   * @name V1UsersLoadAvatarPartialUpdate
   * @summary Load user avatar
   * @request PATCH:/api/v1/users/{id}/load_avatar
   * @secure
   */
  export namespace V1UsersLoadAvatarPartialUpdate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = AvatarFile;
    export type RequestHeaders = {};
    export type ResponseBody = V1UsersLoadAvatarPartialUpdateData;
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
     * @tags Sessions
     * @name V1SessionsCreate
     * @summary Creates a session
     * @request POST:/api/v1/sessions
     * @secure
     */
    v1SessionsCreate: (data: V1SessionsCreatePayload, params: RequestParams = {}) =>
      this.request<V1SessionsCreateData, void>({
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
     * @name V1SessionsRefreshCreate
     * @summary Refresh session
     * @request POST:/api/v1/sessions/refresh
     * @secure
     */
    v1SessionsRefreshCreate: (data: V1SessionsRefreshCreatePayload, params: RequestParams = {}) =>
      this.request<V1SessionsRefreshCreateData, void>({
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
     * @name V1SessionsLogoutDelete
     * @summary Delete session
     * @request DELETE:/api/v1/sessions/logout
     * @secure
     */
    v1SessionsLogoutDelete: (params: RequestParams = {}) =>
      this.request<V1SessionsLogoutDeleteData, void>({
        path: `/api/v1/sessions/logout`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name V1UsersCreate
     * @summary Creates a user
     * @request POST:/api/v1/users
     * @secure
     */
    v1UsersCreate: (data: V1UsersCreatePayload, params: RequestParams = {}) =>
      this.request<V1UsersCreateData, V1UsersCreateError>({
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
     * @name V1UsersList
     * @summary Return users list
     * @request GET:/api/v1/users
     * @secure
     */
    v1UsersList: (params: RequestParams = {}) =>
      this.request<V1UsersListData, any>({
        path: `/api/v1/users`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name V1UsersDetail
     * @summary Return user
     * @request GET:/api/v1/users/{id}
     * @secure
     */
    v1UsersDetail: (id: string, params: RequestParams = {}) =>
      this.request<V1UsersDetailData, void>({
        path: `/api/v1/users/${id}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name V1UsersPartialUpdate
     * @summary Update user
     * @request PATCH:/api/v1/users/{id}
     * @secure
     */
    v1UsersPartialUpdate: (id: string, data: V1UsersPartialUpdatePayload, params: RequestParams = {}) =>
      this.request<V1UsersPartialUpdateData, any>({
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
     * @name V1UsersConfirmAccountDetail
     * @summary Confirm account
     * @request GET:/api/v1/users/{id}/confirm_account
     * @secure
     */
    v1UsersConfirmAccountDetail: (id: string, params: RequestParams = {}) =>
      this.request<V1UsersConfirmAccountDetailData, void>({
        path: `/api/v1/users/${id}/confirm_account`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name V1UsersLoadAvatarPartialUpdate
     * @summary Load user avatar
     * @request PATCH:/api/v1/users/{id}/load_avatar
     * @secure
     */
    v1UsersLoadAvatarPartialUpdate: (id: string, data: AvatarFile, params: RequestParams = {}) =>
      this.request<V1UsersLoadAvatarPartialUpdateData, any>({
        path: `/api/v1/users/${id}/load_avatar`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),
  };
}
