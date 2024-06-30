import { createContext, useContext } from 'react'

export function ctxHelper<R>(init: R) {
  const Context = createContext(init)

  return {
    Provider: Context.Provider,
    Consumer: Context.Consumer,
    useState: () => useContext(Context),
  }
}
