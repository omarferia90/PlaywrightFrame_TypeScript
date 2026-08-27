import dotenv from 'dotenv';

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const env = {
  get baseUrl(): string {
    return required('BASE_URL');
  },
  get apiBaseUrl(): string {
    return required('API_BASE_URL');
  },
  get testUser(): { email: string; password: string } {
    return {
      email: required('TEST_USER_EMAIL'),
      password: required('TEST_USER_PASSWORD'),
    };
  },
};
