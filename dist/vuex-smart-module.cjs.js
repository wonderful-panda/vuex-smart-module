/*!
 * vuex-smart-module v0.2.7
 * https://github.com/ktsn/vuex-smart-module
 *
 * @license
 * Copyright (c) 2018 katashin
 * Released under the MIT license
 * https://github.com/ktsn/vuex-smart-module/blob/master/LICENSE
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vuex = require('vuex');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function inject(F, injection) {
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

var noop = function () { };
function combine() {
    var fs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fs[_i] = arguments[_i];
    }
    return function (x) {
        fs.forEach(function (f) { return f(x); });
    };
}
function get(path, value) {
    return path.reduce(function (acc, key) {
        return acc[key];
    }, value);
}
function mapValues(record, fn) {
    var res = {};
    Object.keys(record).forEach(function (key) {
        res[key] = fn(record[key], key);
    });
    return res;
}
function assert(condition, message) {
    if (!condition) {
        throw new Error("[vuex-smart-module] " + message);
    }
}

function normalizedDispatch(dispatch, namespace, type, payload, options) {
    if (typeof type === 'string') {
        return dispatch(namespace + type, payload, options);
    }
    else {
        return dispatch(__assign({}, type, { type: namespace + type.type }), payload);
    }
}
function commit(store, namespace, type, payload, options) {
    normalizedDispatch(store.commit, namespace, type, payload, options);
}
function dispatch(store, namespace, type, payload, options) {
    return normalizedDispatch(store.dispatch, namespace, type, payload, options);
}
function getters(store, namespace) {
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

var ComponentMapper = /** @class */ (function () {
    function ComponentMapper(pos) {
        this.pos = pos;
    }
    ComponentMapper.prototype.mapState = function (map) {
        var pos = this.pos;
        return createMappedObject(map, function (value) {
            return function mappedStateComputed() {
                var state = get(pos.path, this.$store.state);
                if (typeof value === 'function') {
                    var getters$$1 = getters(this.$store, pos.namespace);
                    return value.call(this, state, getters$$1);
                }
                else {
                    return state[value];
                }
            };
        });
    };
    ComponentMapper.prototype.mapGetters = function (map) {
        var pos = this.pos;
        return createMappedObject(map, function (value) {
            function mappedGetterComputed() {
                return this.$store.getters[pos.namespace + value];
            }
            // mark vuex getter for devtools
            mappedGetterComputed.vuex = true;
            return mappedGetterComputed;
        });
    };
    ComponentMapper.prototype.mapMutations = function (map) {
        var pos = this.pos;
        return createMappedObject(map, function (value) {
            return function mappedMutationMethod() {
                var _this = this;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var commit$$1 = function (type, payload) {
                    return commit(_this.$store, pos.namespace, type, payload);
                };
                return typeof value === 'function'
                    ? value.apply(this, [commit$$1].concat(args))
                    : commit$$1(value, args[0]);
            };
        });
    };
    ComponentMapper.prototype.mapActions = function (map) {
        var pos = this.pos;
        return createMappedObject(map, function (value) {
            return function mappedActionMethod() {
                var _this = this;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var dispatch$$1 = function (type, payload) {
                    return dispatch(_this.$store, pos.namespace, type, payload);
                };
                return typeof value === 'function'
                    ? value.apply(this, [dispatch$$1].concat(args))
                    : dispatch$$1(value, args[0]);
            };
        });
    };
    return ComponentMapper;
}());
function createMappedObject(map, fn) {
    var normalized = !Array.isArray(map)
        ? map
        : map.reduce(function (acc, key) {
            acc[key] = key;
            return acc;
        }, {});
    return mapValues(normalized, fn);
}

var Module = /** @class */ (function () {
    function Module(options) {
        if (options === void 0) { options = {}; }
        this.options = options;
        this.mapper = new ComponentMapper(createLazyContextPosition(this));
    }
    Object.defineProperty(Module.prototype, "actionNames", {
        get: function () {
            var actions = this.options.actions;
            if (actions) {
                return gatherHandlerNames(actions.prototype, Actions);
            }
            else {
                return [];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Module.prototype, "mutationNames", {
        get: function () {
            var mutations = this.options.mutations;
            if (mutations) {
                return gatherHandlerNames(mutations.prototype, Mutations);
            }
            else {
                return [];
            }
        },
        enumerable: true,
        configurable: true
    });
    Module.prototype.clone = function () {
        var options = __assign({}, this.options);
        if (options.modules) {
            options.modules = mapValues(options.modules, function (m) { return m.clone(); });
        }
        return new Module(options);
    };
    Module.prototype.context = function (store) {
        return new Context(createLazyContextPosition(this), store, this.mutationNames, this.actionNames);
    };
    Module.prototype.mapState = function (map) {
        return this.mapper.mapState(map);
    };
    Module.prototype.mapGetters = function (map) {
        return this.mapper.mapGetters(map);
    };
    Module.prototype.mapMutations = function (map) {
        return this.mapper.mapMutations(map);
    };
    Module.prototype.mapActions = function (map) {
        return this.mapper.mapActions(map);
    };
    /* @internal */
    Module.prototype.create = function (path, namespace) {
        assert(!this.path || this.path.join('.') === path.join('.'), 'You are reusing one module on multiple places in the same store.\n' +
            'Clone it by `module.clone()` method to make sure every module in the store is unique.');
        this.path = path;
        this.namespace = namespace;
        var _a = this.options, namespaced = _a.namespaced, state = _a.state, getters$$1 = _a.getters, mutations = _a.mutations, actions = _a.actions, modules = _a.modules;
        var children = !modules
            ? undefined
            : Object.keys(modules).reduce(function (acc, key) {
                var m = modules[key];
                var nextNamespaced = m.options.namespaced === undefined ? true : m.options.namespaced;
                var nextNamespaceKey = nextNamespaced ? key + '/' : '';
                var res = m.create(path.concat(key), namespaced ? namespace + nextNamespaceKey : nextNamespaceKey);
                acc.options[key] = res.options;
                acc.injectStore = combine(acc.injectStore, res.injectStore);
                return acc;
            }, {
                options: {},
                injectStore: noop
            });
        var gettersInstance = getters$$1 && initGetters(getters$$1, this);
        var mutationsInstance = mutations && initMutations(mutations, this);
        var actionsInstance = actions && initActions(actions, this);
        return {
            options: {
                namespaced: namespaced === undefined ? true : namespaced,
                state: state ? new state() : {},
                getters: gettersInstance && gettersInstance.getters,
                mutations: mutationsInstance && mutationsInstance.mutations,
                actions: actionsInstance && actionsInstance.actions,
                modules: children && children.options
            },
            injectStore: combine(children ? children.injectStore : noop, gettersInstance ? gettersInstance.injectStore : noop, mutationsInstance ? mutationsInstance.injectStore : noop, actionsInstance ? actionsInstance.injectStore : noop)
        };
    };
    return Module;
}());
function createLazyContextPosition(module) {
    var message = 'The module need to be registered a store before using `context` or `componentMapper`';
    return {
        get path() {
            assert(module.path !== undefined, message);
            return module.path;
        },
        get namespace() {
            assert(module.namespace !== undefined, message);
            return module.namespace;
        }
    };
}
function initGetters(Getters$$1, module) {
    var getters$$1 = new Getters$$1();
    var options = {};
    traverseDescriptors(Getters$$1.prototype, Getters, function (desc, key) {
        if (typeof desc.value !== 'function' && !desc.get) {
            return;
        }
        options[key] = function () {
            var res = getters$$1[key];
            return typeof res === 'function' ? res.bind(getters$$1) : res;
        };
    });
    return {
        getters: options,
        injectStore: function (store) {
            var context = module.context(store);
            Object.defineProperty(getters$$1, '__ctx__', {
                get: function () { return context; }
            });
            getters$$1.$init(store);
        }
    };
}
function initMutations(Mutations$$1, module) {
    var mutations = new Mutations$$1();
    var options = {};
    traverseDescriptors(Mutations$$1.prototype, Mutations, function (desc, key) {
        if (typeof desc.value !== 'function') {
            return;
        }
        options[key] = function (_, payload) { return mutations[key](payload); };
    });
    return {
        mutations: options,
        injectStore: function (store) {
            var context = module.context(store);
            Object.defineProperty(mutations, '__ctx__', {
                get: function () { return context; }
            });
        }
    };
}
function initActions(Actions$$1, module) {
    var actions = new Actions$$1();
    var options = {};
    traverseDescriptors(Actions$$1.prototype, Actions, function (desc, key) {
        if (typeof desc.value !== 'function') {
            return;
        }
        options[key] = function (_, payload) { return actions[key](payload); };
    });
    return {
        actions: options,
        injectStore: function (store) {
            var context = module.context(store);
            Object.defineProperty(actions, '__ctx__', {
                get: function () { return context; }
            });
            actions.$init(store);
        }
    };
}
function traverseDescriptors(proto, Base, fn, exclude) {
    if (exclude === void 0) { exclude = { constructor: true }; }
    if (proto.constructor === Base) {
        return;
    }
    Object.getOwnPropertyNames(proto).forEach(function (key) {
        // Ensure to only choose most extended properties
        if (exclude[key])
            return;
        exclude[key] = true;
        var desc = Object.getOwnPropertyDescriptor(proto, key);
        fn(desc, key);
    });
    traverseDescriptors(Object.getPrototypeOf(proto), Base, fn, exclude);
}
function gatherHandlerNames(proto, Base) {
    var ret = [];
    traverseDescriptors(proto, Base, function (desc, name) {
        if (typeof desc.value !== 'function') {
            return;
        }
        ret.push(name);
    });
    return ret;
}

function registerModule(store, path, namespace, module, options) {
    var normalizedPath = typeof path === 'string' ? [path] : path;
    var _a = module.create(normalizedPath, normalizeNamespace(namespace)), moduleOptions = _a.options, injectStore = _a.injectStore;
    store.registerModule(normalizedPath, moduleOptions, options);
    injectStore(store);
}
function unregisterModule(store, module) {
    assert(module.path, 'The module seems not registered in the store');
    store.unregisterModule(module.path);
}
function normalizeNamespace(namespace) {
    if (namespace === '' || namespace === null) {
        return '';
    }
    return namespace[namespace.length - 1] === '/' ? namespace : namespace + '/';
}

function createStore(rootModule, options) {
    if (options === void 0) { options = {}; }
    var _a = rootModule.create([], ''), rootModuleOptions = _a.options, injectStore = _a.injectStore;
    var store = new vuex.Store(__assign({}, options, rootModuleOptions, { plugins: [injectStore].concat(options.plugins || []) }));
    return store;
}

exports.Module = Module;
exports.createStore = createStore;
exports.Getters = Getters;
exports.Mutations = Mutations;
exports.Actions = Actions;
exports.inject = inject;
exports.Context = Context;
exports.registerModule = registerModule;
exports.unregisterModule = unregisterModule;
