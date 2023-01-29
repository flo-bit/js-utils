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
    if (x != undefined && typeof x == "object" && x.x != undefined) {
      this.copy(x);
    } else {
      this.set(x ?? 0, y, z, w);
    }

    this.isVector = true;
    return this;
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
      this.x != undefined &&
      this.y != undefined &&
      this.z == undefined &&
      this.w == undefined
    );
  }
  get is3D() {
    return (
      this.x != undefined &&
      this.y != undefined &&
      this.z != undefined &&
      this.w == undefined
    );
  }
  get is4D() {
    return (
      this.x != undefined &&
      this.y != undefined &&
      this.z != undefined &&
      this.w != undefined
    );
  }

  clone() {
    return new Vector(this.x, this.y, this.z, this.w);
  }
  set(x, y, z, w) {
    if (typeof x != "number" && x.x != undefined) {
      return this.copy(x);
    }
    if (y == undefined && z == undefined && w == undefined) {
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
    if (typeof x != "number" && x.x != undefined) {
      return this.add(x.x, x.y, x.z, x.w);
    }
    if (y == undefined && z == undefined && w == undefined) {
      if (this.is3D) this.add(x, x, x);
      else if (this.is4D) this.add(x, x, x, x);
      else this.add(x, x);
      return this;
    }
    this.x += x ?? 0;
    this.y += y ?? 0;
    this.z += z ?? 0;
    this.w += w ?? 0;
    return this;
  }
  sub(x, y, z, w) {
    if (typeof x != "number" && x.x != undefined) {
      return this.sub(x.x, x.y, x.z, x.w);
    }
    if (y == undefined && z == undefined && w == undefined) {
      if (this.is3D) this.sub(x, x, x);
      else if (this.is4D) this.sub(x, x, x, x);
      else this.sub(x, x);
      return this;
    }
    this.x -= x ?? 0;
    this.y -= y ?? 0;
    this.z -= z ?? 0;
    this.w -= w ?? 0;
    return this;
  }
  mult(x, y, z, w) {
    if (typeof x != "number" && x.x != undefined) {
      return this.mult(x.x, x.y, x.z, x.w);
    }
    if (y == undefined && z == undefined && w == undefined) {
      if (this.is3D) this.mult(x, x, x);
      else if (this.is4D) this.mult(x, x, x, x);
      else this.mult(x, x);
      return this;
    }
    this.x *= x ?? 1;
    this.y *= y ?? 1;
    this.z *= z ?? 1;
    this.w *= w ?? 1;
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
    this.z /= z ?? 1;
    this.w /= w ?? 1;
    return this;
  }
  dot(vec) {
    if (vec == undefined) console.warn("dot(vec) requires a vector");
    return (
      this.x * vec.x +
      this.y * vec.y +
      (this.z != undefined ? this.z * vec.z : 0) +
      (this.w != undefined ? this.w * vec.w : 0)
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

  dist(x, y, z, w) {
    if (typeof x != "number" && x.x != undefined) {
      return this.dist(x.x, x.y, x.z, x.w);
    }
    let sum = 0;
    let dx = this.x - x;
    sum += dx * dx;
    let dy = (this.y || 0) - (y || 0);
    sum += dy * dy;
    let dz = (this.z || 0) - (z || 0);
    sum += dz * dz;
    let dw = (this.w || 0) - (w || 0);
    sum += dw * dw;
    return Math.sqrt(sum);
  }
  distance(x, y, z, w) {
    return this.dist(x, y, z, w);
  }
  distanceTo(x, y, z, w) {
    return this.dist(x, y, z, w);
  }
  length() {
    return Math.sqrt(
      this.x * this.x +
        this.y * this.y +
        (this.z || 0) * (this.z || 0) +
        (this.w || 0) * (this.w || 0)
    );
  }

  setLength(l) {
    this.mult(l / this.length());
    return this;
  }
  limit(l) {
    let length = this.length();
    if (length > l) this.mult(length / l);
    return this;
  }

  abs() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    this.z = Math.abs(this.z);
    this.w = Math.abs(this.w);
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

export default Vector;
