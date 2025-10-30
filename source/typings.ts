/**
 * Represents `any` type in TypeScript.
 * Use this instead of `any` to indicate that its use is intentional,
 * avoiding the need for disabling the linting rules.
 */
export type Any = any;

/**
 * @namespace Any _Groups together generic types with `any` as the default parameter types_.
 */
export namespace Any {
  /**
   * Represents any asynchronous function type.
   */
  export type AsyncFunction = (...args: Any[]) => Promise<Any>;

  /**
   * Represents any function type.
   */
  export type Function = (...args: Any[]) => Any;

  /**
   * Represents any writable {@link globalThis.Map | Map}.
   */
  export type WritableMap<T = Any, U = Any> = globalThis.Map<T, U>;

  /**
   * Represents any readonly {@link globalThis.ReadonlyMap | ReadonlyMap}.
   */
  export type ReadonlyMap<T = Any, U = Any> = globalThis.ReadonlyMap<T, U>;

  /**
   * Represents any `Map`, either writable or readonly.
   */
  export type Map<T = Any, U = Any> = WritableMap<T, U> | ReadonlyMap<T, U>;

  /**
   * Represents any writable {@link globalThis.Set | Set}.
   */
  export type WritableSet<T = Any> = globalThis.Set<T>;

  /**
   * Represents any readonly {@link globalThis.ReadonlySet | ReadonlySet}.
   */
  export type ReadonlySet<T = Any> = globalThis.ReadonlySet<T>;

  /**
   * Represents any `Set`, either writable or readonly.
   */
  export type Set<T = Any> = WritableSet<T> | ReadonlySet<T>;

  /**
   * Represents any writable {@link globalThis.Array | Array}.
   */
  export type WritableArray<T = Any> = globalThis.Array<T>;

  /**
   * Represents any readonly {@link globalThis.ReadonlyArray | ReadonlyArray}.
   */
  export type ReadonlyArray<T = Any> = globalThis.ReadonlyArray<T>;

  /**
   * Represents any `Array`, either writable or readonly.
   */
  export type Array<T = Any> = WritableArray<T> | ReadonlyArray<T>;

  /**
   * Represents any writable {@link globalThis.Object | Object}.
   */
  export type WritableObject<K extends PropertyKey = PropertyKey, V = Any> = {
    [key in K]: V;
  } & InstanceType<typeof globalThis.Object>;

  /**
   * Represents any readonly {@link globalThis.Object | Object}.
   */
  export type ReadonlyObject<K extends PropertyKey = PropertyKey, V = Any> = {
    readonly [key in K]: V;
  } & InstanceType<typeof globalThis.Object>;

  /**
   * Represents any `Object`, either writable or readonly.
   */
  export type Object<K extends PropertyKey = PropertyKey, V = Any> = WritableObject<K, V> | ReadonlyObject<K, V>;
}

/**
 * Takes a type `T` and expands it recursively or one level deep based on the `recursively` option.
 *
 * If `recursively` is `true`, uses {@linkcode Expand.Recursive}, else it uses {@linkcode Expand.OneLevel}.
 *
 * The type `E` is used to specify types that should not be expanded, but returned as they are. The default
 * exclusions can be checked in {@linkcode Expand.Exclusions}.
 */
export type Expand<T, recursively extends boolean = false, E = Expand.Exclusions> = recursively extends true
  ? Expand.Recursive<T, E>
  : Expand.OneLevel<T, E>;

/**
 * @namespace Expand _Provides utility types related to type expansion_.
 */
export namespace Expand {
  export type Exclusions =
    | ArrayBuffer
    | Blob
    | Date
    | FormData
    | Headers
    | Map<Any, Any>
    | Primitive
    | ReadableStream<Any>
    | RegExp
    | Error;

  /**
   * Takes a type `T` and expands it into an object type with the same properties as `T`.
   *
   * Replaces any properties and array elements in `T` with their expanded types, up to one level deep.
   *
   * `E` specifies types that should not be expanded but returned as-is.
   */
  export type OneLevel<T, E = Exclusions> = T extends E
    ? T
    : T extends (...args: infer A) => infer R
      ? (...args: OneLevel<A, E>) => OneLevel<R, E>
      : T extends Promise<infer U>
        ? Promise<OneLevel<U, E>>
        : T extends Set<infer SetType>
          ? Set<OneLevel<SetType>>
          : T extends object
            ? { [K in keyof T]: T[K] }
            : T;

  /**
   * Takes a type `T` and expands it into an object type with the same properties as `T`.
   *
   * Replaces any properties and array elements in `T` with their expanded types,
   * recursively.
   *
   * `E` specifies types that should not be expanded but returned as-is.
   */
  export type Recursive<T, E = Exclusions> = T extends E
    ? T
    : T extends (...args: infer A) => infer R
      ? (...args: Recursive<A, E>) => Recursive<R, E>
      : T extends Promise<infer U>
        ? Promise<Recursive<U, E>>
        : T extends Set<infer SetType>
          ? Set<Recursive<SetType>>
          : T extends object
            ? { [K in keyof T]: Recursive<T[K], E> }
            : T;
}

/**
 * Checks if types `T` and `U` are compatible.
 */
export type AreCompatible<T, U> = Extends<T, U> extends false ? (Extends<U, T> extends false ? false : true) : true;

/**
 * Represents the keys of `T`.
 */
export type KeyOf<T> = keyof T & PropertyKey;

/**
 * Checks if type `T` extends type `U`.
 */
export type Extends<T, U> = T extends U ? (T extends ObjectLike ? (U extends ObjectLike ? true : false) : true) : false;

/**
 * Constructs a type that includes only properties from `T` whose types are compatible with `U`.
 */
export type IncludeByType<T, U> = {
  [P in keyof T as AreCompatible<T[P], U> extends true ? P : never]: T[P];
};

/**
 * Represents types that are considered `object` in TypeScript.
 */
export type ObjectLike = Any.Array | Any.Map | Any.Function | Any.Set | Date | RegExp | Error;

/**
 * Represents a primitive data type in JavaScript.
 *
 * A primitive is a basic data type that is not an object and has no methods.
 * Primitives are immutable, meaning their values cannot be changed once they are created.
 *
 * The available primitive types in JavaScript are:
 * - **string:** Represents textual data, enclosed in single or double quotes.
 * - **number:** Represents numeric values, including integers and floating-point numbers.
 * - **bigint:** Represents integer values that are too large to be represented by a regular number.
 * - **boolean:** Represents a logical value, either true or false.
 * - **symbol:** Represents a unique identifier, often used as keys for object properties.
 * - **null:** Represents a deliberate non-value or null value.
 * - **undefined:** Represents a value that has not been assigned or is not defined.
 */
export type Primitive = string | number | bigint | boolean | symbol | null | undefined;
