import { Store } from 'vuex';
import { Commit, Dispatch } from './context';
import { MappedFunction } from './module';
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
export declare type Committer<M> = {
    [K in keyof M]: Payload<M[K]> extends never ? never : MappedFunction<M[K], void>;
};
export declare type Dispatcher<A> = {
    [K in keyof A]: Payload<A[K]> extends never ? never : MappedFunction<A[K], Promise<any>>;
};
export declare type BG<S> = Getters<S>;
export declare type BM<S> = Mutations<S>;
export declare type BA<S, G extends BG<S>, M extends BM<S>> = Actions<S, G, M>;
export declare type Payload<T> = T extends (payload?: infer P) => any ? P | undefined : T extends (payload: infer P) => any ? P : never;
export {};
