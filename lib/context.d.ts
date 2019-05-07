import { Store, CommitOptions, DispatchOptions } from 'vuex';
import { Payload, Dispatcher, Committer } from './assets';
import { Module } from './module';
export interface Commit<M> {
    <K extends keyof M>(type: K, payload: Payload<M[K]>, options?: CommitOptions): void;
    <K extends keyof M>(payload: Payload<M[K]> & {
        type: K;
    }, options?: CommitOptions): void;
}
export interface Dispatch<A> {
    <K extends keyof A>(type: K, payload: Payload<A[K]>, options?: DispatchOptions): Promise<any>;
    <K extends keyof A>(payload: Payload<A[K]> & {
        type: K;
    }, options?: DispatchOptions): Promise<any>;
}
declare type State<Mod extends Module<any, any, any, any>> = Mod extends Module<infer R, any, any, any> ? R : never;
declare type Getters<Mod extends Module<any, any, any, any>> = Mod extends Module<any, infer R, any, any> ? R : never;
declare type Mutations<Mod extends Module<any, any, any, any>> = Mod extends Module<any, any, infer R, any> ? R : never;
declare type Actions<Mod extends Module<any, any, any, any>> = Mod extends Module<any, any, any, infer R> ? R : never;
export interface ContextPosition {
    path: string[];
    namespace: string;
}
export declare function commit(store: Store<any>, namespace: string, type: any, payload: any, options?: any): void;
export declare function dispatch(store: Store<any>, namespace: string, type: any, payload: any, options?: any): Promise<any>;
export declare function getters(store: Store<any>, namespace: string): any;
export declare class Context<Mod extends Module<any, any, any, any>> {
    private pos;
    private store;
    private mutationNames;
    private actionNames;
    private __committer__?;
    private __dispatcher__?;
    readonly committer: Committer<Mutations<Mod>>;
    readonly dispatcher: Dispatcher<Actions<Mod>>;
    commit: Commit<Mutations<Mod>>;
    dispatch: Dispatch<Actions<Mod>>;
    readonly state: State<Mod>;
    readonly getters: Getters<Mod>;
}
export {};
