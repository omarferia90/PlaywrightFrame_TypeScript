type Environment = 'dev' | 'qa' ;

const environments: Record<Environment, { baseUrl: string; apiBaseUrl: string }> = {
  dev: { baseUrl: 'https://dev.example.com', apiBaseUrl: 'https://api-dev.example.com' },
  qa: { baseUrl: 'https://qa.example.com', apiBaseUrl: 'https://api-qa.example.com' },
};

const current = (process.env.TEST_ENV as Environment) ?? 'qa';
export const activeEnvironment = environments[current];
