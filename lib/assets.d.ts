import { Store } from 'vuex';
import { Commit, Dispatch } from './context';
interface Class<T> {
    new (...args: any[]): T;
}
export declare function inject<G extends Getters<S>, S>(Getters: Class<G>, injection: Partial<G & {
    state: S;
    getters: G;
}>): G;
export declare function inject<M extends Mutations<S>, S>(Mutations: Class<M>, injection: Partial<M & {
    state: S;
}>): M;
export declare function inject<A extends Actions<S, G, any, any>, S, G extends BG<S>>(Actions: Class<A>, injection: Partial<A & {
    state: S;
    getters: G;
    dispatch: any;
    commit: any;
}>): A;
export declare class Getters<S = {}> {
    $init(_store: Store<any>): void;
    protected readonly state: S;
    protected readonly getters: this;
}
export declare class Mutations<S = {}> {
    protected readonly state: S;
}
export declare class Actions<S = {}, G extends BG<S> = BG<S>, M extends BM<S> = BM<S>, A = {}> {
    $init(_store: Store<any>): void;
    protected readonly state: S;
    protected readonly getters: G;
    protected readonly commit: Commit<M>;
    protected readonly dispatch: Dispatch<A>;
    protected readonly actions: Dispatcher<A>;
    protected readonly mutations: Committer<M>;
}
export declare type CommitterMethod<Method> = Payload<Method> extends never ? never : Method extends (...args: infer Args) => any ? (...args: Args) => void : never;
export declare type Committer<M extends Mutations<any>> = {
    [K in Exclude<keyof M, keyof Mutations>]: CommitterMethod<M[K]>;
};
export declare type DispatcherMethod<Method> = Payload<Method> extends never ? never : Method extends (...args: infer Args) => infer R ? (...args: Args) => R extends Promise<any> ? R : Promise<R> : never;
export declare type Dispatcher<A extends {}> = {
    [K in Exclude<keyof A, keyof Actions>]: DispatcherMethod<A[K]>;
};
export declare type BG<S> = Getters<S>;
export declare type BM<S> = Mutations<S>;
export declare type BA<S, G extends BG<S>, M extends BM<S>> = Actions<S, G, M>;
export declare type Payload<T> = T extends (payload?: infer P) => any ? P | undefined : T extends (payload: infer P) => any ? P : never;
export {};
