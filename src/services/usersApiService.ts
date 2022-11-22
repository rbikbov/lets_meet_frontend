import type { AuthSignupRequest } from '@/types/api/authSignupRequest';
import type { UserEntry } from '@/types/entries/Users';
import type {
  BaseHttpResponse,
  BaseHttpService,
} from '@/types/services/HttpService';

export class UsersApiService {
  static BASE_URL = 'http://localhost:3000/api/v1';
  static usersUrl = `${UsersApiService.BASE_URL}/users`;

  constructor(private httpService: BaseHttpService) {}

  async getAll(): Promise<BaseHttpResponse<UserEntry[]>> {
    return this.httpService.get<UserEntry[]>(UsersApiService.usersUrl);
  }
  async create(data: {
    user: AuthSignupRequest;
  }): Promise<BaseHttpResponse<string>> {
    return this.httpService.post(UsersApiService.usersUrl, data);
  }
}
