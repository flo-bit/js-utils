/**
 * vector class for 2D, 3D and 4D vectors
 *
 */
class Vector {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @param {number} w
   * @returns {Vector}
   * @constructor
   */
  constructor(x, y, z, w) {
    this.isVector = true;
    if (Vector.isVectorObject(x)) {
      this.copy(x);
    } else {
      this.set(x ?? 0, y, z, w);
    }

    return this;
  }

  static isVectorObject(i) {
    return i != undefined && typeof i == "object" && Vector.isNumber(i.x);
  }

  static isNumber(i) {
    return i != undefined && typeof i == "number" && !isNaN(i);
  }

  copy(vec) {
    this.x = vec.x;
    this.y = vec.y;
    this.z = vec.z;
    this.w = vec.w;

    return this;
  }

  get is2D() {
    return (
      Vector.isNumber(this.x) &&
      Vector.isNumber(this.y) &&
      !Vector.isNumber(this.z) &&
      !Vector.isNumber(this.w)
    );
  }
  get is3D() {
    return (
      Vector.isNumber(this.x) &&
      Vector.isNumber(this.y) &&
      Vector.isNumber(this.z) &&
      !Vector.isNumber(this.w)
    );
  }
  get is4D() {
    return (
      Vector.isNumber(this.x) &&
      Vector.isNumber(this.y) &&
      Vector.isNumber(this.z) &&
      Vector.isNumber(this.w)
    );
  }

  get dimension() {
    if (this.is2D) return 2;
    if (this.is3D) return 3;
    if (this.is4D) return 4;
    return 0;
  }
  get isZero() {
    return (
      this.x == 0 &&
      this.y == 0 &&
      (this.z == 0 || !Vector.isNumber(this.z)) &&
      (this.w == 0 || !Vector.isNumber(this.w))
    );
  }

  clone() {
    return new Vector(this);
  }
  set(x, y, z, w) {
    if (Vector.isVectorObject(x)) {
      return this.copy(x);
    }
    if (!Vector.isNumber(y) && !Vector.isNumber(z) && !Vector.isNumber(w)) {
      if (this.is3D) this.set(x, x, x);
      else if (this.is4D) this.set(x, x, x, x);
      else this.set(x, x);
      return this;
    }
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }
  add(x, y, z, w) {
    if (Vector.isVectorObject(x)) {
      return this.add(x.x, x.y, x.z, x.w);
    }
    if (!Vector.isNumber(y) && !Vector.isNumber(z) && !Vector.isNumber(w)) {
      if (this.is3D) this.add(x, x, x);
      else if (this.is4D) this.add(x, x, x, x);
      else this.add(x, x);
      return this;
    }
    this.x += x ?? 0;
    this.y += y ?? 0;
    if (Vector.isNumber(this.z)) this.z += z ?? 0;
    if (Vector.isNumber(this.w)) this.w += w ?? 0;
    return this;
  }
  sub(x, y, z, w) {
    if (Vector.isVectorObject(x)) {
      return this.sub(x.x, x.y, x.z, x.w);
    }
    if (!Vector.isNumber(y) && !Vector.isNumber(z) && !Vector.isNumber(w)) {
      if (this.is3D) this.sub(x, x, x);
      else if (this.is4D) this.sub(x, x, x, x);
      else this.sub(x, x);
      return this;
    }
    this.x -= x ?? 0;
    this.y -= y ?? 0;
    if (Vector.isNumber(this.z)) this.z -= z ?? 0;
    if (Vector.isNumber(this.w)) this.w -= w ?? 0;
    return this;
  }
  mult(x, y, z, w) {
    if (Vector.isVectorObject(x)) {
      return this.mult(x.x, x.y, x.z, x.w);
    }
    if (!Vector.isNumber(y) && !Vector.isNumber(z) && !Vector.isNumber(w)) {
      if (this.is3D) this.mult(x, x, x);
      else if (this.is4D) this.mult(x, x, x, x);
      else this.mult(x, x);
      return this;
    }
    this.x *= x ?? 1;
    this.y *= y ?? 1;
    if (Vector.isNumber(this.z)) this.z *= z ?? 1;
    if (Vector.isNumber(this.w)) this.w *= w ?? 1;
    return this;
  }
  div(x, y, z, w) {
    if (typeof x != "number" && x.x != undefined) {
      return this.div(x.x, x.y, x.z, x.w);
    }
    if (y == undefined && z == undefined && w == undefined) {
      if (this.is3D) this.div(x, x, x);
      else if (this.is4D) this.div(x, x, x, x);
      else this.div(x, x);
      return this;
    }
    this.x /= x ?? 1;
    this.y /= y ?? 1;
    if (this.z != undefined) this.z /= z ?? 1;
    if (this.w != undefined) this.w /= w ?? 1;
    return this;
  }
  dot(vec) {
    if (!Vector.isVectorObject(vec)) console.warn("dot(vec) requires a vector");
    return (
      this.x * vec.x +
      this.y * vec.y +
      (Vector.isNumber(this.z) ? this.z * vec.z : 0) +
      (Vector.isNumber(this.w) ? this.w * vec.w : 0)
    );
  }
  // 3D only
  cross(vec) {
    if (!this.is3D || !vec.is3D)
      console.warn("cross(vec) only supports 3D vectors");
    return new Vector(
      this.y * vec.z - this.z * vec.y,
      this.z * vec.x - this.x * vec.z,
      this.x * vec.y - this.y * vec.x
    );
  }

  distSquared(x, y, z, w) {
    if (Vector.isVectorObject(x)) {
      return this.dist(x.x, x.y, x.z, x.w);
    }
    let sum = 0;
    let dx = (this.x ?? 0) - (x ?? 0);
    sum += dx * dx;
    let dy = (this.y ?? 0) - (y ?? 0);
    sum += dy * dy;
    let dz = (this.z ?? 0) - (z ?? 0);
    sum += dz * dz;
    let dw = (this.w ?? 0) - (w ?? 0);
    sum += dw * dw;
    return sum;
  }
  dist(x, y, z, w) {
    return Math.sqrt(this.distSquared(x, y, z, w));
  }
  distance(x, y, z, w) {
    return this.dist(x, y, z, w);
  }
  distanceTo(x, y, z, w) {
    return this.dist(x, y, z, w);
  }
  length() {
    return this.dist(0, 0, 0, 0);
  }
  lengthSquared() {
    return this.distSquared(0, 0, 0, 0);
  }

  setLength(l) {
    let currentLength = this.length();
    if (currentLength != 0) this.mult(l / currentLength);
    else console.warn("setLength() can't set length of a zero vector");

    return this;
  }
  limit(maxLength) {
    let currentLength = this.length();
    if (currentLength == 0) {
      console.warn("limit() can't limit a zero vector");
      return this;
    }
    if (currentLength > maxLength) this.mult(maxLength / currentLength);
    return this;
  }

  abs() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    if (Vector.isNumber(this.z)) this.z = Math.abs(this.z);
    if (Vector.isNumber(this.w)) this.w = Math.abs(this.w);
    return this;
  }
  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    if (Vector.isNumber(this.z)) this.z = Math.floor(this.z);
    if (Vector.isNumber(this.w)) this.w = Math.floor(this.w);
    return this;
  }
  ceil() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    if (Vector.isNumber(this.z)) this.z = Math.ceil(this.z);
    if (Vector.isNumber(this.w)) this.w = Math.ceil(this.w);
    return this;
  }
  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    if (Vector.isNumber(this.z)) this.z = Math.round(this.z);
    if (Vector.isNumber(this.w)) this.w = Math.round(this.w);
    return this;
  }

  // 2d only
  heading() {
    if (!this.is2D) console.warn("heading() only supports 2D vectors");

    return Math.atan2(this.x, this.y);
  }
  // 2d only
  rotate(a) {
    if (!this.is2D) console.warn("rotate(a) only supports 2D vectors");

    let ca = Math.cos(a);
    let sa = Math.sin(a);
    this.set(ca * this.x - sa * this.y, sa * this.x + ca * this.y);
    return this;
  }

  angleBetween(vec) {
    let d = this.dot(vec);
    let l = this.length() * vec.length();
    return Math.acos(d / l);
  }
  angleTo(vec) {
    return this.angleBetween(vec);
  }
  equals(vec) {
    return (
      this.x == vec.x && this.y == vec.y && this.z == vec.z && this.w == vec.w
    );
  }

  normalize() {
    this.setLength(1);
    return this;
  }
  normalized() {
    return this.clone().normalize();
  }

  mag() {
    return this.length();
  }
  setMag(m) {
    this.setLength(m);
    return this;
  }
  manhattanLength() {
    return this.x + this.y + (this.z || 0) + (this.w || 0);
  }
  lerp(vec, a) {
    let dx = vec.x - this.x;
    let dy = vec.y - this.y;
    let dz = vec.z - this.z;
    let dw = vec.w - this.w;
    this.add(dx * a, dy * a, dz * a, dw * a);
    return this;
  }

  stringDescription() {
    let dimension = this.is2D ? "2D" : this.is3D ? "3D" : "4D";
    let str = dimension + " vec (" + this.x + ", " + this.y;
    if (this.z != undefined) str += ", " + this.z;
    if (this.w != undefined) str += ", " + this.w;
    str += ")";
    return str;
  }

  // 2d vector from angle and optional length (default length 1)
  static fromAngle2D(a, l) {
    let v = new Vector(Math.cos(a), Math.sin(a));
    if (l) v.setLength(l);
    return v;
  }

  // random 2d vector with length between 0 and 1
  // or set length
  static random2D(l, random = Math.random) {
    let v = new Vector(random() * 2 - 1, random() * 2 - 1);
    while (v.length() > 1) {
      v.set(random() * 2 - 1, random() * 2 - 1);
    }
    if (l) v.setLength(l);
    return v;
  }

  // random 3d vector with length between 0 and 1
  // or set length
  static random3D(l, random = Math.random) {
    let v = new Vector(random() * 2 - 1, random() * 2 - 1, random() * 2 - 1);
    while (v.length() > 1) {
      v.set(random() * 2 - 1, random() * 2 - 1, random() * 2 - 1);
    }
    if (l) v.setLength(l);
    return v;
  }

  static breakIntoParts(a, b, parts) {
    if (a == undefined || b == undefined || !a.isVector || !b.isVector) return;

    parts = Math.floor(parts || 2);
    let arr = [a.clone()];
    for (let i = 1; i < parts; i++) {
      arr.push(a.clone().lerp(b, i / parts));
    }
    arr.push(b.clone());
    return arr;
  }
}

// for testing:
//module.exports = Vector;

export default Vector;
