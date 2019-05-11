import * as tslib_1 from "tslib";
import { Getters as BaseGetters, Mutations as BaseMutations, Actions as BaseActions } from './assets';
import { assert, mapValues, noop, combine } from './utils';
import { Context } from './context';
import { ComponentMapper } from './mapper';
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
                return gatherHandlerNames(actions.prototype, BaseActions);
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
                return gatherHandlerNames(mutations.prototype, BaseMutations);
            }
            else {
                return [];
            }
        },
        enumerable: true,
        configurable: true
    });
    Module.prototype.clone = function () {
        var options = tslib_1.__assign({}, this.options);
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
        var _a = this.options, namespaced = _a.namespaced, state = _a.state, getters = _a.getters, mutations = _a.mutations, actions = _a.actions, modules = _a.modules;
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
        var gettersInstance = getters && initGetters(getters, this);
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
export { Module };
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
function initGetters(Getters, module) {
    var getters = new Getters();
    var options = {};
    traverseDescriptors(Getters.prototype, BaseGetters, function (desc, key) {
        if (typeof desc.value !== 'function' && !desc.get) {
            return;
        }
        options[key] = function () {
            var res = getters[key];
            return typeof res === 'function' ? res.bind(getters) : res;
        };
    });
    return {
        getters: options,
        injectStore: function (store) {
            var context = module.context(store);
            Object.defineProperty(getters, '__ctx__', {
                get: function () { return context; }
            });
            getters.$init(store);
        }
    };
}
function initMutations(Mutations, module) {
    var mutations = new Mutations();
    var options = {};
    traverseDescriptors(Mutations.prototype, BaseMutations, function (desc, key) {
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
function initActions(Actions, module) {
    var actions = new Actions();
    var options = {};
    traverseDescriptors(Actions.prototype, BaseActions, function (desc, key) {
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
