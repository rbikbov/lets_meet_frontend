import type { AuthSigninRequest } from '@/types/api/authSigninRequest';
import type {
  BaseHttpResponse,
  BaseHttpService,
} from '@/types/services/HttpService';

export class AuthApiService {
  static BASE_URL = 'http://localhost:3000/api/v1';
  static sessionsUrl = `${AuthApiService.BASE_URL}/sessions`;

  constructor(private httpService: BaseHttpService) {}

  async signIn(data: {
    user: AuthSigninRequest;
  }): Promise<BaseHttpResponse<string>> {
    return this.httpService.post(AuthApiService.sessionsUrl, data);
  }
}
