import { test } from '@playwright/test';

type Method = (...args: any[]) => any;

type CompatibleMethodDecorator = {
  (originalMethod: Method, context: ClassMethodDecoratorContext): Method;
  (target: object, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor;
};

function wrapWithStep(originalMethod: Method, name: string): Method {
  return async function (this: any, ...args: any[]) {
    return test.step(name, async () => originalMethod.apply(this, args));
  };
}

function wrapWithRetry(
  originalMethod: Method,
  propertyKey: string,
  times: number,
  delayMs: number,
): Method {
  return async function (this: any, ...args: any[]) {
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
}

function isNativeContext(
  contextOrKey: ClassMethodDecoratorContext | string,
): contextOrKey is ClassMethodDecoratorContext {
  return typeof contextOrKey === 'object' && contextOrKey !== null;
}

export function logStep(stepName?: string): CompatibleMethodDecorator {
  return ((
    targetOrMethod: Method | object,
    contextOrKey: ClassMethodDecoratorContext | string,
    descriptor?: PropertyDescriptor,
  ) => {
    if (isNativeContext(contextOrKey)) {
      const name = stepName ?? String(contextOrKey.name);
      return wrapWithStep(targetOrMethod as Method, name);
    }

    const name =
      stepName ?? `${(targetOrMethod as object).constructor.name}.${String(contextOrKey)}`;
    descriptor!.value = wrapWithStep(descriptor!.value, name);
    return descriptor;
  }) as CompatibleMethodDecorator;
}

export function retry(times = 2, delayMs = 500): CompatibleMethodDecorator {
  return ((
    targetOrMethod: Method | object,
    contextOrKey: ClassMethodDecoratorContext | string,
    descriptor?: PropertyDescriptor,
  ) => {
    if (isNativeContext(contextOrKey)) {
      return wrapWithRetry(
        targetOrMethod as Method,
        String(contextOrKey.name),
        times,
        delayMs,
      );
    }

    descriptor!.value = wrapWithRetry(
      descriptor!.value,
      String(contextOrKey),
      times,
      delayMs,
    );
    return descriptor;
  }) as CompatibleMethodDecorator;
}
