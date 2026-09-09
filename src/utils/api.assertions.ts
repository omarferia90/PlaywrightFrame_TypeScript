import { expect, APIResponse } from '@playwright/test';

export function assertApiOk(
  response: APIResponse,
  label: string,
  module = 'API',
): void {
  const ok = response.ok();
  const icon = ok ? '✅' : '❌';
  console.log(`[${module}] ${icon} ${label} — status ${response.status()}.`);
  expect(ok, `${label} should return a 2xx status`).toBeTruthy();
}

export function logApiResponse(body: unknown, label: string, module = 'API'): void {
  console.log(`[${module}] ${label}:\n${JSON.stringify(body, null, 2)}`);
}