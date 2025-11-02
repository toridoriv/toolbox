// @ts-nocheck
/* eslint-disable */

/**
 * Represents `any` type in TypeScript.
 * Use this instead of `any` to indicate that its use is intentional,
 * avoiding the need for disabling the linting rules.
 */
type Any = any;
/**
 * @namespace Any _Groups together generic types with `any` as the default parameter types_.
 */
declare namespace Any {
    /**
     * Represents any asynchronous function type.
     */
    type AsyncFunction = (...args: Any[]) => Promise<Any>;
    /**
     * Represents any function type.
     */
    type Function = (...args: Any[]) => Any;
    /**
     * Represents any writable {@link globalThis.Map | Map}.
     */
    type WritableMap<T = Any, U = Any> = globalThis.Map<T, U>;
    /**
     * Represents any readonly {@link globalThis.ReadonlyMap | ReadonlyMap}.
     */
    type ReadonlyMap<T = Any, U = Any> = globalThis.ReadonlyMap<T, U>;
    /**
     * Represents any `Map`, either writable or readonly.
     */
    type Map<T = Any, U = Any> = WritableMap<T, U> | ReadonlyMap<T, U>;
    /**
     * Represents any writable {@link globalThis.Set | Set}.
     */
    type WritableSet<T = Any> = globalThis.Set<T>;
    /**
     * Represents any readonly {@link globalThis.ReadonlySet | ReadonlySet}.
     */
    type ReadonlySet<T = Any> = globalThis.ReadonlySet<T>;
    /**
     * Represents any `Set`, either writable or readonly.
     */
    type Set<T = Any> = WritableSet<T> | ReadonlySet<T>;
    /**
     * Represents any writable {@link globalThis.Array | Array}.
     */
    type WritableArray<T = Any> = globalThis.Array<T>;
    /**
     * Represents any readonly {@link globalThis.ReadonlyArray | ReadonlyArray}.
     */
    type ReadonlyArray<T = Any> = globalThis.ReadonlyArray<T>;
    /**
     * Represents any `Array`, either writable or readonly.
     */
    type Array<T = Any> = WritableArray<T> | ReadonlyArray<T>;
    /**
     * Represents any writable {@link globalThis.Object | Object}.
     */
    type WritableObject<K extends PropertyKey = PropertyKey, V = Any> = {
        [key in K]: V;
    } & InstanceType<typeof globalThis.Object>;
    /**
     * Represents any readonly {@link globalThis.Object | Object}.
     */
    type ReadonlyObject<K extends PropertyKey = PropertyKey, V = Any> = {
        readonly [key in K]: V;
    } & InstanceType<typeof globalThis.Object>;
    /**
     * Represents any `Object`, either writable or readonly.
     */
    type Object<K extends PropertyKey = PropertyKey, V = Any> = WritableObject<K, V> | ReadonlyObject<K, V>;
}
/**
 * Takes a type `T` and expands it recursively or one level deep based on the `recursively` option.
 *
 * If `recursively` is `true`, uses {@linkcode Expand.Recursive}, else it uses {@linkcode Expand.OneLevel}.
 *
 * The type `E` is used to specify types that should not be expanded, but returned as they are. The default
 * exclusions can be checked in {@linkcode Expand.Exclusions}.
 */
type Expand<T, recursively extends boolean = false, E = Expand.Exclusions> = recursively extends true ? Expand.Recursive<T, E> : Expand.OneLevel<T, E>;
/**
 * @namespace Expand _Provides utility types related to type expansion_.
 */
declare namespace Expand {
    type Exclusions = ArrayBuffer | Blob | Date | FormData | Headers | Map<Any, Any> | Primitive | ReadableStream<Any> | RegExp | Error;
    /**
     * Takes a type `T` and expands it into an object type with the same properties as `T`.
     *
     * Replaces any properties and array elements in `T` with their expanded types, up to one level deep.
     *
     * `E` specifies types that should not be expanded but returned as-is.
     */
    type OneLevel<T, E = Exclusions> = T extends E ? T : T extends (...args: infer A) => infer R ? (...args: OneLevel<A, E>) => OneLevel<R, E> : T extends Promise<infer U> ? Promise<OneLevel<U, E>> : T extends Set<infer SetType> ? Set<OneLevel<SetType>> : T extends object ? {
        [K in keyof T]: T[K];
    } : T;
    /**
     * Takes a type `T` and expands it into an object type with the same properties as `T`.
     *
     * Replaces any properties and array elements in `T` with their expanded types,
     * recursively.
     *
     * `E` specifies types that should not be expanded but returned as-is.
     */
    type Recursive<T, E = Exclusions> = T extends E ? T : T extends (...args: infer A) => infer R ? (...args: Recursive<A, E>) => Recursive<R, E> : T extends Promise<infer U> ? Promise<Recursive<U, E>> : T extends Set<infer SetType> ? Set<Recursive<SetType>> : T extends object ? {
        [K in keyof T]: Recursive<T[K], E>;
    } : T;
}
/**
 * Checks if types `T` and `U` are compatible.
 */
type AreCompatible<T, U> = Extends<T, U> extends false ? (Extends<U, T> extends false ? false : true) : true;
/**
 * Represents the keys of `T`.
 */
type KeyOf<T> = keyof T & PropertyKey;
/**
 * Checks if type `T` extends type `U`.
 */
type Extends<T, U> = T extends U ? (T extends ObjectLike ? (U extends ObjectLike ? true : false) : true) : false;
/**
 * Constructs a type that includes only properties from `T` whose types are compatible with `U`.
 */
type IncludeByType<T, U> = {
    [P in keyof T as AreCompatible<T[P], U> extends true ? P : never]: T[P];
};
/**
 * Represents types that are considered `object` in TypeScript.
 */
type ObjectLike = Any.Array | Any.Map | Any.Function | Any.Set | Date | RegExp | Error;
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
type Primitive = string | number | bigint | boolean | symbol | null | undefined;

/**
 * Creates a deep clone of the given value.
 *
 * @param value - The value to clone.
 * @returns A new value that is a deep clone of the original.
 */
declare function clone<T>(value: T): T;
declare namespace clone {
    export var set: <T extends Any.Set>(value: T) => T;
    export var regexp: (value: RegExp) => RegExp;
    export var error: <T extends Error>(error: T) => T;
    export var primitive: <T extends Primitive>(value: T) => T;
    export var array: <T extends Any.Array>(list: T) => T;
    var _a: <T extends Any.Function>(fn: T) => T;
    export var date: (date: Date) => Date;
    export var map: <T extends Any.Map>(value: T) => T;
    export var object: <T extends Any.Object>(obj: T, target?: Any.Object) => T;
    export { _a as function };
}

declare function defineValue<T extends object, K extends keyof T, V = unknown>(obj: T, key: K, descriptor?: PropertyDescriptor, value?: V): WithProperty<T, K, V>;
declare namespace defineValue {
    var ALLOWED_TYPES: readonly ("string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "null" | "array" | "map" | "set" | "date" | "regexp" | "error")[];
}
type WithProperty<T, K extends keyof T, V> = Expand<Omit<T, K> & {
    [P in K]: V;
}>;
declare function getUnique<T extends Any.Array>(list: T): T;

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
declare function typeOf(value: unknown): TypeOf;
declare namespace typeOf {
    var PRIMITIVES: readonly ["string", "number", "bigint", "boolean", "symbol", "undefined", "null"];
    var TYPES: readonly ["string", "number", "bigint", "boolean", "symbol", "undefined", "null", "array", "function", "map", "set", "date", "regexp", "error", "object"];
    var OBJECT_LIKE_CONSTRUCTORS: (ArrayConstructor | MapConstructor | FunctionConstructor | SetConstructor | DateConstructor | RegExpConstructor | ErrorConstructor)[];
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
declare function isInstanceOf<T extends new (...args: Any.WritableArray) => Any>(type: T, value: unknown): value is InstanceType<T>;
/**
 * A union of possible type names.
 */
type TypeOf = KeyOf<TypeOf.NameToTypeMap>;
/**
 * @namespace TypeOf _Provides utility types related to JavaScript data types_.
 */
declare namespace TypeOf {
    type PrimitiveName = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "null";
    /**
     * Represents a dictionary between type names and their corresponding types.
     */
    interface NameToTypeMap {
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
    type InferName<T> = KeyOf<IncludeByType<NameToTypeMap, T>>;
    /**
     * Checks if a type `T` is a primitive type.
     */
    type IsPrimitive<T> = InferName<T> extends PrimitiveName ? true : false;
}

/**
 * @see {@link is}
 */
interface Is extends Is.Affirmative, Is.Function {
    not: Is.Negative;
}
/**
 * @namespace Is _Provides utility types related to type checking and type guards_.
 */
declare namespace Is {
    interface AvailableTypeMap extends TypeOf.NameToTypeMap {
        arrow: Any.Function;
        async: Any.AsyncFunction;
        primitive: Primitive;
    }
    type AvailableType = KeyOf<AvailableTypeMap>;
    export type Not<T, U> = T extends U ? never : T;
    export type Affirmative = {
        [K in AvailableType]: (value: unknown) => value is Expand.OneLevel<AvailableTypeMap[K], Expand.Exclusions | Any.Object>;
    };
    export type Function = <T extends AvailableType>(type: T, value: unknown) => value is AvailableTypeMap[T];
    export type Negative = {
        [K in AvailableType]: <T>(value: T) => value is Not<T, Expand.OneLevel<AvailableTypeMap[K], Expand.Exclusions | Any.Object>>;
    };
    export {  };
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
declare const is: Is;
declare function coerce<T = Any>(value: unknown): T;

/**
 * Represents the result of merging two values of potentially different types.
 *
 * The merging strategy is determined by the type of the values and the options provided.
 */
type Merge<A, B, Opts extends Merge.Options = Merge.DefaultOptions> = Merge.GetValue<A, B, Merge.ParsedOptions<Opts>>;
/**
 * Provides utilities for merging objects, arrays, maps, sets, and regular expressions.
 *
 * @namespace Merge
 */
declare namespace Merge {
    /**
     * The strategy to use when merging.
     */
    export type Strategy = "replace" | "merge";
    /**
     * Strategy for merging arrays, maps, and sets.
     */
    export type Options = {
        /**
         * Strategy for merging arrays. When both objects have an array at the same key, this option determines how to
         * handle the merge.
         * - **replace:** The array from the second object replaces the array from the first object.
         * - **merge:** The arrays from both objects are concatenated.
         *
         * @default merge
         */
        array?: Strategy;
        /**
         * Strategy for merging maps. When both objects have a map at the same key, this option determines how to handle the
         * merge.
         * - **replace:** The map from the second object replaces the map from the first object.
         * - **merge:** The maps from both objects are merged recursively. If a key exists in both maps, the value from the
         * second map will be used.
         *
         * @default merge
         */
        map?: Strategy;
        /**
         * Strategy for merging sets. If `a` and `b` are both sets:
         *
         * - **replace:** the second set replaces the first.
         * - **merge:** both sets are merged, resulting in a new set that contains all unique values from both sets.
         *
         * @default merge
         */
        set?: Strategy;
        /**
         * Strategy for merging regular expressions. If `a` and `b` are both regular expressions:
         *
         * - **replace:** the second regular expression replaces the first.
         * - **merge:** both regular expressions are merged, resulting in a new regular expression that combines the
         * patterns and flags of both.
         */
        regexp?: Strategy;
    };
    type KindOf = Exclude<TypeOf, TypeOf.PrimitiveName> | "primitive";
    /**
     * The given options with the default values filled in.
     */
    export type ParsedOptions<T extends Options> = {
        [K in keyof DefaultOptions]: K extends keyof T ? T[K] extends Strategy ? T[K] : DefaultOptions[K] : DefaultOptions[K];
    };
    /**
     * Retrieves the value for a given key in the merged object.
     */
    export type GetValue<A, B, O extends AllOptions> = TypeOf.InferName<A> extends TypeOf.InferName<B> ? TypeOf.InferName<B> extends Mergeable ? ResultByKindOf<A, B, O>[TypeOf.InferName<B>] : GetReplaceValue<A, B> : GetReplaceValue<A, B>;
    /**
     * The kinds of values that can be merged.
     */
    export type Mergeable = (typeof merge.MERGEABLE)[number];
    type AllOptions = Record<KindOf, Strategy>;
    export type DefaultOptions = typeof merge.STRATEGY_BY_TYPE;
    type Sets<A, B> = A extends Set<infer T> ? (B extends Set<infer U> ? Set<T | U> : never) : never;
    type Maps<A, B> = A extends Map<infer AK, infer AV> ? (B extends Map<infer BK, infer BV> ? Map<AK | BK, AV | BV> : never) : never;
    type Arrays<A, B> = A extends Array<infer T> ? (B extends Array<infer U> ? Array<T | U> : never) : never;
    export type Objects<T extends Any.Object, U extends Any.Object, Opts extends Merge.Options> = Expand.Recursive<{
        [K in keyof T | keyof U]: K extends keyof T | keyof U ? GetValue<T[K], U[K], ParsedOptions<Opts>> : never;
    }>;
    type GetReplaceValue<A, B> = B extends undefined ? A : B;
    type ResultByKindOf<A, B, O extends AllOptions> = {
        array: O["array"] extends "merge" ? Arrays<A, B> : GetReplaceValue<A, B>;
        set: O["set"] extends "merge" ? Sets<A, B> : GetReplaceValue<A, B>;
        map: O["map"] extends "merge" ? Maps<A, B> : GetReplaceValue<A, B>;
        regexp: A & B;
        object: A extends Any.Object ? B extends Any.Object ? Objects<A, B, O> : GetReplaceValue<A, B> : GetReplaceValue<A, B>;
    };
    export {  };
}
/**
 * Merges two values of potentially different types into a single value.
 *
 * The merging strategy is determined by the type of the values and the options provided.
 *
 * If both values are of the same type and that type is mergeable, they will be merged according to the specified
 * options. If they are not of the same type or not mergeable, the function will return a clone of the first defined
 * value.
 *
 * @param a       - The first value to merge.
 * @param b       - The second value to merge.
 * @param options - Options that determine how to merge the values. The default options can be found in {@link Merge.STRATEGY_BY_TYPE}.
 * @returns The merged values, if they're mergeable, or a clone of the first defined value (`b` has priority over
 *          `a`).
 */
declare function merge<A, B, O extends Merge.Options = {}>(a: A, b: B, options?: O): Merge<A, B, O>;
declare namespace merge {
    var STRATEGY_BY_TYPE: Readonly<{
        array: "merge";
        map: "merge";
        set: "merge";
        object: "merge";
        primitive: "replace";
        date: "replace";
        regexp: "replace";
        error: "replace";
        function: "replace";
    }>;
    var MERGEABLE: readonly ["array", "map", "set", "object", "regexp"];
    var isMergeableType: (type: TypeOf) => type is Merge.Mergeable;
    var object: <A extends Any.Object, B extends Any.Object, O extends Merge.Options = {}>(a: A, b: B, options?: O) => Merge<A, B, O>;
    var array: <A extends Any.WritableArray, B extends Any.WritableArray, O extends Merge.Options = {}>(a: A, b: B, options?: O) => Merge<A, B, O>;
    var map: <A extends Any.WritableMap, B extends Any.WritableMap, O extends Merge.Options = {}>(a: A, b: B, options?: O) => Merge<A, B, O>;
    var set: <A extends Any.Set, B extends Any.Set, O extends Merge.Options = {}>(a: A, b: B, options?: O) => Merge<A, B, O>;
    var regexp: <A extends RegExp, B extends RegExp, O extends Merge.Options = {}>(a: A, b: B, options?: O) => Merge<A, B, O>;
}

export { Any, type AreCompatible, Expand, type Extends, type IncludeByType, Is, type KeyOf, Merge, type ObjectLike, type Primitive, TypeOf, type WithProperty, clone, coerce, defineValue, getUnique, is, isInstanceOf, merge, typeOf };
