import { clone } from "./clone.ts";
import { getUnique } from "./collections.ts";
import { coerce, is } from "./is.ts";
import { type TypeOf, typeOf } from "./type-of.ts";
import type { Any, Expand, KeyOf } from "./typings.ts";

/**
 * Represents the result of merging two values of potentially different types.
 *
 * The merging strategy is determined by the type of the values and the options provided.
 */
export type Merge<A, B, Opts extends Merge.Options = Merge.DefaultOptions> = Merge.GetValue<
  A,
  B,
  Merge.ParsedOptions<Opts>
>;

/**
 * Provides utilities for merging objects, arrays, maps, sets, and regular expressions.
 *
 * @namespace Merge
 */
export namespace Merge {
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
    [K in keyof DefaultOptions]: K extends keyof T
      ? T[K] extends Strategy
        ? T[K]
        : DefaultOptions[K]
      : DefaultOptions[K];
  };

  /**
   * Retrieves the value for a given key in the merged object.
   */
  export type GetValue<A, B, O extends AllOptions> =
    TypeOf.InferName<A> extends TypeOf.InferName<B>
      ? TypeOf.InferName<B> extends Mergeable
        ? ResultByKindOf<A, B, O>[TypeOf.InferName<B>]
        : GetReplaceValue<A, B>
      : GetReplaceValue<A, B>;

  /**
   * The kinds of values that can be merged.
   */
  export type Mergeable = (typeof merge.MERGEABLE)[number];

  type AllOptions = Record<KindOf, Strategy>;

  export type DefaultOptions = typeof merge.STRATEGY_BY_TYPE;

  type Sets<A, B> = A extends Set<infer T> ? (B extends Set<infer U> ? Set<T | U> : never) : never;

  type Maps<A, B> =
    A extends Map<infer AK, infer AV> ? (B extends Map<infer BK, infer BV> ? Map<AK | BK, AV | BV> : never) : never;

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
    object: A extends Any.Object
      ? B extends Any.Object
        ? Objects<A, B, O>
        : GetReplaceValue<A, B>
      : GetReplaceValue<A, B>;
  };
}

/**
 * The default strategy for merging objects based on their type.
 */
merge.STRATEGY_BY_TYPE = Object.freeze({
  array: "merge",
  map: "merge",
  set: "merge",
  object: "merge",
  primitive: "replace",
  date: "replace",
  regexp: "replace",
  error: "replace",
  function: "replace",
});

/**
 * The kinds of values that can be merged.
 */
merge.MERGEABLE = Object.freeze(["array", "map", "set", "object", "regexp"] as const);

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
export function merge<A, B, O extends Merge.Options = {}>(a: A, b: B, options: O = {} as O): Merge<A, B, O> {
  const opts = { ...merge.STRATEGY_BY_TYPE, ...options } as Merge.ParsedOptions<O>;
  const kindA = typeOf(a);
  const kindB = typeOf(b);

  if (merge.isMergeableType(kindA) && merge.isMergeableType(kindB) && kindA === kindB) {
    // @ts-ignore
    return merge[kindA](a, b, opts) as Merge<A, B, O>;
  }

  return clone(coerce([b, a].find(is.not.undefined))) as Merge<A, B, O>;
}

/**
 * Checks if the given type is mergeable.
 *
 * @param type - The type of value to check. @see {@link TypeOf} for more details.
 * @returns `true` if the kind is mergeable, `false` otherwise.
 */
merge.isMergeableType = function isMergeableType(type: TypeOf): type is Merge.Mergeable {
  return merge.MERGEABLE.includes(type as Merge.Mergeable);
};

/**
 * Merges two objects into a single one without modifying the original objects.
 *
 * @param a       - The first object to merge.
 * @param b       - The second object to merge.
 * @param options - Options that determine how to merge the objects. The default options can be found in {@link merge.STRATEGY_BY_TYPE}.
 * @returns A new object that is the result of merging `a` and `b` or a clone of the first defined value if
 *          `options.object` is set to "replace".
 * @throws {TypeError} If either `a` or `b` is not an object.
 */
merge.object = function mergeObjects<A extends Any.Object, B extends Any.Object, O extends Merge.Options = {}>(
  a: A,
  b: B,
  options: O = {} as O,
): Merge<A, B, O> {
  if (!is.object(a) || !is.object(b)) {
    throw new TypeError("Both arguments must be objects.");
  }

  const keys = getUnique<(KeyOf<A> | KeyOf<B>)[]>(coerce(Object.keys(a).concat(Object.keys(b))));
  const result: Any = {};

  for (const key of keys) {
    result[key] = merge(a[key], b[key], options);
  }

  return result;
};

/**
 * Merges two arrays into a single one without modifying the original arrays.
 *
 * @param a       - The first array to merge.
 * @param b       - The second array to merge.
 * @param options - Options that determine how to merge the arrays. The default options can be found in {@link merge.STRATEGY_BY_TYPE}.
 * @returns A new array that is the result of merging `a` and `b` or a clone of the first defined value if
 *          `options.array` is set to "replace".
 * @throws {TypeError} If either `a` or `b` is not an array.
 */
merge.array = function mergeArrays<
  A extends Any.WritableArray,
  B extends Any.WritableArray,
  O extends Merge.Options = {},
>(a: A, b: B, options: O = {} as O): Merge<A, B, O> {
  if (!is.array(a) || !is.array(b)) {
    throw new TypeError("Both arguments must be arrays.");
  }

  if (options.array === "replace") {
    const defined = ([b, a] as (A | B | undefined)[]).filter(is.not.undefined);

    return clone(defined[0]) as unknown as Merge<A, B, O>;
  }

  return clone([...a, ...b]) as Merge<A, B, O>;
};

/**
 * Merges two maps into a single one without modifying the original maps.
 *
 * @param a       - The first map to merge.
 * @param b       - The second map to merge.
 * @param options - Options that determine how to merge the maps. The default options can be found in {@link merge.STRATEGY_BY_TYPE}.
 * @returns A new map that is the result of merging `a` and `b` or a clone of the first defined value if
 *          `options.map` is set to "replace".
 * @throws {TypeError} If either `a` or `b` is not a map.
 */
merge.map = function mergeMaps<A extends Any.WritableMap, B extends Any.WritableMap, O extends Merge.Options = {}>(
  a: A,
  b: B,
  options: O = {} as O,
): Merge<A, B, O> {
  if (!is.map(a) || !is.map(b)) {
    throw new TypeError("Both arguments must be maps.");
  }

  if (options.map === "replace") {
    const defined = ([b, a] as (A | B | undefined)[]).filter(is.not.undefined);

    return clone(defined[0]) as unknown as Merge<A, B, O>;
  }

  const result = clone(a);

  for (const [key, value] of b) {
    result.set(key, value);
  }

  return result as Merge<A, B, O>;
};

/**
 * Merges two sets into a single one without modifying the original sets.
 *
 * @param a       - The first set to merge.
 * @param b       - The second set to merge.
 * @param options - Options that determine how to merge the sets. The default options can be found in {@link merge.STRATEGY_BY_TYPE}.
 * @returns A new set that is the result of merging `a` and `b` or a clone of the first defined value if
 *          `options.set` is set to "replace".
 * @throws {TypeError} If either `a` or `b` is not a set.
 */
merge.set = function mergeSets<A extends Any.Set, B extends Any.Set, O extends Merge.Options = {}>(
  a: A,
  b: B,
  options: O = {} as O,
): Merge<A, B, O> {
  if (!is.set(a) || !is.set(b)) {
    throw new TypeError("Both arguments must be sets.");
  }

  if (options.set === "replace") {
    const defined = ([b, a] as (A | B | undefined)[]).filter(is.not.undefined);

    return clone(defined) as Merge<A, B, O>;
  }

  const result = clone(new Set(a));

  for (const value of b) {
    result.add(value);
  }

  return result as Merge<A, B, O>;
};

/**
 * Merges two regular expressions into a single one without modifying the original regular expressions.
 *
 * @param a       - The first regular expression to merge.
 * @param b       - The second regular expression to merge.
 * @param options - Options that determine how to merge the regular expressions. The default options can be found in {@link merge.STRATEGY_BY_TYPE}.
 * @returns A new regular expression that is the result of merging `a` and `b` or a clone of the second regular
 *          expression if `options.regexp` is set to "replace".
 * @throws {TypeError} If either `a` or `b` is not a regular expression.
 */
merge.regexp = function mergeRegexp<A extends RegExp, B extends RegExp, O extends Merge.Options = {}>(
  a: A,
  b: B,
  options: O = {} as O,
): Merge<A, B, O> {
  if (!is.regexp(a) || !is.regexp(b)) {
    throw new TypeError("Both arguments must be regular expressions.");
  }

  if (options.regexp === "replace") {
    return clone(b) as Merge<A, B, O>;
  }

  const mergedSource = `${a.source}|${b.source}`;
  const mergedFlags = `${a.flags}${b.flags}`;

  let preresult = new RegExp(mergedSource, mergedFlags) as Merge<A, B, O>;
  const additionalProps = {
    ...Object.getOwnPropertyDescriptors(a.constructor.prototype),
    ...Object.getOwnPropertyDescriptors(b.constructor.prototype),
  };

  if ("constructor" in additionalProps) {
    delete additionalProps["constructor"];
  }

  Object.defineProperties(preresult, additionalProps);
  // preresult = Object.setPrototypeOf(preresult, a.constructor.prototype);
  // preresult = Object.setPrototypeOf(preresult, b.constructor.prototype);

  return preresult;
};
