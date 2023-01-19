const Utils = require("./utils");

test("test types", () => {
  expect(Utils.isArray([])).toBe(true);
  expect(Utils.isBool(true)).toBe(true);
  expect(Utils.isBool(false)).toBe(true);
  expect(Utils.isFunction(() => {})).toBe(true);
  expect(Utils.isNumber(1)).toBe(true);
  expect(Utils.isNull(null)).toBe(true);
  expect(Utils.isDefined(1)).toBe(true);

  expect(Utils.isArray(undefined)).toBe(false);
  expect(Utils.isBool(undefined)).toBe(false);
  expect(Utils.isBool(undefined)).toBe(false);
  expect(Utils.isFunction(undefined)).toBe(false);
  expect(Utils.isNumber(undefined)).toBe(false);
  expect(Utils.isNull(undefined)).toBe(false);
  expect(Utils.isDefined(undefined)).toBe(false);

  expect(Utils.isDefined(undefined)).toBe(false);
  expect(Utils.isDict(1)).toBe(false);
  expect(Utils.isDict({})).toBe(true);

  expect(Utils.isDict([])).toBe(false);
  expect(Utils.isDict(() => {})).toBe(false);
  expect(Utils.isDict(null)).toBe(false);
  expect(Utils.isDict(undefined)).toBe(false);
  expect(Utils.isDict(true)).toBe(false);

  expect(Utils.isFunction(1)).toBe(false);
  expect(Utils.isFunction({})).toBe(false);
  expect(Utils.isFunction([])).toBe(false);
  expect(Utils.isFunction(null)).toBe(false);
  expect(Utils.isFunction(undefined)).toBe(false);
  expect(Utils.isFunction(true)).toBe(false);
});

test("merge", () => {
  expect(Utils.merge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
  expect(Utils.merge({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({
    a: 1,
    b: 2,
    c: 3,
  });
  expect(Utils.merge({ a: 1 }, { a: 2 })).toEqual({ a: 1 });
  expect(Utils.merge({ a: 1 }, { a: 2, b: 2 }, { b: 3 })).toEqual({
    a: 1,
    b: 2,
  });
  let a = { a: 1 };
  let b = { b: 2 };
  let c = { c: 3 };
  expect(Utils.merge(a, b, c)).toEqual({ a: 1, b: 2, c: 3 });
  expect(a).toEqual({ a: 1 });

  expect(Utils.merge({ a: undefined }, { a: 1 })).toEqual({ a: 1 });
  expect(Utils.merge({ a: 1 }, { b: undefined })).toEqual({
    a: 1,
    b: undefined,
  });
  let k = Object.keys(Utils.merge({ a: 1 }, { b: undefined }));
  expect(k).toEqual(["a", "b"]);

  expect(
    Utils.merge(
      { a: { data: { hello: 2 } } },
      { a: { text: "hi", data: { hello: 1, hi: 5 } } }
    )
  ).toEqual({ a: { text: "hi", data: { hello: 2, hi: 5 } } });
});

test("deepClone", () => {
  let d = { a: 1, b: { c: 2 } };
  let cloneD = Utils.deepClone(d);
  cloneD.b.c = 3;
  expect(d).toEqual({ a: 1, b: { c: 2 } });

  let a = [1, 2, 3];
  let cloneA = Utils.deepClone(a);
  cloneA[0] = 5;
  expect(a).toEqual([1, 2, 3]);

  let b = { a: 1, b: [1, 2, 3] };
  let cloneB = Utils.deepClone(b);
  cloneB.b[0] = 5;
  expect(b).toEqual({ a: 1, b: [1, 2, 3] });

  let c = [{ a: 3 }, { b: 4, c: { d: 5 } }, { e: [1, 2, { f: 6 }] }];
  let cloneC = Utils.deepClone(c);
  cloneC[2].e[2].f = 7;
  cloneC[1].b = 3;
  cloneC[1].c.d = 1;
  expect(c).toEqual([{ a: 3 }, { b: 4, c: { d: 5 } }, { e: [1, 2, { f: 6 }] }]);
});

test("firstDefined", () => {
  expect(Utils.firstDefined(1, 2, 3)).toEqual(1);
  expect(Utils.firstDefined(undefined, 2, 3)).toEqual(2);
  expect(Utils.firstDefined(undefined, undefined, 3)).toEqual(3);
  expect(Utils.firstDefined(undefined, undefined, undefined)).toEqual(
    undefined
  );
});

test("turnIntoObject", () => {
  expect(Utils.turnIntoObject("a", "test")).toEqual({ test: "a" });
  expect(Utils.turnIntoObject(5, "test")).toEqual({ test: 5 });
  expect(Utils.turnIntoObject(false, "test")).toEqual({ test: false });

  expect(Utils.turnIntoObject({}, "test")).toEqual({});
  let a = { a: 1 };
  let b = Utils.turnIntoObject(a, "test");
  expect(b).toEqual(a);
  b.a = 2;
  expect(a).toEqual({ a: 1 });
});

test("combineObjects", () => {
  expect(
    Utils.combineObjectsWithKey({ a: 1, test: "b" }, { b: { c: 17 } }, "test")
  ).toEqual({ a: 1, c: 17, test: "b" });

  expect(Utils.combineObjectsWithKey("b", { b: { c: 17 } }, "test")).toEqual({
    c: 17,
    test: "b",
  });

  expect(Utils.combineObjectsWithKey("b", { b: { c: 17 } })).toEqual({
    c: 17,
    preset: "b",
  });

  expect(
    Utils.combineObjectsWithKey(
      { preset: "b", test: 7 },
      { b: { test: 17, hi: "hello" } }
    )
  ).toEqual({ preset: "b", test: 7, hi: "hello" });

  expect(Utils.combine(undefined, undefined)).toEqual({ preset: undefined });
  expect(Utils.combine(undefined, { a: 1 })).toEqual({
    preset: undefined,
  });

  expect(Utils.combine({ a: 1 }, undefined)).toEqual({
    a: 1,
    preset: undefined,
  });
});

test("resolveFunctions", () => {
  expect(Utils.resolveFunctions({ a: 1, b: () => 2 })).toEqual({ a: 1, b: 2 });
  expect(Utils.resolveFunctions({ a: 1, b: (n) => 2 * n }, 3)).toEqual({
    a: 1,
    b: 6,
  });
  expect(
    Utils.resolveFunctions((n) => {
      return { a: n, b: n * 2 };
    }, 3)
  ).toEqual({ a: 3, b: 6 });

  expect(Utils.resolveFunctions({ a: { b: () => 2 } })).toEqual({
    a: { b: 2 },
  });
  expect(Utils.resolveFunctions(undefined, 3)).toEqual(undefined);
  expect(Utils.resolveFunctions("test")).toEqual("test");
  expect(Utils.resolveFunctions(3)).toEqual(3);
  expect(Utils.resolveFunctions(true)).toEqual(true);
  expect(Utils.resolveFunctions([() => 4, () => 5])).toEqual([4, 5]);
  expect(Utils.resolveFunctions([() => 4, 5])).toEqual([4, 5]);
  expect(
    Utils.resolveFunctions(
      [{ c: (n) => 3 * n, b: [1, () => 2, 3] }, () => 5],
      1
    )
  ).toEqual([{ c: 3, b: [1, 2, 3] }, 5]);
});
