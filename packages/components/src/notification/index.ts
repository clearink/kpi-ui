import useNotification from './hooks/use_notification'
import builderNoticeUtils from './utils/builder'

// const globalNotification = notificationBuilder()

const notification = Object.assign(builderNoticeUtils(), {
  useNotification,
})

export default notification

/**
 * 1. 一个函数
 * 2. 执行后会有success,info,error,warning四个方法
 */
