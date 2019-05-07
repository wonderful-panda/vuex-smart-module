import { Store, StoreOptions } from 'vuex';
import { Module } from './module';
export { Getters, Mutations, Actions, inject } from './assets';
export { Dispatch, Commit, Context } from './context';
export { registerModule, unregisterModule } from './register';
export { Module };
export declare function createStore(rootModule: Module<any, any, any, any>, options?: StoreOptions<any>): Store<any>;
