function required(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Missing required env var: ${name}`);
    return value;
  }
  
  export const env = {
    baseUrl: required('BASE_URL'),
    apiBaseUrl: required('API_BASE_URL'),
    testUser: {
      email: required('TEST_USER_EMAIL'),
      password: required('TEST_USER_PASSWORD'),
    },
  } as const;
  