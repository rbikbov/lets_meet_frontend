import type {
  BaseHttpResponse,
  BaseHttpService,
} from '@/types/services/HttpService';

export class HttpService implements BaseHttpService {
  async get<T>(url: string): Promise<BaseHttpResponse<T>> {
    const response = await fetch(url);
    const data = await response.json();
    return {
      status: response.status,
      data,
    };
  }

  async post<Request, Response>(
    url: string,
    data: Request
  ): Promise<BaseHttpResponse<Response>> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    return {
      status: response.status,
      data: responseData,
    };
  }
}
