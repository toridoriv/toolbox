// @ts-nocheck
/* eslint-disable */

'use strict';

// source/type-of.ts
typeOf.PRIMITIVES = ["string", "number", "bigint", "boolean", "symbol", "undefined", "null"];
typeOf.TYPES = [...typeOf.PRIMITIVES, "array", "function", "map", "set", "date", "regexp", "error", "object"];
typeOf.OBJECT_LIKE_CONSTRUCTORS = [Array, Map, Function, Set, Date, RegExp, Error];
function typeOf(value) {
  const native = typeof value;
  if (native !== "object") {
    return native;
  }
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return "array";
  }
  const ctor = typeOf.OBJECT_LIKE_CONSTRUCTORS.find((c) => isInstanceOf(c, value));
  if (ctor) {
    return ctor.name.toLowerCase();
  }
  return native;
}
function isInstanceOf(type, value) {
  return value instanceof type;
}

// source/is.ts
exports.is = (() => {
  let is2 = function is3(type, value) {
    const actualType = typeOf(value);
    return actualType === type;
  };
  is2 = new Proxy(is2, {
    get(target, prop) {
      if (prop in target) {
        return Reflect.get(target, prop);
      }
      if (!typeOf.TYPES.includes(prop)) {
        throw new TypeError(`Type "${prop}" is not a valid type.`);
      }
      const method = is2.bind(null, prop);
      Object.defineProperty(method, "name", {
        value: prop,
        configurable: true,
        writable: false,
        enumerable: false
      });
      Object.defineProperty(target, prop, {
        value: method,
        enumerable: true,
        configurable: true,
        writable: false
      });
      return Reflect.get(target, prop);
    }
  });
  is2.arrow = function arrow(value) {
    if (!is2("function", value)) return false;
    const lines = value.toString().split("\n");
    return lines[0].includes(")=>");
  };
  is2.async = function async(value) {
    return is2("function", value) && value.toString().startsWith("async ");
  };
  is2.primitive = function primitive(value) {
    const type = typeOf(value);
    return typeOf.PRIMITIVES.includes(type);
  };
  const not = new Proxy({}, {
    get(target, prop) {
      if (prop in target) {
        return Reflect.get(target, prop);
      }
      const og = is2[prop];
      const method = function(value) {
        return !og(value);
      };
      Object.defineProperty(method, "name", {
        value: prop,
        configurable: true,
        writable: false,
        enumerable: false
      });
      Object.defineProperty(target, prop, {
        value: method,
        enumerable: true,
        configurable: true,
        writable: false
      });
      return Reflect.get(target, prop);
    }
  });
  is2.not = not;
  return is2;
})();
function coerce(value) {
  return value;
}

// source/collections.ts
defineValue.ALLOWED_TYPES = Object.freeze(["object", "function"]);
function defineValue(obj, key, descriptor, value) {
  if (!defineValue.ALLOWED_TYPES.includes(typeOf(obj))) {
    throw new TypeError(`First argument MUST BE one of: ${defineValue.ALLOWED_TYPES.join(", ")}.`, {
      cause: {
        received: {
          value: obj,
          type: typeOf(obj)
        }
      }
    });
  }
  if (exports.is.not.undefined(value)) {
    descriptor.value = value;
  }
  return coerce(Object.defineProperty(obj, key, descriptor));
}
function getUnique(list) {
  return Array.from(new Set(list));
}

// source/clone.ts
function clone(value) {
  const type = exports.is.primitive(value) ? "primitive" : typeOf(value);
  return coerce(clone[type])(value);
}
clone.set = function cloneSet(value) {
  if (!exports.is.set(value)) {
    throw new TypeError("Argument must be a Set object.", {
      cause: {
        received: {
          value,
          type: typeOf(value)
        }
      }
    });
  }
  return coerce(new Set(clone.array(Array.from(value))));
};
clone.regexp = function cloneRegExp(value) {
  if (!exports.is.regexp(value)) {
    throw new TypeError("Argument must be a RegExp object.", {
      cause: {
        received: {
          value,
          type: typeOf(value)
        }
      }
    });
  }
  return new RegExp(value.source, value.flags);
};
clone.error = function cloneError(error) {
  if (!exports.is.error(error)) {
    throw new TypeError("Argument must be an Error object.", {
      cause: {
        received: {
          value: error,
          type: typeOf(error)
        }
      }
    });
  }
  const clonedError = Object.create(error.constructor.prototype, Object.getOwnPropertyDescriptors(error));
  const { set, get, ...stackDescriptor } = Object.getOwnPropertyDescriptor(error, "stack") || {};
  Object.defineProperty(clonedError, "stack", {
    ...stackDescriptor,
    value: error.stack
  });
  return clone.object(error, clonedError);
};
clone.primitive = function clonePrimitive(value) {
  return value;
};
clone.array = function cloneArray(list) {
  return list.map(clone);
};
clone.function = function cloneFunction(fn) {
  let body = fn.toString();
  if (!exports.is.arrow(fn) && !body.startsWith("function")) {
    body = `function ${body}`;
  }
  const result = new Function("return " + body)();
  defineValue(result, "name", { value: fn.name, writable: false, configurable: true, enumerable: false });
  return clone.object(fn, result);
};
clone.date = function cloneDate(date) {
  if (!exports.is.date(date)) {
    throw new TypeError("Argument must be a Date object.", {
      cause: {
        received: {
          value: date,
          type: typeOf(date)
        }
      }
    });
  }
  return new Date(date.getTime());
};
clone.map = function cloneMap(value) {
  if (!exports.is.map(value)) {
    throw new TypeError("Argument must be a Map object.", {
      cause: {
        received: {
          value,
          type: typeOf(value)
        }
      }
    });
  }
  const result = /* @__PURE__ */ new Map();
  for (const [key, val] of value) {
    result.set(clone(key), clone(val));
  }
  return coerce(result);
};
clone.object = function cloneObject(obj, target = {}) {
  if (!exports.is.object(obj) && !exports.is.function(obj)) {
    throw new TypeError("Argument must be an object or a function.", {
      cause: {
        received: {
          value: obj,
          type: typeOf(obj)
        }
      }
    });
  }
  for (const key in obj) {
    if (!(key in target)) {
      const descriptors = Object.getOwnPropertyDescriptor(obj, key);
      Object.defineProperty(target, key, {
        ...descriptors,
        value: clone(obj[key])
      });
    }
  }
  return target;
};

// source/merge.ts
merge.STRATEGY_BY_TYPE = Object.freeze({
  array: "merge",
  map: "merge",
  set: "merge",
  object: "merge",
  primitive: "replace",
  date: "replace",
  regexp: "replace",
  error: "replace",
  function: "replace"
});
merge.MERGEABLE = Object.freeze(["array", "map", "set", "object", "regexp"]);
function merge(a, b, options = {}) {
  const opts = { ...merge.STRATEGY_BY_TYPE, ...options };
  const kindA = typeOf(a);
  const kindB = typeOf(b);
  if (merge.isMergeableType(kindA) && merge.isMergeableType(kindB) && kindA === kindB) {
    return merge[kindA](a, b, opts);
  }
  return clone(coerce([b, a].find(exports.is.not.undefined)));
}
merge.isMergeableType = function isMergeableType(type) {
  return merge.MERGEABLE.includes(type);
};
merge.object = function mergeObjects(a, b, options = {}) {
  if (!exports.is.object(a) || !exports.is.object(b)) {
    throw new TypeError("Both arguments must be objects.");
  }
  const keys = getUnique(coerce(Object.keys(a).concat(Object.keys(b))));
  const result = {};
  for (const key of keys) {
    result[key] = merge(a[key], b[key], options);
  }
  return result;
};
merge.array = function mergeArrays(a, b, options = {}) {
  if (!exports.is.array(a) || !exports.is.array(b)) {
    throw new TypeError("Both arguments must be arrays.");
  }
  if (options.array === "replace") {
    const defined = [b, a].filter(exports.is.not.undefined);
    return clone(defined[0]);
  }
  return clone([...a, ...b]);
};
merge.map = function mergeMaps(a, b, options = {}) {
  if (!exports.is.map(a) || !exports.is.map(b)) {
    throw new TypeError("Both arguments must be maps.");
  }
  if (options.map === "replace") {
    const defined = [b, a].filter(exports.is.not.undefined);
    return clone(defined[0]);
  }
  const result = clone(a);
  for (const [key, value] of b) {
    result.set(key, value);
  }
  return result;
};
merge.set = function mergeSets(a, b, options = {}) {
  if (!exports.is.set(a) || !exports.is.set(b)) {
    throw new TypeError("Both arguments must be sets.");
  }
  if (options.set === "replace") {
    const defined = [b, a].filter(exports.is.not.undefined);
    return clone(defined);
  }
  const result = clone(new Set(a));
  for (const value of b) {
    result.add(value);
  }
  return result;
};
merge.regexp = function mergeRegexp(a, b, options = {}) {
  if (!exports.is.regexp(a) || !exports.is.regexp(b)) {
    throw new TypeError("Both arguments must be regular expressions.");
  }
  if (options.regexp === "replace") {
    return clone(b);
  }
  const mergedSource = `${a.source}|${b.source}`;
  const mergedFlags = `${a.flags}${b.flags}`;
  let preresult = new RegExp(mergedSource, mergedFlags);
  const additionalProps = {
    ...Object.getOwnPropertyDescriptors(a.constructor.prototype),
    ...Object.getOwnPropertyDescriptors(b.constructor.prototype)
  };
  if ("constructor" in additionalProps) {
    delete additionalProps["constructor"];
  }
  Object.defineProperties(preresult, additionalProps);
  return preresult;
};

exports.clone = clone;
exports.coerce = coerce;
exports.defineValue = defineValue;
exports.getUnique = getUnique;
exports.isInstanceOf = isInstanceOf;
exports.merge = merge;
exports.typeOf = typeOf;
