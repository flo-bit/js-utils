# js-utils

some useful javascript methods and classes

## Use

```html
<script src="https://flo-bit.github.io/js-utils/utils.js"></script>
<script src="https://flo-bit.github.io/js-utils/vector.js"></script>
```

## Methods

### Utils

#### Utils.firstDefined

return the first defined value

```js
Utils.firstDefined(undefined, 2, 3); // 2
Utils.firstDefined(undefined, undefined, 3); // 3
Utils.firstDefined(undefined, undefined, undefined); // undefined
```

#### Utils.merge

merge multiple objects with priority to earlier objects (works recursively and also deep clones)

```js
Utils.merge({ a: 1 }, { b: 2 }); // { a: 1, b: 2 }
Utils.merge({ a: 1 }, { a: 2 }); // { a: 1 }
Utils.merge({ a: { b: 3 } }, { a: { b: 1, c: 2 } }); // { a: {b: 3, c:2} }
```

#### Utils.deepClone

deep clone an object

```js
const obj = { a: { b: 1 } };
const obj2 = Utils.deepClone(obj);
obj2.a.b = 2;
console.log(obj.a.b); // 1
```

#### Utils.resolve

resolve all functions in an object

```js
const obj = { a: () => 1 };
Utils.resolve(obj); // { a: 1 }

const obj2 = { a: (n) => n + 1, b: (n) => n * 2 };
Utils.resolve(obj2, 2); // { a: 3, b: 4 }
```

#### Utils.combine

```js
Utils.combine(a, b, (key = "preset"));
```

if a is not an object turn it into an object with `a[key] = a` return merge of a and `b[a[key]]`

```js
Utils.combine("a", { a: { b: 3 } }); // { preset: "a", b: 3 }
Utils.combine({ preset: "a", b: 3, c: 5 }, { a: { b: 10, c: 5 } }); // { preset: "a", b: 3, c: 5 }
```

#### Utils.loadScript

#### Utils.number

### Vector
