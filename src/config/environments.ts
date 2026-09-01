import dotenv from 'dotenv';
dotenv.config();

export type Environment = 'uat' | 'demo' | 'dev' | 'qa' ;

const environments: Record<Environment, { baseUrl: string; apiBaseUrl: string }> = {
  uat: { baseUrl: 'https://www.saucedemo.com', apiBaseUrl: 'https://automationexercise.com' },
  demo: { baseUrl: 'https://www.saucedemo.com', apiBaseUrl: 'https://automationexercise.com' },
  dev: { baseUrl: 'https://www.saucedemo.com', apiBaseUrl: 'https://automationexercise.com' },
  qa: { baseUrl: 'https://www.saucedemo.com', apiBaseUrl: 'https://automationexercise.com' },
};

function resolveEnvironment(): Environment {
  const key = (process.env.TEST_ENV as Environment | undefined) ?? 'qa';
  if (!(key in environments)) {
    throw new Error(
      `Unknown TEST_ENV "${process.env.TEST_ENV}". Expected one of: ${Object.keys(environments).join(', ')}`,
    );
  }
  return key;
}

export const activeEnvironment = environments[resolveEnvironment()];
