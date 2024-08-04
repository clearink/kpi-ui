import useNotification from './hooks/use_notification'
import makeStaticMethods from './utils/make_static_methods'

const notification = Object.assign(makeStaticMethods(), {
  useNotification,
})

export default notification

/**
 * 1. 一个函数
 * 2. 执行后会有success,info,error,warning四个方法
 */
