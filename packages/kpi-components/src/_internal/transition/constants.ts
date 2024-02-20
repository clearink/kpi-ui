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

// css transition
// 不做任何处理
export const NONE = 0

// 需要挂载
export const NEED_MOUNT = 1

// 需要运行 appear
export const NEED_APPEAR = 2

// 准备运行
export const READY = 3

// group transition
// 初始值
export const INIT = 0

// 需要更新子元素
export const UPDATE = 1

// 需要等待下一次循环
export const WAIT = 2

export const FLIP = 3
