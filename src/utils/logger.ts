import { expect, Locator, APIResponse } from '@playwright/test';

export async function assertVisible(
  locator: Locator,
  label: string,
  module = 'Test',
): Promise<void> {
  try {
    await expect(locator, `${label} should be visible`).toBeVisible();
    console.log(`[${module}] ✅ ${label} is visible.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} was not found.`);
    throw err;
  }
}

export async function assertHidden(
  locator: Locator,
  label: string,
  module = 'Test',
): Promise<void> {
  try {
    await expect(locator, `${label} should be hidden`).toBeHidden();
    console.log(`[${module}] ✅ ${label} is hidden as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} was still visible.`);
    throw err;
  }
}

export async function assertText(
  locator: Locator,
  expected: string,
  label: string,
  module = 'Test',
): Promise<void> {
  try {
    await expect(locator, `${label} should have text "${expected}"`).toHaveText(expected);
    console.log(`[${module}] ✅ ${label} has expected text "${expected}".`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} did not have expected text "${expected}".`);
    throw err;
  }
}

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
