import * as tslib_1 from "tslib";
import { Store } from 'vuex';
import { Module } from './module';
export { Getters, Mutations, Actions, inject } from './assets';
export { Context } from './context';
export { registerModule, unregisterModule } from './register';
export { Module };
export function createStore(rootModule, options) {
    if (options === void 0) { options = {}; }
    var _a = rootModule.create([], ''), rootModuleOptions = _a.options, injectStore = _a.injectStore;
    var store = new Store(tslib_1.__assign({}, options, rootModuleOptions, { plugins: [injectStore].concat(options.plugins || []) }));
    return store;
}
