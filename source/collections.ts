import { coerce, is } from "./is.ts";
import { type TypeOf, typeOf } from "./type-of.ts";
import type { Any, Defined, Expand, KeyOf } from "./typings.ts";

defineValue.ALLOWED_TYPES = Object.freeze(["object", "function"] as TypeOf[]);

export function defineValue<T extends object, K extends keyof T, V = unknown>(
  obj: T,
  key: K,
  descriptor?: PropertyDescriptor,
  value?: V,
): WithProperty<T, K, V> {
  if (!defineValue.ALLOWED_TYPES.includes(typeOf(obj))) {
    throw new TypeError(`First argument MUST BE one of: ${defineValue.ALLOWED_TYPES.join(", ")}.`, {
      cause: {
        received: {
          value: obj,
          type: typeOf(obj),
        },
      },
    });
  }

  if (!descriptor) {
    Object.getOwnPropertyDescriptor(obj, key) as PropertyDescriptor;
  }

  if (is.not.undefined(value)) {
    (descriptor as PropertyDescriptor).value = value;
  }

  return coerce(Object.defineProperty(obj, key, descriptor as PropertyDescriptor));
}

export type WithProperty<T, K extends keyof T, V> = Expand<
  Omit<T, K> & {
    [P in K]: V;
  }
>;

export function getUnique<T extends Any.Array>(list: T): T {
  return Array.from(new Set(list)) as T;
}

/**
 * Checks if the given value is defined (not `undefined`), and returns it; otherwise, returns the provided fallback
 * value.
 *
 * @param value    - The value to check.
 * @param fallback - The fallback value to return if the given value is `undefined`.
 * @returns The given value if it is defined, or the fallback value if the given value is `undefined`.
 */
export function or<T, U extends Defined<T>>(value: T, fallback: U): Defined<T> {
  if (is.undefined(value)) return fallback;

  return value as Defined<T>;
}
