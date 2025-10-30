import { describe, expect, test } from "vitest";

import { is } from "./is.ts";
import type { TypeOf } from "./type-of.ts";

describe("The function is", () => {
  type TestCase = {
    affirmative: unknown;
    negative: unknown;
    type: TypeOf;
  };

  const tests: TestCase[] = [
    { affirmative: "hello", negative: 42, type: "string" },
    { affirmative: 42, negative: "hello", type: "number" },
    { affirmative: true, negative: "false", type: "boolean" },
    { affirmative: Symbol("sym"), negative: "sym", type: "symbol" },
    { affirmative: null, negative: undefined, type: "null" },
    { affirmative: undefined, negative: null, type: "undefined" },
    { affirmative: [1, 2, 3], negative: {}, type: "array" },
    { affirmative: new Date(), negative: {}, type: "date" },
    { affirmative: /abc/, negative: {}, type: "regexp" },
    { affirmative: new Error(), negative: {}, type: "error" },
    { affirmative: new Map(), negative: {}, type: "map" },
    { affirmative: new Set(), negative: {}, type: "set" },
    { affirmative: () => {}, negative: {}, type: "function" },
    { affirmative: {}, negative: [], type: "object" },
  ];

  test.each(tests)("correctly identifies $type values", ({ affirmative, negative, type }) => {
    expect(is(type, affirmative)).toBe(true);
    expect(is(type, negative)).toBe(false);
    expect(is[type](affirmative)).toBe(true);
    expect(is[type](negative)).toBe(false);
  });

  describe(".not", () => {
    test.each(tests)("correctly identifies values that are not $type", ({ affirmative, negative, type }) => {
      expect(is.not[type](affirmative)).toBe(false);
      expect(is.not[type](negative)).toBe(true);
    });
  });
});
