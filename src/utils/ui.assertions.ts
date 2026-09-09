import { expect, Locator, Page } from '@playwright/test';

function formatValue(value: unknown): string {
  if (value instanceof RegExp) {
    return value.toString();
  }
  if (typeof value === 'string') {
    return value;
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export async function assertVisible(
  locator: Locator,
  label: string | RegExp,
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
  label: string | RegExp,
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

export async function assertAttached(
  locator: Locator,
  label: string | RegExp,
  module = 'Test',
): Promise<void> {
  try {
    await expect(locator, `${label} should be attached to the DOM`).toBeAttached();
    console.log(`[${module}] ✅ ${label} is attached to the DOM as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} was not attached to the DOM, please review the page.`);
    throw err;
  }
}

export async function assertEnabled(
  locator: Locator,
  label: string | RegExp,
  module = 'Test',
): Promise<void> {
  try {
    await expect(locator, `${label} should be enabled`).toBeEnabled();
    console.log(`[${module}] ✅ ${label} is enabled as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} was not enabled, please review the page.`);
    throw err;
  }
}

export async function assertDisabled(
  locator: Locator,
  label: string | RegExp,
  module = 'Test',
): Promise<void> {
  try {
    await expect(locator, `${label} should be disabled`).toBeDisabled();
    console.log(`[${module}] ✅ ${label} is disabled as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} was not disabled, please review the page.`);
    throw err;
  }
}

export async function assertFocused(
  locator: Locator,
  label: string | RegExp,
  module = 'Test',
): Promise<void> {
  try {
    await expect(locator, `${label} should be focused`).toBeFocused();
    console.log(`[${module}] ✅ ${label} is focused as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} was not focused, please review the page.`);
    throw err;
  }
}

export async function assertText(
  locator: Locator,
  expected: string | RegExp,
  label: string | RegExp,
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

export async function assertTextContains(
  locator: Locator,
  expected: string | RegExp,
  label: string | RegExp,
  module = 'Test',
): Promise<void> {
  try {
    await expect(locator, `${label} should contain text "${expected}"`).toContainText(expected);
    console.log(`[${module}] ✅ ${label} contains expected text "${expected}".`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} did not contain expected text "${expected}".`);
    throw err;
  }
}

export async function assertCss(
  locator: Locator,
  name: string,
  value: string | RegExp,
  label: string | RegExp,
  module = 'Test',
): Promise<void> {
  try {
    await expect(locator, `${label} should have CSS ${name} "${formatValue(value)}"`).toHaveCSS(name, value);
    console.log(`[${module}] ✅ ${label} has CSS ${name} "${formatValue(value)}" as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} did not have CSS ${name} "${formatValue(value)}".`);
    throw err;
  }
}

export async function assertUrl(
  page: Page,
  expected: string | RegExp,
  label: string | RegExp,
  module = 'Test',
): Promise<void> {
  try {
    await expect(page, `${label} should have URL "${formatValue(expected)}"`).toHaveURL(expected);
    console.log(`[${module}] ✅ ${label} has URL "${formatValue(expected)}" as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} did not have URL "${formatValue(expected)}".`);
    throw err;
  }
}

export async function assertTitle(
  page: Page,
  expected: string | RegExp,
  label: string | RegExp,
  module = 'Test',
): Promise<void> {
  try {
    await expect(page, `${label} should have title "${formatValue(expected)}"`).toHaveTitle(expected);
    console.log(`[${module}] ✅ ${label} has title "${formatValue(expected)}" as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} did not have title "${formatValue(expected)}".`);
    throw err;
  }
}

export async function assertCount(
  locator: Locator,
  expected: number,
  label: string | RegExp,
  module = 'Test',
): Promise<void> {
  try {
    await expect(locator, `${label} should have count ${expected}`).toHaveCount(expected);
    console.log(`[${module}] ✅ ${label} has count ${expected} as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} did not have count ${expected}.`);
    throw err;
  }
}

export async function assertValue(
  locator: Locator,
  expected: string | RegExp,
  label: string | RegExp,
  module = 'Test',
): Promise<void> {
  try {
    await expect(locator, `${label} should have value "${formatValue(expected)}"`).toHaveValue(expected);
    console.log(`[${module}] ✅ ${label} has value "${formatValue(expected)}" as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} did not have value "${formatValue(expected)}".`);
    throw err;
  }
}

export async function assertAttribute(
  locator: Locator,
  name: string,
  expected: string | RegExp,
  label: string | RegExp,
  module = 'Test',
): Promise<void> {
  try {
    await expect(locator, `${label} should have attribute ${name} "${formatValue(expected)}"`).toHaveAttribute(name, expected);
    console.log(`[${module}] ✅ ${label} has attribute ${name} "${formatValue(expected)}" as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} did not have attribute ${name} "${formatValue(expected)}".`);
    throw err;
  }
}

export async function assertClass(
  locator: Locator,
  expected: string | RegExp | Array<string | RegExp>,
  label: string | RegExp,
  module = 'Test',
): Promise<void> {
  try {
    await expect(locator, `${label} should have class "${formatValue(expected)}"`).toHaveClass(expected);
    console.log(`[${module}] ✅ ${label} has class "${formatValue(expected)}" as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} did not have class "${formatValue(expected)}".`);
    throw err;
  }
}

export async function assertChecked(
  locator: Locator,
  label: string | RegExp,
  module = 'Test',
): Promise<void> {
  try {
    await expect(locator, `${label} should be checked`).toBeChecked();
    console.log(`[${module}] ✅ ${label} is checked as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} was not checked, please review the page.`);
    throw err;
  }
}

export async function assertEmpty(
  locator: Locator,
  label: string | RegExp,
  module = 'Test',
): Promise<void> {
  try {
    await expect(locator, `${label} should be empty`).toBeEmpty();
    console.log(`[${module}] ✅ ${label} is empty as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} was not empty, please review the page.`);
    throw err;
  }
}

export function assertToBe(
  actual: unknown,
  expected: unknown,
  label: string,
  module = 'Test',
): void {
  try {
    expect(actual, `${label} should be ${formatValue(expected)}`).toBe(expected);
    console.log(`[${module}] ✅ ${label} is ${formatValue(expected)} as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} was ${formatValue(actual)}, expected ${formatValue(expected)}.`);
    throw err;
  }
}

export function assertNotToBe(
  actual: unknown,
  expected: unknown,
  label: string,
  module = 'Test',
): void {
  try {
    expect(actual, `${label} should not be ${formatValue(expected)}`).not.toBe(expected);
    console.log(`[${module}] ✅ ${label} is not ${formatValue(expected)} as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} was ${formatValue(actual)}, expected not to be ${formatValue(expected)}.`);
    throw err;
  }
}

export function assertEqual(
  actual: unknown,
  expected: unknown,
  label: string,
  module = 'Test',
): void {
  try {
    expect(actual, `${label} should equal ${formatValue(expected)}`).toEqual(expected);
    console.log(`[${module}] ✅ ${label} equals ${formatValue(expected)} as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} was ${formatValue(actual)}, expected ${formatValue(expected)}.`);
    throw err;
  }
}

export function assertNotEqual(
  actual: unknown,
  expected: unknown,
  label: string,
  module = 'Test',
): void {
  try {
    expect(actual, `${label} should not equal ${formatValue(expected)}`).not.toEqual(expected);
    console.log(`[${module}] ✅ ${label} does not equal ${formatValue(expected)} as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} was ${formatValue(actual)}, expected not to equal ${formatValue(expected)}.`);
    throw err;
  }
}

export function assertContains(
  actual: string | readonly unknown[],
  expected: unknown,
  label: string,
  module = 'Test',
): void {
  try {
    expect(actual, `${label} should contain ${formatValue(expected)}`).toContain(expected);
    console.log(`[${module}] ✅ ${label} contains ${formatValue(expected)} as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} did not contain ${formatValue(expected)}.`);
    throw err;
  }
}

export function assertMatch(
  actual: string,
  expected: RegExp,
  label: string,
  module = 'Test',
): void {
  try {
    expect(actual, `${label} should match ${formatValue(expected)}`).toMatch(expected);
    console.log(`[${module}] ✅ ${label} matches ${formatValue(expected)} as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} "${actual}" did not match ${formatValue(expected)}.`);
    throw err;
  }
}

export function assertNotMatch(
  actual: string,
  expected: RegExp,
  label: string,
  module = 'Test',
): void {
  try {
    expect(actual, `${label} should not match ${formatValue(expected)}`).not.toMatch(expected);
    console.log(`[${module}] ✅ ${label} does not match ${formatValue(expected)} as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} "${actual}" matched ${formatValue(expected)} but should not.`);
    throw err;
  }
}

export function assertTruthy(
  actual: unknown,
  label: string,
  module = 'Test',
): void {
  try {
    expect(actual, `${label} should be truthy`).toBeTruthy();
    console.log(`[${module}] ✅ ${label} is truthy as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} was falsy (${formatValue(actual)}).`);
    throw err;
  }
}

export function assertFalsy(
  actual: unknown,
  label: string,
  module = 'Test',
): void {
  try {
    expect(actual, `${label} should be falsy`).toBeFalsy();
    console.log(`[${module}] ✅ ${label} is falsy as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} was truthy (${formatValue(actual)}).`);
    throw err;
  }
}

export function assertGreaterThan(
  actual: number,
  expected: number,
  label: string,
  module = 'Test',
): void {
  try {
    expect(actual, `${label} should be greater than ${expected}`).toBeGreaterThan(expected);
    console.log(`[${module}] ✅ ${label} (${actual}) is greater than ${expected} as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} was ${actual}, expected greater than ${expected}.`);
    throw err;
  }
}

export function assertGreaterThanOrEqual(
  actual: number,
  expected: number,
  label: string,
  module = 'Test',
): void {
  try {
    expect(actual, `${label} should be greater than or equal to ${expected}`).toBeGreaterThanOrEqual(expected);
    console.log(`[${module}] ✅ ${label} (${actual}) is greater than or equal to ${expected} as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} was ${actual}, expected greater than or equal to ${expected}.`);
    throw err;
  }
}

export function assertLessThan(
  actual: number,
  expected: number,
  label: string,
  module = 'Test',
): void {
  try {
    expect(actual, `${label} should be less than ${expected}`).toBeLessThan(expected);
    console.log(`[${module}] ✅ ${label} (${actual}) is less than ${expected} as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} was ${actual}, expected less than ${expected}.`);
    throw err;
  }
}

export function assertLessThanOrEqual(
  actual: number,
  expected: number,
  label: string,
  module = 'Test',
): void {
  try {
    expect(actual, `${label} should be less than or equal to ${expected}`).toBeLessThanOrEqual(expected);
    console.log(`[${module}] ✅ ${label} (${actual}) is less than or equal to ${expected} as expected.`);
  } catch (err) {
    console.log(`[${module}] ❌ ${label} was ${actual}, expected less than or equal to ${expected}.`);
    throw err;
  }
}