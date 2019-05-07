import { Store, CommitOptions, DispatchOptions } from 'vuex'
import { Payload, Dispatcher, Committer } from './assets'
import { get } from './utils'
import { Module } from './module'

export interface Commit<M> {
  <K extends keyof M>(
    type: K,
    payload: Payload<M[K]>,
    options?: CommitOptions
  ): void
  <K extends keyof M>(
    payload: Payload<M[K]> & { type: K },
    options?: CommitOptions
  ): void
}

export interface Dispatch<A> {
  <K extends keyof A>(
    type: K,
    payload: Payload<A[K]>,
    options?: DispatchOptions
  ): Promise<any>
  <K extends keyof A>(
    payload: Payload<A[K]> & { type: K },
    options?: DispatchOptions
  ): Promise<any>
}

type State<Mod extends Module<any, any, any, any>> = Mod extends Module<
  infer R,
  any,
  any,
  any
>
  ? R
  : never

type Getters<Mod extends Module<any, any, any, any>> = Mod extends Module<
  any,
  infer R,
  any,
  any
>
  ? R
  : never

type Mutations<Mod extends Module<any, any, any, any>> = Mod extends Module<
  any,
  any,
  infer R,
  any
>
  ? R
  : never

type Actions<Mod extends Module<any, any, any, any>> = Mod extends Module<
  any,
  any,
  any,
  infer R
>
  ? R
  : never

export interface ContextPosition {
  path: string[]
  namespace: string
}

function normalizedDispatch(
  dispatch: Function,
  namespace: string,
  type: any,
  payload: any,
  options?: any
): any {
  if (typeof type === 'string') {
    return dispatch(namespace + type, payload, options)
  } else {
    return dispatch(
      {
        ...type,
        type: namespace + type.type
      },
      payload
    )
  }
}

export function commit(
  store: Store<any>,
  namespace: string,
  type: any,
  payload: any,
  options?: any
): void {
  normalizedDispatch(store.commit, namespace, type, payload, options)
}

export function dispatch(
  store: Store<any>,
  namespace: string,
  type: any,
  payload: any,
  options?: any
): Promise<any> {
  return normalizedDispatch(store.dispatch, namespace, type, payload, options)
}

export function getters(store: Store<any>, namespace: string): any {
  const sliceIndex = namespace.length
  const getters: Record<string, any> = {}

  Object.keys(store.getters).forEach(key => {
    const sameNamespace = namespace !== key.slice(0, sliceIndex)
    const name = key.slice(sliceIndex)
    if (sameNamespace && name) {
      return
    }

    Object.defineProperty(getters, name, {
      get: () => store.getters[key],
      enumerable: true
    })
  })

  return getters
}

export class Context<Mod extends Module<any, any, any, any>> {
  private __committer__?: Committer<Mutations<Mod>>
  private __dispatcher__?: Dispatcher<Actions<Mod>>
  /** @internal */
  constructor(
    private pos: ContextPosition,
    private store: Store<any>,
    private mutationNames: string[],
    private actionNames: string[]
  ) {}

  get committer(): Committer<Mutations<Mod>> {
    if (this.__committer__) {
      return this.__committer__
    }
    const committer: Record<string, any> = {}
    this.mutationNames.forEach(name => {
      Object.defineProperty(committer, name, {
        value: (payload: any) =>
          commit(this.store, this.pos.namespace, name, payload),
        enumerable: true
      })
    })
    return (this.__committer__ = committer as any)
  }

  get dispatcher(): Dispatcher<Actions<Mod>> {
    if (this.__dispatcher__) {
      return this.__dispatcher__
    }
    const dispatcher: Record<string, any> = {}
    this.actionNames.forEach(name => {
      Object.defineProperty(dispatcher, name, {
        value: (payload: any) =>
          dispatch(this.store, this.pos.namespace, name, payload),
        enumerable: true
      })
    })
    return (this.__dispatcher__ = dispatcher as any)
  }

  commit: Commit<Mutations<Mod>> = (
    type: any,
    payload: any,
    options?: any
  ): void => {
    return commit(this.store, this.pos.namespace, type, payload, options)
  }

  dispatch: Dispatch<Actions<Mod>> = (
    type: any,
    payload: any,
    options?: any
  ): any => {
    return dispatch(this.store, this.pos.namespace, type, payload, options)
  }

  get state(): State<Mod> {
    return get(this.pos.path, this.store.state)
  }

  get getters(): Getters<Mod> {
    return getters(this.store, this.pos.namespace)
  }
}
