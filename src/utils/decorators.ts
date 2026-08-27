import { test } from '@playwright/test';

type Method = (...args: any[]) => any;

export function logStep(stepName?: string) {
  return function (originalMethod: Method, context: ClassMethodDecoratorContext) {
    const name = stepName ?? String(context.name);

    return async function (this: unknown, ...args: any[]) {
      return test.step(name, async () => originalMethod.apply(this, args));
    };
  };
}

export function retry(times = 2, delayMs = 500) {
  return function (originalMethod: Method, context: ClassMethodDecoratorContext) {
    const propertyKey = String(context.name);

    return async function (this: unknown, ...args: any[]) {
      let lastError: unknown;
      for (let attempt = 1; attempt <= times; attempt++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (err) {
          lastError = err;
          console.log(
            `[Retry] ⚠️ ${propertyKey} failed on attempt ${attempt}/${times}.`,
          );
          if (attempt < times) await new Promise((r) => setTimeout(r, delayMs));
        }
      }
      throw lastError;
    };
  };
}
