import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from '../base/base.api';
import { logStep } from '../../utils/decorators';

export interface CreateClaimPayload {
  claimNumber: string;
  amount: number;
}

export class ClaimsApi extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  @logStep('Create claim via API')
  async createClaim(payload: CreateClaimPayload): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}/claims`, { data: payload });
  }

  @logStep('Get claim by number via API')
  async getClaim(claimNumber: string): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}/claims/${claimNumber}`);
  }

  @logStep('Delete claim via API')
  async deleteClaim(claimNumber: string): Promise<APIResponse> {
    return this.request.delete(`${this.baseUrl}/claims/${claimNumber}`);
  }
}
