import { createContext, useContext } from 'react'
import type { ConsumerProps, ProviderProps } from 'react'

export default function ctxHelper<R extends unknown>(init: R) {
  const Context = createContext(init)
  function Provider(props: ProviderProps<R>) {
    const { children, value } = props
    return <Context.Provider value={value}>{children}</Context.Provider>
  }
  function Consumer(props: ConsumerProps<R>) {
    const { children } = props
    return <Context.Consumer>{children}</Context.Consumer>
  }
  function useState() {
    return useContext(Context)
  }
  return { Provider, Consumer, useState }
}
