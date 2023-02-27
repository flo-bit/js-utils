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
    if (Array.isArray(x)) {
      return this.set(...x);
    }
    if (Vector.isVectorObject(x)) {
      return this.copy(x);
    }
    this.set(x ?? 0, y, z, w);

    return this;
  }

  static isVectorObject(i) {
    return i != undefined && typeof i == "object" && Vector.isNumber(i.x);
  }

  static isNumber(i) {
    return i != undefined && typeof i == "number" && !isNaN(i);
  }

  asArray() {
    let array = [this.x, this.y];
    if (Vector.isNumber(this.z)) array.push(this.z);
    if (Vector.isNumber(this.w)) array.push(this.w);
    return array;
  }

  copy(vec) {
    this.x = vec.x;
    this.y = vec.y;
    this.z = vec.z;
    this.w = vec.w;

    return this;
  }

  applyAxisAngle(axis, angle) {
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

    axis.normalize();
    const halfAngle = angle / 2,
      s = Math.sin(halfAngle);

    let quat = new Vector(
      axis.x * s,
      axis.y * s,
      axis.z * s,
      Math.cos(halfAngle)
    );
    return this.applyQuaternion(quat);
  }

  applyQuaternion(q) {
    const x = this.x,
      y = this.y,
      z = this.z;
    const qx = q.x,
      qy = q.y,
      qz = q.z,
      qw = q.w;

    // calculate quat * vector
    const ix = qw * x + qy * z - qz * y;
    const iy = qw * y + qz * x - qx * z;
    const iz = qw * z + qx * y - qy * x;
    const iw = -qx * x - qy * y - qz * z;

    // calculate result * inverse quat
    this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

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

  get isValid() {
    return this.is2D || this.is3D || this.is4D;
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
  scale(x, y, z, w) {
    return this.mult(x, y, z, w);
  }

  multiplyScalar(scalar) {
    return this.mult(scalar);
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
  rotate(a, b) {
    if (a != undefined && b != undefined) return this.applyAxisAngle(a, b);

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

  midpoint(vec) {
    return this.clone().lerp(vec, 0.5);
  }

  stringDescription() {
    let dimension = this.is2D ? "2D" : this.is3D ? "3D" : "4D";
    let str = dimension + " vec (" + this.x + ", " + this.y;
    if (this.z != undefined) str += ", " + this.z;
    if (this.w != undefined) str += ", " + this.w;
    str += ")";
    return str;
  }

  deepClone() {
    return Vector.deepClone(this);
  }

  static deepClone(a) {
    if (Array.isArray(a)) return a.map((x) => Vector.deepClone(x));
    if (!(a != undefined && a.constructor == Object)) return a;

    let myClone = {};
    for (let k of Object.keys(a)) {
      myClone[k] = Vector.deepClone(a[k]);
    }
    return myClone;
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

  static between(...args) {
    if (args.length == 0) return;

    let sum = args[0].clone();

    for (let i = 1; i < args.length; i++) {
      sum.add(args[i]);
    }

    return sum.div(args.length);
  }

  static verticesFromIndices(ver, ind) {
    let vertices = [];
    for (let i = 0; i < ind.length; i++) {
      let vi = ind[i] * 3;
      vertices.push(new Vector(ver[vi], ver[vi + 1], ver[vi + 2]));
    }
    return vertices;
  }

  static splitFaceAlongLongestSide(a, b, c, array) {
    array = array ?? [];
    let ab = a.distanceTo(b);
    let bc = b.distanceTo(c);
    let ca = c.distanceTo(a);
    if (ab > bc && ab > ca) {
      let mid = b.clone().add(a).divideScalar(2);
      array.push(
        a.clone(),
        mid.clone(),
        c.clone(),
        mid.clone(),
        b.clone(),
        c.clone()
      );
    } else if (bc > ab && bc > ca) {
      let mid = c.clone().add(b).divideScalar(2);
      array.push(
        a.clone(),
        b.clone(),
        mid.clone(),
        mid.clone(),
        c.clone(),
        a.clone()
      );
    } else {
      let mid = a.clone().add(c).divideScalar(2);
      array.push(
        a.clone(),
        b.clone(),
        mid.clone(),
        b.clone(),
        c.clone(),
        mid.clone()
      );
    }
    return array;
  }

  static subdivideFace(a, b, c, array) {
    array = array ?? [];
    let d = Vector.between(a, b);
    let e = Vector.between(b, c);
    let f = Vector.between(c, a);
    array.push(d.clone(), e.clone(), f.clone());
    array.push(a.clone(), d.clone(), f.clone());
    array.push(d.clone(), b.clone(), e.clone());
    array.push(e.clone(), c.clone(), f.clone());
    return array;
  }

  static isVectorInFace(a, b, c, v) {
    var v0 = c.clone().sub(a);
    var v1 = b.clone().sub(a);
    var v2 = v.clone().sub(a);
    var dot00 = v0.dot(v0);
    var dot01 = v0.dot(v1);
    var dot02 = v0.dot(v2);
    var dot11 = v1.dot(v1);
    var dot12 = v1.dot(v2);
    var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    var v = (dot00 * dot12 - dot01 * dot02) * invDenom;
    return u >= 0 && v >= 0 && u + v < 1;
  }

  static randomVectorInFace(a, b, c, random) {
    random = random ?? Math.random;
    // Call the corners of the triangle A, B, C, the side vectors AB, BC, AC
    let ab = b.clone().sub(a);
    let ac = c.clone().sub(a);
    // generate two random numbers in [0,1] called u and v.
    let u = random();
    let v = random();
    // Let p = u * AB + v * AC.
    let p = ab.clone().multiplyScalar(u).add(ac.clone().multiplyScalar(v));

    // If A+p is inside the triangle, return A+p
    let point = a.clone().add(p);

    // If A+p is outside the triangle, return A + AB + AC - p
    if (!Vector.isVectorInFace(face, point)) {
      point.sub(p.multiplyScalar(2));
      point.add(ab);
      point.add(ac);
    }
    return point;
  }
}

// for testing:
// module.exports = Vector;

export default Vector;
