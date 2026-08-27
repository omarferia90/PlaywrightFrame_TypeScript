export interface ClaimTestData {
    claimNumber: string;
    status: 'open' | 'closed' | 'pending';
    amount: number;
  }
  
  export const validClaim: ClaimTestData = {
    claimNumber: 'CLM-000123',
    status: 'open',
    amount: 1500,
  };
  