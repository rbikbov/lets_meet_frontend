export interface BaseHttpResponse<Data = never> {
  readonly status: number;
  readonly data: Data;
}

export interface BaseHttpService {
  get<T>(url: string): Promise<BaseHttpResponse<T>>;
  post<Request, Response>(
    url: string,
    data: Request
  ): Promise<BaseHttpResponse<Response>>;
}
