import type { Any, IncludeByType, KeyOf } from "./typings.ts";

/**
 * A list of all primitive types in JavaScript.
 */
typeOf.PRIMITIVES = ["string", "number", "bigint", "boolean", "symbol", "undefined", "null"] as const;

/**
 * A list of custom available types.
 */
typeOf.TYPES = [...typeOf.PRIMITIVES, "array", "function", "map", "set", "date", "regexp", "error", "object"] as const;

/**
 * A list of constructors that are considered as object-like types.
 */
typeOf.OBJECT_LIKE_CONSTRUCTORS = [Array, Map, Function, Set, Date, RegExp, Error];

/**
 * Checks the type of a value and returns its type name. It's an expanded version of `typeof` that includes custom
 * types.
 *
 * @param value - The value to check the type of.
 * @returns The type name of the value. @see {@link TypeOf}.
 * @example
 *
 * ```typescript
 * console.log(typeOf("Hello")); // "string"
 * console.log(typeOf(42)); // "number"
 * console.log(typeOf(true)); // "boolean"
 * console.log(typeOf(null)); // "null"
 * console.log(typeOf(undefined)); // "undefined"
 * console.log(typeOf([1, 2, 3])); // "array"
 * ```
 *
 */
export function typeOf(value: unknown): TypeOf {
  const native = typeof value as TypeOf;

  if (native !== "object") {
    return native;
  }

  if (value === null) {
    return "null";
  }

  if (Array.isArray(value)) {
    return "array";
  }

  const ctor = typeOf.OBJECT_LIKE_CONSTRUCTORS.find((c) => isInstanceOf(c, value));

  if (ctor) {
    return ctor.name.toLowerCase() as TypeOf;
  }

  return native;
}

/**
 * Checks if a value is an instance of a specific type.
 *
 * @param type  - The constructor of the type to check against.
 * @param value - The value to check.
 * @returns `true` if the value is an instance of the specified type, otherwise `false`.
 * @example
 *
 * ```typescript
 * class MyClass {}
 * const instance = new MyClass();
 * console.log(isInstanceOf(MyClass, instance)); // true
 * ```
 *
 */
export function isInstanceOf<T extends new (...args: Any.WritableArray) => Any>(
  type: T,
  value: unknown,
): value is InstanceType<T> {
  return value instanceof type;
}

/**
 * A union of possible type names.
 */
export type TypeOf = KeyOf<TypeOf.NameToTypeMap>;

/**
 * @namespace TypeOf _Provides utility types related to JavaScript data types_.
 */
export namespace TypeOf {
  export type PrimitiveName = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "null";

  /**
   * Represents a dictionary between type names and their corresponding types.
   */
  export interface NameToTypeMap {
    string: string;
    number: number;
    bigint: bigint;
    boolean: boolean;
    symbol: symbol;
    null: null;
    undefined: undefined;
    array: Any.Array;
    function: Any.Function;
    map: Any.Map;
    set: Any.Set;
    date: Date;
    regexp: RegExp;
    error: Error;
    object: Any.Object;
  }

  /**
   * Infers the name of a type `T`.
   */
  export type InferName<T> = KeyOf<IncludeByType<NameToTypeMap, T>>;

  /**
   * Checks if a type `T` is a primitive type.
   */
  export type IsPrimitive<T> = InferName<T> extends PrimitiveName ? true : false;
}
