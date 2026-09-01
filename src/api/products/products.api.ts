import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from '../base/base.api';
import { logStep } from '../../utils/decorators';

  export interface ProductCategory {
    usertype: { usertype: string };
    category: string;
  }
  
  export interface Product {
    id: number;
    name: string;
    price: string;
    brand: string;
    category: ProductCategory;
  }
  
  export interface ProductsListResponse {
    responseCode: number;
    products: Product[];
  }
  
  export class ProductsApi extends BaseApiClient {
    constructor(request: APIRequestContext) {
      super(request);
    }
  
    @logStep('Get all products via API')
    async getProductsList(): Promise<APIResponse> {
      const origin = this.baseUrl.replace(/\/$/, '');
      return this.request.get(`${origin}/api/productsList`);
    }
  }