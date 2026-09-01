import { activeEnvironment } from '../config/environments';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const env = {
  get baseUrl(): string {
    return activeEnvironment.baseUrl;
  },
  get apiBaseUrl(): string {
    return activeEnvironment.apiBaseUrl;
  },
  get testUser(): { email: string; password: string } {
    return {
      email: required('TEST_USER_EMAIL'),
      password: required('TEST_USER_PASSWORD'),
    };
  },
};
