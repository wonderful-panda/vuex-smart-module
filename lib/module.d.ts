import { Store } from 'vuex';
import { Payload, BA, BG, BM } from './assets';
import { Class } from './utils';
import { Context, Commit, Dispatch } from './context';
export declare type MappedFunction<Fn, R> = undefined extends Payload<Fn> ? (payload?: Payload<Fn>) => R : (payload: Payload<Fn>) => R;
export declare type RestArgs<Fn> = Fn extends (_: any, ...args: infer R) => any ? R : never;
export interface ModuleOptions<S, G extends BG<S>, M extends BM<S>, A extends BA<S, G, M>> {
    namespaced?: boolean;
    state?: Class<S>;
    getters?: Class<G>;
    mutations?: Class<M>;
    actions?: Class<A>;
    modules?: Record<string, Module<any, any, any, any>>;
}
export declare class Module<S, G extends BG<S>, M extends BM<S>, A extends BA<S, G, M>> {
    options: ModuleOptions<S, G, M, A>;
    private readonly actionNames;
    private readonly mutationNames;
    private mapper;
    constructor(options?: ModuleOptions<S, G, M, A>);
    clone(): Module<S, G, M, A>;
    context(store: Store<any>): Context<this>;
    mapState<K extends keyof S>(map: K[]): {
        [Key in K]: () => S[Key];
    };
    mapState<T extends Record<string, keyof S>>(map: T): {
        [Key in keyof T]: () => S[T[Key] & keyof S];
    };
    mapState<T extends Record<string, (state: S, getters: G) => any>>(map: T): {
        [Key in keyof T]: () => ReturnType<T[Key]>;
    };
    mapGetters<K extends keyof G>(map: K[]): {
        [Key in K]: () => G[Key];
    };
    mapGetters<T extends Record<string, keyof G>>(map: T): {
        [Key in keyof T]: () => G[T[Key] & keyof G];
    };
    mapMutations<K extends keyof M>(map: K[]): {
        [Key in K]: MappedFunction<M[Key], void>;
    };
    mapMutations<T extends Record<string, keyof M>>(map: T): {
        [Key in keyof T]: MappedFunction<M[T[Key] & keyof M], void>;
    };
    mapMutations<T extends Record<string, (commit: Commit<M>, ...args: any[]) => any>>(map: T): {
        [Key in keyof T]: (...args: RestArgs<T[Key]>) => ReturnType<T[Key]>;
    };
    mapActions<K extends keyof A>(map: K[]): {
        [Key in K]: MappedFunction<A[Key], Promise<any>>;
    };
    mapActions<T extends Record<string, keyof A>>(map: T): {
        [Key in keyof T]: MappedFunction<A[T[Key] & keyof A], Promise<any>>;
    };
    mapActions<T extends Record<string, (dispatch: Dispatch<A>, ...args: any[]) => any>>(map: T): {
        [Key in keyof T]: (...args: RestArgs<T[Key]>) => ReturnType<T[Key]>;
    };
}
