import * as tslib_1 from "tslib";
import { get } from './utils';
function normalizedDispatch(dispatch, namespace, type, payload, options) {
    if (typeof type === 'string') {
        return dispatch(namespace + type, payload, options);
    }
    else {
        return dispatch(tslib_1.__assign({}, type, { type: namespace + type.type }), payload);
    }
}
export function commit(store, namespace, type, payload, options) {
    normalizedDispatch(store.commit, namespace, type, payload, options);
}
export function dispatch(store, namespace, type, payload, options) {
    return normalizedDispatch(store.dispatch, namespace, type, payload, options);
}
export function getters(store, namespace) {
    var sliceIndex = namespace.length;
    var getters = {};
    Object.keys(store.getters).forEach(function (key) {
        var sameNamespace = namespace === key.slice(0, sliceIndex);
        var name = key.slice(sliceIndex);
        if (!sameNamespace || !name) {
            return;
        }
        Object.defineProperty(getters, name, {
            get: function () { return store.getters[key]; },
            enumerable: true
        });
    });
    return getters;
}
var Context = /** @class */ (function () {
    /** @internal */
    function Context(pos, store, mutationNames, actionNames) {
        var _this = this;
        this.pos = pos;
        this.store = store;
        this.mutationNames = mutationNames;
        this.actionNames = actionNames;
        this.commit = function (type, payload, options) {
            return commit(_this.store, _this.pos.namespace, type, payload, options);
        };
        this.dispatch = function (type, payload, options) {
            return dispatch(_this.store, _this.pos.namespace, type, payload, options);
        };
    }
    Object.defineProperty(Context.prototype, "mutations", {
        get: function () {
            var _this = this;
            if (this.__mutations__) {
                return this.__mutations__;
            }
            var mutations = {};
            this.mutationNames.forEach(function (name) {
                Object.defineProperty(mutations, name, {
                    value: function (payload) {
                        return commit(_this.store, _this.pos.namespace, name, payload);
                    },
                    enumerable: true
                });
            });
            return (this.__mutations__ = mutations);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "actions", {
        get: function () {
            var _this = this;
            if (this.__actions__) {
                return this.__actions__;
            }
            var actions = {};
            this.actionNames.forEach(function (name) {
                Object.defineProperty(actions, name, {
                    value: function (payload) {
                        return dispatch(_this.store, _this.pos.namespace, name, payload);
                    },
                    enumerable: true
                });
            });
            return (this.__actions__ = actions);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "state", {
        get: function () {
            return get(this.pos.path, this.store.state);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "getters", {
        get: function () {
            return getters(this.store, this.pos.namespace);
        },
        enumerable: true,
        configurable: true
    });
    return Context;
}());
export { Context };
