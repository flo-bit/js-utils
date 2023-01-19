class Utils {
  static isObject(a) {
    return a != undefined && a.constructor == Object;
  }
  static isDict(a) {
    return Utils.isObject(a);
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

  static isNaN(a) {
    return Number.isNaN(a);
  }

  /**
   * return the first defined value in a list of values
   *
   * @param  {...any} arr
   * @returns {any}
   */
  static firstDefined(...arr) {
    if (arr == undefined) return;

    for (let element of arr) {
      if (element != undefined) return element;
    }
  }
  /**
   * recursively clone an object
   *
   * @param {object} a
   * @returns
   */
  static deepClone(a) {
    if (Utils.isArray(a)) return a.map((x) => Utils.deepClone(x));
    if (!Utils.isObject(a)) return a;

    let myClone = {};
    for (let k of Object.keys(a)) {
      myClone[k] = Utils.deepClone(a[k]);
    }
    return myClone;
  }

  /**
   *  recursively merge object a and b with priority to a
   *
   * @param {object} a
   * @param {object} b
   *
   * @returns {object}
   */
  static mergeTwoObjects(a, b) {
    if (b == undefined) return Utils.deepClone(a);
    if (a == undefined) return Utils.deepClone(b);

    let result = Utils.deepClone(a);
    for (let k of Object.keys(b)) {
      if (a[k] == undefined) {
        result[k] = Utils.deepClone(b[k]);
      } else if (Utils.isObject(a[k]) && Utils.isObject(b[k])) {
        result[k] = Utils.mergeTwoObjects(a[k], b[k]);
      }
    }
    return result;
  }

  /**
   * recursively merge multiple objects with priority to earlier objects
   *
   * @param  {...object} arr
   * @returns {object}
   */
  static merge(...arr) {
    let result = arr[0];
    for (let i = 1; i < arr.length; i++) {
      result = Utils.mergeTwoObjects(result, arr[i]);
    }
    return result;
  }

  /**
   * get a number from a variable
   * if variable is a number, return it
   * if variable is a function, call it with settings and return the result
   * if variable is a dictionary,
   *    return a random number between min and max
   *    return val if it is a number
   *    call get() function with settings and return the result
   *
   * @param {*} obj
   * @param {object} settings
   * @param {number} defaultVal
   * @returns {number}
   */
  static getNumber(obj, settings, defaultVal) {
    if (obj == undefined) {
      return defaultVal;
    }
    if (Utils.isNumber(obj)) {
      return obj;
    }
    if (Utils.isFunction(obj)) {
      return obj(settings);
    }
    if (Utils.isObject(obj)) {
      if (Utils.isNumber(obj.min) && Utils.isNumber(obj.max)) {
        let rng = settings.rng ?? Math.random;
        return obj.min + rng() * (obj.max - obj.min);
      }
      if (Utils.isNumber(obj.val)) {
        return obj.val;
      }
      if (Utils.isFunction(obj.get)) {
        return obj.get(settings, obj);
      }
    }
  }

  static loadScript(script) {
    return new Promise((resolve, reject) => {
      let scriptElement = document.createElement("script");
      script.src = script;
      scriptElement.onload = resolve;
      scriptElement.onerror = reject;
      document.head.appendChild(scriptElement);
    });
  }

  static loadScripts(scripts) {
    let promises = [];
    for (let script of scripts) {
      promises.push(Utils.loadScript(script));
    }
    return Promise.all(promises);
  }

  /**
   * if a is not an object, return an object with key and a as value
   *
   * @param {any} a
   * @param {string} key
   * @returns {object}
   */
  static turnIntoObject(a, key) {
    if (Utils.isObject(a)) return Utils.deepClone(a);

    let obj = {};
    obj[key] = a;
    return obj;
  }
  static makeObject(a, key) {
    return Utils.turnIntoObject(a, key);
  }

  /**
   * if a is not an object turn it into an object with a[key] = a
   * return merge of a and b[a[key]]
   *
   * @param {any} a
   * @param {object} b
   * @param {string} key - default is "preset"
   * @returns {object}
   */
  static combineObjectsWithKey(a, b, key = "preset") {
    a = Utils.turnIntoObject(a, key);

    let value = a[key];
    if (Utils.isString(value) && Utils.isObject(b)) {
      return Utils.merge(a, b[value]);
    }
    return a;
  }

  /**
   * short version of combineObjectsWithKey
   *
   * if a is not an object turn it into an object with a[key] = a
   * return merge of a and b[a[key]]
   *
   * @param {any} a
   * @param {object} b
   * @param {string} key - default is "preset"
   * @returns {object}
   */
  static combine(a, b, key) {
    return Utils.combineObjectsWithKey(a, b, key);
  }

  /**
   * get all values of an object
   *
   * @param {object} obj
   * @returns {array}
   */
  static values(obj) {
    let result = [];
    for (let k of Object.keys(obj)) {
      if (obj[k] != undefined) result.push(obj[k]);
    }
    return result;
  }

  /**
   * get all keys of an object
   *
   * @param {object} obj
   * @returns {array}
   */
  static keys(obj) {
    return Object.keys(obj);
  }

  /**
   * recursively resolve functions in an object,
   * all functions are called with params
   *
   * @param {object} obj
   * @param {object} params
   * @returns {object}
   */
  static resolveFunctions(obj, params) {
    if (Utils.isFunction(obj)) {
      return obj(params);
    }
    if (Utils.isObject(obj)) {
      let result = {};
      for (let k of Object.keys(obj)) {
        result[k] = Utils.resolveFunctions(obj[k], params);
      }
      return result;
    }
    if (Utils.isArray(obj)) {
      let result = [];
      for (let i = 0; i < obj.length; i++) {
        result.push(Utils.resolveFunctions(obj[i], params));
      }
      return result;
    }
    return obj;
  }
}
module.exports = Utils;
