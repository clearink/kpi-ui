export const APPEAR = 0
export const ENTER = 1
export const ENTERED = 2
export const EXIT = 3
export const EXITED = 4

export const isExit = (status: number) => status === EXIT

export const isAppear = (status: number) => status === APPEAR

export const isEnter = (status: number) => status === ENTER

export const isEntered = (status: number) => status === ENTERED

export const isExited = (status: number) => status === EXITED
