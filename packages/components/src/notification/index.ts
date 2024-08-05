import { makeStaticMethods, useNotification } from './hooks/use_notification'

const notification = Object.assign(makeStaticMethods(), {
  useNotification,
})

export default notification

/**
 * 1. 一个函数
 * 2. 执行后会有success,info,error,warning四个方法
 * 3. 如何创建一个 holder 呢
 */

/**
 * 1. 使用 hook => <Portal .../>
 * 2. 全局
 *  1. 创建新的root
 *  2. 然后进行渲染(能复用hook的逻辑吗?)
 *
 */
