import { describe, expect, test } from "vitest";

import { typeOf } from "./type-of.ts";

describe("The function typeOf", () => {
  class CustomClass {}

  const tests = [
    { cases: ["", "hi", "😭"], expected: "string" },
    { cases: [0, 42, NaN], expected: "number" },
    { cases: [true, false], expected: "boolean" },
    { cases: [Symbol(), Symbol("hello")], expected: "symbol" },
    { cases: [null], expected: "null" },
    { cases: [undefined], expected: "undefined" },
    { cases: [[], [1, 2, 3]], expected: "array" },
    { cases: [new Date()], expected: "date" },
    { cases: [/abc/], expected: "regexp" },
    { cases: [new Error()], expected: "error" },
    { cases: [new Map()], expected: "map" },
    { cases: [new Set()], expected: "set" },
    { cases: [function () {}, () => {}], expected: "function" },
    { cases: [{}, { a: 1, b: 2 }, new Object(), new CustomClass()], expected: "object" },
  ];

  test.each(tests)("identifies the type of a value as $expected", ({ cases, expected }) => {
    for (const caseValue of cases) {
      expect(typeOf(caseValue)).toBe(expected);
    }
  });
});
