export const APPEAR = 'appear'
export const ENTER = 'enter'
export const ENTERED = 'entered'
export const EXIT = 'exit'
export const EXITED = 'exited'

export const isExit = (status: string) => status === EXIT

export const isAppear = (status: string) => status === APPEAR

export const isEnter = (status: string) => status === ENTER

export const isEntered = (status: string) => status === ENTERED

export const isExited = (status: string) => status === EXITED
