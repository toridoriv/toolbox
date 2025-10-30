import { type TypeOf, typeOf } from "./type-of.ts";
import type { Any, Expand, KeyOf, Primitive } from "./typings.ts";

/**
 * @see {@link is}
 */
export interface Is extends Is.Affirmative, Is.Function {
  not: Is.Negative;
}

/**
 * @namespace Is _Provides utility types related to type checking and type guards_.
 */
export namespace Is {
  interface AvailableTypeMap extends TypeOf.NameToTypeMap {
    arrow: Any.Function;
    async: Any.AsyncFunction;
    primitive: Primitive;
  }

  type AvailableType = KeyOf<AvailableTypeMap>;

  export type Not<T, U> = T extends U ? never : T;

  export type Affirmative = {
    [K in AvailableType]: (
      value: unknown,
    ) => value is Expand.OneLevel<AvailableTypeMap[K], Expand.Exclusions | Any.Object>;
  };

  export type Function = <T extends AvailableType>(type: T, value: unknown) => value is AvailableTypeMap[T];

  export type Negative = {
    [K in AvailableType]: <T>(
      value: T,
    ) => value is Not<T, Expand.OneLevel<AvailableTypeMap[K], Expand.Exclusions | Any.Object>>;
  };
}

/**
 * Type guard function that can be used either as a standalone function or as a method on the `is` object.
 *
 * @example
 *
 * ```typescript
 * // as a standalone function
 * console.log(is("string", "hello")); // true
 * // as a method on the `is` object
 * console.log(is.string("hello")); // true
 * ```
 *
 */
export const is: Is = (() => {
  let is = function is<T extends TypeOf>(type: T, value: unknown): value is TypeOf.NameToTypeMap[T] {
    const actualType = typeOf(value);

    return actualType === type;
  } as Is;

  is = new Proxy(is, {
    get(target, prop: TypeOf) {
      if (prop in target) {
        return Reflect.get(target, prop);
      }

      if (!typeOf.TYPES.includes(prop)) {
        throw new TypeError(`Type "${prop}" is not a valid type.`);
      }

      const method = is.bind(null, prop);

      Object.defineProperty(method, "name", {
        value: prop,
        configurable: true,
        writable: false,
        enumerable: false,
      });

      Object.defineProperty(target, prop, {
        value: method,
        enumerable: true,
        configurable: true,
        writable: false,
      });

      return Reflect.get(target, prop);
    },
  });

  is.arrow = function arrow(value: unknown): value is Any.Function {
    if (!is("function", value)) return false;

    const lines = value.toString().split("\n");

    return lines[0].includes(")=>");
  };

  is.async = function async(value: unknown): value is Any.AsyncFunction {
    return is("function", value) && value.toString().startsWith("async ");
  };

  is.primitive = function primitive(value: unknown): value is Primitive {
    const type = typeOf(value);

    return typeOf.PRIMITIVES.includes(type as TypeOf.PrimitiveName);
  };

  const not = new Proxy({} as Is.Negative, {
    get(target, prop: TypeOf) {
      if (prop in target) {
        return Reflect.get(target, prop);
      }

      const og = (is as Is)[prop];
      const method = function (value: unknown): unknown {
        return !og(value);
      };

      Object.defineProperty(method, "name", {
        value: prop,
        configurable: true,
        writable: false,
        enumerable: false,
      });

      Object.defineProperty(target, prop, {
        value: method,
        enumerable: true,
        configurable: true,
        writable: false,
      });

      return Reflect.get(target, prop);
    },
  });

  is.not = not;

  return is;
})();

export function coerce<T = Any>(value: unknown) {
  return value as T;
}
