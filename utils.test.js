const Utils = require("./utils");

test("test types", () => {
  expect(Utils.isArray([])).toBe(true);
  expect(Utils.isBool(true)).toBe(true);
  expect(Utils.isBool(false)).toBe(true);
  expect(Utils.isFunction(() => {})).toBe(true);
  expect(Utils.isNumber(1)).toBe(true);
  expect(Utils.isNull(null)).toBe(true);
  expect(Utils.isDefined(1)).toBe(true);

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
});

test("firstDefined", () => {
  expect(Utils.firstDefined(1, 2, 3)).toEqual(1);
  expect(Utils.firstDefined(undefined, 2, 3)).toEqual(2);
  expect(Utils.firstDefined(undefined, undefined, 3)).toEqual(3);
  expect(Utils.firstDefined(undefined, undefined, undefined)).toEqual(
    undefined
  );
});
