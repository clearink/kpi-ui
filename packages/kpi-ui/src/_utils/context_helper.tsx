import { ConsumerProps, createContext, ProviderProps, useContext } from 'react'

// TODO: 改个名字
export default function contextHelper<R extends unknown>() {
  const Context = createContext(null as R)
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
