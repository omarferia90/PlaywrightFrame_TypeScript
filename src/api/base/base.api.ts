import { APIRequestContext } from '@playwright/test';
import { env } from '../../utils/env';

export abstract class BaseApiClient {
  constructor(protected readonly request: APIRequestContext) {}

  protected get baseUrl(): string {
    return env.apiBaseUrl;
  }
}
