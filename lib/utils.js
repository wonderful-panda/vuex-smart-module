export var noop = function () { };
export function combine() {
    var fs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fs[_i] = arguments[_i];
    }
    return function (x) {
        fs.forEach(function (f) { return f(x); });
    };
}
export function get(path, value) {
    return path.reduce(function (acc, key) {
        return acc[key];
    }, value);
}
export function mapValues(record, fn) {
    var res = {};
    Object.keys(record).forEach(function (key) {
        res[key] = fn(record[key], key);
    });
    return res;
}
export function assert(condition, message) {
    if (!condition) {
        throw new Error("[vuex-smart-module] " + message);
    }
}
