export function inject(F, injection) {
    var proto = F.prototype;
    var descs = {};
    Object.keys(injection).forEach(function (key) {
        descs[key] = {
            configurable: true,
            enumerable: true,
            writable: true,
            value: injection[key]
        };
    });
    return Object.create(proto, descs);
}
var Getters = /** @class */ (function () {
    function Getters() {
    }
    Getters.prototype.$init = function (_store) { };
    Object.defineProperty(Getters.prototype, "state", {
        get: function () {
            return this.__ctx__.state;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Getters.prototype, "getters", {
        get: function () {
            return this.__ctx__.getters;
        },
        enumerable: true,
        configurable: true
    });
    return Getters;
}());
export { Getters };
var Mutations = /** @class */ (function () {
    function Mutations() {
    }
    Object.defineProperty(Mutations.prototype, "state", {
        get: function () {
            return this.__ctx__.state;
        },
        enumerable: true,
        configurable: true
    });
    return Mutations;
}());
export { Mutations };
var Actions = /** @class */ (function () {
    function Actions() {
    }
    Actions.prototype.$init = function (_store) { };
    Object.defineProperty(Actions.prototype, "state", {
        get: function () {
            return this.__ctx__.state;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actions.prototype, "getters", {
        get: function () {
            return this.__ctx__.getters;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actions.prototype, "commit", {
        get: function () {
            return this.__ctx__.commit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actions.prototype, "dispatch", {
        get: function () {
            return this.__ctx__.dispatch;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actions.prototype, "actions", {
        get: function () {
            return this.__ctx__.actions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Actions.prototype, "mutations", {
        get: function () {
            return this.__ctx__.mutations;
        },
        enumerable: true,
        configurable: true
    });
    return Actions;
}());
export { Actions };
