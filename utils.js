class Utils {
  static isDict(a) {
    return a != undefined && a.constructor == Object;
  }
  static isObject(a) {
    return Utils.isDict(a);
  }
  static isString(a) {
    return typeof a === "string" || a instanceof String;
  }
  static isNumber(a) {
    return typeof a === "number";
  }
  static isFunction(a) {
    return typeof a === "function";
  }
  static isArray(a) {
    return Array.isArray(a);
  }
  static isBool(a) {
    return typeof a === "boolean";
  }
  static isNull(a) {
    return a === null;
  }
  static isDefined(a) {
    return a !== undefined;
  }
  static firstDefined(...arr) {
    if (arr == undefined) return;

    for (let element of arr) {
      if (element != undefined) return element;
    }
  }
  static deepClone(a) {
    if (!Utils.isDict(a)) return a;

    let myClone = {};
    for (let k of Object.keys(a)) {
      myClone[k] = Utils.deepClone(a[k]);
    }
    return myClone;
  }

  // merge dictionaries a and b with priority to a
  static mergeTwoDicts(a, b) {
    if (b == undefined) return Utils.deepClone(a);
    if (a == undefined) return Utils.deepClone(b);

    let result = Utils.deepClone(a);
    for (let k of Object.keys(b)) {
      if (a[k] == undefined) {
        result[k] = Utils.deepClone(b[k]);
      } else if (Utils.isDict(a[k]) && Utils.isDict(b[k])) {
        result[k] = Utils.mergeTwoDicts(a[k], b[k]);
      }
    }
    return result;
  }

  static merge(...arr) {
    let result = arr[0];
    for (let i = 1; i < arr.length; i++) {
      result = Utils.mergeTwoDicts(result, arr[i]);
    }
    return result;
  }

  /**
   * get a number from a variable
   * if variable is a number, return it
   * if variable is a function, call it with settings and return the result
   * if variable is a dictionary, return a random number between min and max
   *
   * @param {*} obj
   * @param {*} settings
   * @returns
   */
  static getNumber(obj, settings) {
    if (Utils.isNumber(obj)) {
      return obj;
    }
    if (Utils.isFunction(obj)) {
      return obj(settings);
    }
    if (Utils.isDict(obj)) {
      if (Utils.isNumber(obj.min) && Utils.isNumber(obj.max)) {
        let rng = settings.rng || Math.random;
        return obj.min + rng() * (obj.max - obj.min);
      }
    }
  }
}
module.exports = Utils;
