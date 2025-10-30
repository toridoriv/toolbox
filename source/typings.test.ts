import { describe, expectTypeOf, it } from "vitest";

import type { Any, KeyOf } from "./typings.ts";

describe("Any", () => {
  it("matches any type", () => {
    expectTypeOf<Any>().toBeAny();
  });
});

describe("KeyOf", () => {
  it("matches the keys of a given type object", () => {
    type Example = {
      a: number;
      b: string;
      c: boolean;
    };

    type KeyOfExample = KeyOf<Example>;

    expectTypeOf<"a">().toExtend<KeyOfExample>();
    expectTypeOf<"b">().toExtend<KeyOfExample>();
    expectTypeOf<"c">().toExtend<KeyOfExample>();

    expectTypeOf<"d">().not.toExtend<KeyOfExample>();
  });

  it("matches the keys of a built-in type", () => {
    type KeyOfExample = KeyOf<"">;

    expectTypeOf<"repeat">().toExtend<KeyOfExample>();
    expectTypeOf<"split">().toExtend<KeyOfExample>();
    expectTypeOf<number>().toExtend<KeyOfExample>();

    expectTypeOf<"foo">().not.toExtend<KeyOfExample>();
  });
});
