export type IState = Record<string, any>

export type IListener<State extends IState> = (
  newState: State,
  oldState: State,
) => void

export type Sotore<State extends IState> = {
  init: () => State
  subscribe: (listener: IListener<State>) => () => void
  get: () => State
  lay: (patch: Partial<State>, action?: string) => void
  set: (
    newState: State | ((prevState: State) => State),
    action?: string,
  ) => void
}

/**
 *
 * @param initial initail store state
 * @returns store instance
 */
export const sotore = <State extends IState>(initial: State) => {
  const listeners = new Set<IListener<State>>()
  let state = initial

  const store: Sotore<State> = {
    init: () => initial,
    subscribe: (listener) => {
      listeners.add(listener)

      return () => listeners.delete(listener)
    },
    get: () => state,
    lay: (patch, action) => store.set({ ...state, ...patch }, action),
    set: (newState) => {
      const prevState = state

      if (typeof newState === 'function') {
        state = (newState as (prevState: State) => State)(state)
      } else {
        state = newState
      }

      if (import.meta.env.DEV && state === prevState) {
        console.error('[sotore] State mutation is not allowed')
      }

      for (const handler of listeners) {
        handler(state, prevState)
      }
    },
  }

  return store
}

export * from './equal'
export * from './react'
export * from './middleware'
