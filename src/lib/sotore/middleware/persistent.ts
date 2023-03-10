import { IState, Sotore } from '../'

const asIs = <State>(state: State) => state

type IConfig<State, JSONState> = {
  name: string
  deserialize?: (state: JSONState) => State
  serailize?: (state: State) => JSONState
  storage?: Storage
}

export const persistent = <JSONState, State extends IState>(
  store: Sotore<State>,
  options: IConfig<State, JSONState>,
) => {
  const {
    name,
    serailize = asIs,
    deserialize = asIs,
    storage = globalThis.localStorage,
  } = options

  // Init
  try {
    const dataString = storage.getItem(name) ?? ''

    store.set(deserialize(JSON.parse(dataString)), 'persistent')
  } catch (e) {}

  // Subscribe for updates
  store.subscribe(() => {
    const serailized = serailize(store.get())
    storage.setItem(name, JSON.stringify(serailized))
  })

  return store
}
